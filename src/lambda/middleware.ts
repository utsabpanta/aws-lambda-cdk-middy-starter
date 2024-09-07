import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const baseHandler = (
  handler: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>
) => {
  const middleware = middy(handler)
    .use(jsonBodyParser())
    .use(httpErrorHandler())
    .use({
      before: (handler) => {
        if (!handler.event.headers) {
          handler.event.headers = {};
        }
        if (!handler.event.headers['Content-Type'] && !handler.event.headers['content-type']) {
          handler.event.headers['Content-Type'] = 'application/json';
        }
      },
    });

  if (process.env.NODE_ENV !== 'local') {
    middleware.use(cors());
  }

  return middleware;
};
