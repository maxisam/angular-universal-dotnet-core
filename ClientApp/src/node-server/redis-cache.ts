import { APP_BASE_HREF } from '@angular/common';
import * as buffer from 'buffer';
import * as express from 'express';
import * as redis from 'redis';

import { getCompressMethod, setCompressHeader } from './compression';

export function redisCache(indexHtml) {
  const REDIS_URL = process.env.REDIS_URL;
  if (!REDIS_URL) {
    return undefined;
  }
  const SSR_CACHE_PREFIX = process.env.SSR_CACHE_PREFIX || 'ng-universal';

  const redisClient = redis.createClient(REDIS_URL);

  redisClient.on('connect', () => {
    console.log(`connected to redis @ ${REDIS_URL}`);
  });

  redisClient.on('error', (err) => {
    // TODO: add logging to log error
    console.log(`Redis Error: ${err}`);
  });

  // Creates a cache key using the request URL
  const cacheKey: (req: express.Request) => string = (request) =>
    `${SSR_CACHE_PREFIX}@${request.originalUrl}`;

  // Middleware to send a cached response if one exists
  const cachedResponse: express.RequestHandler = (request, response, next) => {
    redisClient.get(cacheKey(request), (error: Error, reply: string) => {
      if (reply?.length && request.acceptsEncodings(['gzip'])) {
        // Cache exists. Send the response.
        // currently only gzip is cached
        setCompressHeader(response, 'gzip', reply);
        response.send(reply);
      } else {
        // Use the Universal engine to render a response.
        next();
      }
    });
  };

  // Middleware to render a response using the Universal engine
  const universalRenderer: express.RequestHandler = (request, response) => {
    response.render(
      indexHtml,
      {
        req: request,
        providers: [{ provide: APP_BASE_HREF, useValue: request.baseUrl }],
      },
      (error: Error, html: string) => {
        if (error) {
          // TODO: add logging to log error
          return request.next(error);
        }
        const compressFunc = getCompressMethod(request);
        if (compressFunc) {
          compressFunc.func(
            buffer.Buffer.from(html, 'utf-8'),
            (zipError, zipHtml) => {
              if (zipError) {
                // if something wrong with compression, send html directly
                // TODO: add logging to log error
                return request.next(html);
              }
              if (response.statusCode === 200) {
                // only cache gzip result
                if (compressFunc.name === 'gzip') {
                  // Cache the rendered HTML
                  redisClient.set(cacheKey(request), zipHtml);
                }
              }
              compressFunc &&
                setCompressHeader(response, compressFunc.name, zipHtml);
              response.send(zipHtml);
            }
          );
        } else {
          response.send(html);
        }
      }
    );
  };
  return { cachedResponse, universalRenderer };
}
