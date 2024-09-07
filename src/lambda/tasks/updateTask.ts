import { APIGatewayProxyEvent } from 'aws-lambda';
import { z } from 'zod';
import { baseHandler } from '../middleware';
import { UpdateTaskSchema } from '../taskTypes';
import { taskStore } from '../taskStore';
import { apiResponse } from '../utils';

const updateTask = async (event: APIGatewayProxyEvent) => {
  try {
    const taskId = event.pathParameters?.id;
    const updateData = UpdateTaskSchema.parse(event.body);
    const updatedTask = taskStore.updateTask(taskId!, updateData);
    if (!updatedTask) {
      return apiResponse(404, { error: 'Task not found' });
    }
    return apiResponse(200, updatedTask);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiResponse(400, { error: 'Invalid input', details: error.errors });
    }
    throw error;
  }
};

export const handler = baseHandler(updateTask);
