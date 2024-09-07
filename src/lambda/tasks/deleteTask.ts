import { APIGatewayProxyEvent } from 'aws-lambda';
import { baseHandler } from '../middleware';
import { taskStore } from '../taskStore';
import { apiResponse } from '../utils';

const deleteTask = async (event: APIGatewayProxyEvent) => {
  const taskId = event.pathParameters?.id;
  const deleted = taskStore.deleteTask(taskId!);
  if (!deleted) {
    return apiResponse(404, { error: 'Task not found' });
  }
  return apiResponse(204, null);
};

export const handler = baseHandler(deleteTask);
