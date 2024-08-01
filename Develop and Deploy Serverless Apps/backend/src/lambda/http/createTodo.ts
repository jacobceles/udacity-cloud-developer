import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createTodo } from '../../businessLogic/todos';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      // Validate input
      if (!event.body) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Request body is missing'
          })
        };
      }

      let newTodo: CreateTodoRequest;
      try {
        newTodo = JSON.parse(event.body);
      } catch (e) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Invalid JSON format'
          })
        };
      }

      // Ensure newTodo is valid
      if (!newTodo.name || !newTodo.dueDate) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Missing required fields'
          })
        };
      }

      // Process the request
      const newItem = await createTodo(newTodo, event);

      return {
        statusCode: 201,
        body: JSON.stringify({
          newItem
        })
      };

    } catch (error) {
      console.error('Error processing request', error);

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
