import { APIGatewayProxyEvent } from 'aws-lambda';
import { z } from 'zod';
import { baseHandler } from '../middleware';
import { CreateTaskSchema, Task } from '../taskTypes';
import { taskStore } from '../taskStore';
import { apiResponse } from '../utils';

const createTask = async (event: APIGatewayProxyEvent) => {
  try {
    const taskData = CreateTaskSchema.parse(event.body);
    const newTask: Task = {
      id: crypto.randomUUID(),
      status: 'TODO',
      ...taskData,
    };
    taskStore.addTask(newTask);
    return apiResponse(201, newTask);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiResponse(400, { error: 'Invalid input', details: error.errors });
    }
    throw error;
  }
};

export const handler = baseHandler(createTask);
