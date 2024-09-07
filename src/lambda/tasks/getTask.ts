import { APIGatewayProxyEvent } from 'aws-lambda';
import { baseHandler } from '../middleware';
import { taskStore } from '../taskStore';
import { apiResponse } from '../utils';

const getTask = async (event: APIGatewayProxyEvent) => {
  const taskId = event.pathParameters?.id;
  const task = taskStore.getTask(taskId!);
  if (!task) {
    return apiResponse(404, { error: 'Task not found' });
  }
  return apiResponse(200, task);
};

export const handler = baseHandler(getTask);
