import { handler as createTaskHandler } from './lambda/tasks/createTask';
import { handler as getTaskHandler } from './lambda/tasks/getTask';
import { handler as updateTaskHandler } from './lambda/tasks/updateTask';
import { handler as deleteTaskHandler } from './lambda/tasks/deleteTask';
import { handler as listTasksHandler } from './lambda/tasks/listTasks';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import http from 'http';
import url from 'url';

const server = http.createServer(async (req, res) => {
  const chunks: Buffer[] = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', async () => {
    const body = Buffer.concat(chunks).toString();
    const parsedUrl = url.parse(req.url || '/', true);
    const pathSegments = parsedUrl.pathname?.split('/').filter(Boolean) || [];

    const event: APIGatewayProxyEvent = {
      httpMethod: req.method || 'GET',
      path: req.url || '/',
      queryStringParameters: parsedUrl.query as { [name: string]: string } | null,
      headers: req.headers as { [name: string]: string },
      body: body,
      isBase64Encoded: false,
      multiValueHeaders: {},
      multiValueQueryStringParameters: {},
      pathParameters: pathSegments[1] ? { id: pathSegments[1] } : null,
      stageVariables: null,
      requestContext: {
        accountId: '',
        apiId: '',
        authorizer: {},
        protocol: 'HTTP/1.1',
        httpMethod: req.method || 'GET',
        identity: {
          accessKey: null,
          accountId: null,
          apiKey: null,
          apiKeyId: null,
          caller: null,
          clientCert: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: req.socket.remoteAddress || '',
          user: null,
          userAgent: req.headers['user-agent'] || null,
          userArn: null,
        },
        path: req.url || '/',
        stage: 'local',
        requestId: '',
        requestTimeEpoch: Date.now(),
        resourceId: '',
        resourcePath: req.url || '/',
      },
      resource: '',
    };

    const context: Context = {
      callbackWaitsForEmptyEventLoop: true,
      functionName: '',
      functionVersion: '',
      invokedFunctionArn: '',
      memoryLimitInMB: '',
      awsRequestId: '',
      logGroupName: '',
      logStreamName: '',
      getRemainingTimeInMillis: () => 0,
      done: () => {},
      fail: () => {},
      succeed: () => {},
    };

    let result: APIGatewayProxyResult;

    try {
      if (req.method === 'POST' && parsedUrl.pathname === '/tasks') {
        result = (await createTaskHandler(event, context, () => {})) as APIGatewayProxyResult;
      } else if (req.method === 'GET' && pathSegments[0] === 'tasks' && pathSegments[1]) {
        result = (await getTaskHandler(event, context, () => {})) as APIGatewayProxyResult;
      } else if (req.method === 'PUT' && pathSegments[0] === 'tasks' && pathSegments[1]) {
        result = (await updateTaskHandler(event, context, () => {})) as APIGatewayProxyResult;
      } else if (req.method === 'DELETE' && pathSegments[0] === 'tasks' && pathSegments[1]) {
        result = (await deleteTaskHandler(event, context, () => {})) as APIGatewayProxyResult;
      } else if (req.method === 'GET' && parsedUrl.pathname === '/tasks') {
        result = (await listTasksHandler(event, context, () => {})) as APIGatewayProxyResult;
      } else {
        result = {
          statusCode: 404,
          body: JSON.stringify({ message: 'Not Found' }),
        };
      }

      if (result) {
        const headers: http.OutgoingHttpHeaders = {};
        if (result.headers) {
          Object.entries(result.headers).forEach(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'number') {
              headers[key] = value;
            } else if (Array.isArray(value)) {
              headers[key] = value.join(', ');
            }
          });
        }

        res.writeHead(result.statusCode || 200, headers);
        res.end(result.body);
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Not Found' }));
      }
    } catch (error) {
      console.error(error);
      res.writeHead(500);
      res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Local Lambda server is running at http://localhost:${port}`);
});
