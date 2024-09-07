# aws-lambda-cdk-middy-starter

This project demonstrates a robust setup for AWS Lambda functions using Middy middleware, managed with AWS CDK, and featuring Zod for input validation. It includes a local development setup for testing Lambda functions and implements a Task Management API as an example.

## Key Features
- Use of Middy for middleware in Lambda functions
- Zod for runtime type checking and validation
- Infrastructure as Code using AWS CDK
- Local development environment and testing capability for Lambda functions without AWS deployment
- TypeScript support

## Project Structure

- `src/lambda/`: Contains Lambda function handlers
- `tasks/`: Contains handlers for the Task Management API
- `src/lib/`: Defines the CDK stack for deploying the Lambda function and API Gateway
- `src/local-runner.ts`: Local development server for Lambda functions

## Task Management API

The project includes a Task Management API as an example implementation. It demonstrates CRUD operations for tasks using Lambda functions and API Gateway.
API Endpoints:

- `POST /tasks`: Create a new task
- `GET /tasks`: List all tasks
- `GET /tasks/{id}`: Get a specific task
- `PUT /tasks/{id}`: Update a task
- `DELETE /tasks/{id}`: Delete a task

Each endpoint is implemented as a separate Lambda function, showcasing how to structure a serverless API.

## Prerequisites

- Node.js (v18 or later)
- AWS CLI configured with appropriate credentials

## Setup

- Clone this repository
- Run `npm install` to install dependencies
- Run `npm run start` This will run the `local-runner.ts` script that simulates API Gateway and Lambda environment. You can test the Task Management API endpoints using tools like curl or Postman.
Example curl command to create a task:

```
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete Project Proposal",
    "description": "Draft and finalize the project proposal for the new client",
    "status": "TODO",
    "dueDate": "2023-12-31T23:59:59Z",
    "tags": ["project", "client", "proposal"]
  }'
```

## Deploying to AWS

To deploy the stack to AWS:
- Make sure you have AWS CLI configured with appropriate credentials
- Run `npm run deploy`

This will deploy the TaskManagementStack to your default AWS account/region.
