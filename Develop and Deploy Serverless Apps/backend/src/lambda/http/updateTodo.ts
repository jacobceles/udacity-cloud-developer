import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { updateTodo } from '../../businessLogic/todos';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      // Validate path parameter
      const todoId = event.pathParameters?.todoId;
      if (!todoId) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Todo ID is missing from path parameters'
          })
        };
      }

      // Validate input
      if (!event.body) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Request body is missing'
          })
        };
      }

      let updatedTodo: UpdateTodoRequest & { attachmentUrl?: string };
      try {
        updatedTodo = JSON.parse(event.body);
      } catch (e) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Invalid JSON format'
          })
        };
      }

      // Ensure updatedTodo contains necessary fields
      if (!updatedTodo.name && !updatedTodo.dueDate && !updatedTodo.attachmentUrl) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'No valid fields provided for update'
          })
        };
      }

      // Get user ID from utility function
      const userId = getUserId(event);

      // Update todo
      await updateTodo(todoId, userId, updatedTodo);

      return {
        statusCode: 200,
        body: JSON.stringify({
          updatedTodo
        })
      };

    } catch (error) {
      console.error('Error updating todo', error);

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Internal server error'
        })
      };
    }
  }
);

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  );
