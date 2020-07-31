import * as compression from 'compression';
import * as express from 'express';
import * as zlib from 'zlib';

export function getCompressMethod(request: express.Request) {
  // prefer gzip
  if (request.acceptsEncodings(['gzip'])) {
    return { func: zlib.gzip, name: 'gzip' };
  } else if (request.acceptsEncodings(['deflate'])) {
    return { func: zlib.deflate, name: 'deflate' };
  } else if (request.acceptsEncodings(['br'])) {
    return { func: zlib.brotliCompress, name: 'br' };
  }
  return undefined;
}

export function setCompressHeader(response, method, zipHtml) {
  response.setHeader('Content-Encoding', method);
  response.setHeader('Content-type', 'text/html; charset=utf-8');
  response.setHeader('Vary', 'Accept-Encoding');
  response.setHeader('Content-Length', zipHtml.length.toString());
}

export function getCompressStaticFilter() {
  const isStatic = new RegExp('.(?:js|css)$');
  return function filter(req, res) {
    if (!isStatic.test(req.url)) {
      // don't compress responses with this request header
      return false;
    }
    // fallback to standard filter function
    return compression.filter(req, res);
  };
}
