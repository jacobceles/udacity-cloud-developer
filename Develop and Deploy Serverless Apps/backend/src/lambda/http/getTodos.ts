import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getTodos } from '../../businessLogic/todos'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    console.log('Getting items for user: ', userId)
    const todos  = await getTodos(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    }

  })

handler
.use(httpErrorHandler())
.use(
  cors({
    credentials: true,
    origin: '*'
  })
)