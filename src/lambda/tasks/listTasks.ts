import { APIGatewayProxyEvent } from 'aws-lambda';
import { baseHandler } from '../middleware';
import { Task } from '../taskTypes';
import { taskStore } from '../taskStore';
import { apiResponse } from '../utils';

const listTasks = async (event: APIGatewayProxyEvent) => {
  const status = event.queryStringParameters?.status as Task['status'] | undefined;
  const tag = event.queryStringParameters?.tag;
  const tasks = taskStore.listTasks(status, tag);
  return apiResponse(200, tasks);
};

export const handler = baseHandler(listTasks);
