import { APP_BASE_HREF } from '@angular/common';
import * as express from 'express';
import * as redis from 'redis';

export function redisCache(indexHtml) {
  const REDIS_URL = process.env.REDIS_URL;
  const SSR_CACHE_PREFIX = process.env.SSR_CACHE_PREFIX || 'ng-universal';

  const redisClient = redis.createClient(REDIS_URL);

  redisClient.on('connect', () => {
    console.log(`connected to redis @ ${REDIS_URL}`);
  });

  redisClient.on('error', (err) => {
    console.log(`Redis Error: ${err}`);
  });

  // Creates a cache key using the request URL
  const cacheKey: (req: express.Request) => string = (req) =>
    `${SSR_CACHE_PREFIX}@${req.originalUrl}`;

  // Middleware to send a cached response if one exists
  const cachedResponse: express.RequestHandler = (req, res, next) =>
    redisClient.get(cacheKey(req), (error: Error, reply: string) => {
      if (reply?.length) {
        // Cache exists. Send the response.
        res.send(reply);
      } else {
        // Use the Universal engine to render a response.
        next();
      }
    });

  // Middleware to render a response using the Universal engine
  const universalRenderer: express.RequestHandler = (req, res) => {
    res.render(
      indexHtml,
      {
        req,
        providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
      },
      (error: Error, html: string) => {
        if (error) {
          return req.next(error);
        }
        if (res.statusCode === 200) {
          // Cache the rendered HTML
          redisClient.set(cacheKey(req), html);
        }
        res.send(html);
      }
    );
  };
  return { cachedResponse, universalRenderer };
}
