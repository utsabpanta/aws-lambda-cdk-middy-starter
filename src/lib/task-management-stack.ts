import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class TaskManagementStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda functions for each task operation
    const createTaskFunction = new lambda.Function(this, 'CreateTaskFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'createTask.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '..', 'lambda', 'tasks')),
    });

    const getTaskFunction = new lambda.Function(this, 'GetTaskFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'getTask.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '..', 'lambda', 'tasks')),
    });

    const updateTaskFunction = new lambda.Function(this, 'UpdateTaskFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'updateTask.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '..', 'lambda', 'tasks')),
    });

    const deleteTaskFunction = new lambda.Function(this, 'DeleteTaskFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'deleteTask.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '..', 'lambda', 'tasks')),
    });

    const listTasksFunction = new lambda.Function(this, 'ListTasksFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'listTasks.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '..', 'lambda', 'tasks')),
    });

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'TaskApi', {
      restApiName: 'Task Management API',
    });

    const tasks = api.root.addResource('tasks');
    const singleTask = tasks.addResource('{id}');

    // Connect API Gateway endpoints to Lambda functions
    tasks.addMethod('POST', new apigateway.LambdaIntegration(createTaskFunction));
    tasks.addMethod('GET', new apigateway.LambdaIntegration(listTasksFunction));
    singleTask.addMethod('GET', new apigateway.LambdaIntegration(getTaskFunction));
    singleTask.addMethod('PUT', new apigateway.LambdaIntegration(updateTaskFunction));
    singleTask.addMethod('DELETE', new apigateway.LambdaIntegration(deleteTaskFunction));

    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
  }
}

const app = new cdk.App();
new TaskManagementStack(app, 'TaskManagementStack');
