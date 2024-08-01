import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET
    ) {
    }

    async getTodoItems(userId: string): Promise<TodoItem[]> {
        try {
            const result = await this.docClient.query({
                TableName: this.todosTable,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            }).promise()
            return (result.Items as TodoItem[]).map( el => ({...el, attachmentUrl: `https://${this.bucketName}.s3.amazonaws.com/${el.todoId}`}))
        } catch (error) {
            logger.error('Failed to Fetch todoItems', error)
            return []
        }
    }

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()
        logger.info('Created todoItem', todoItem)
        return todoItem
    }

    async updateTodoItem(itemId: string, userId: string, payload: TodoUpdate) {
        logger.info(`'Attempting update with userId:${userId} & itemId:${itemId}'`)
            await this.docClient.update({
                TableName: this.todosTable,
                Key: {
                    todoId: itemId,
                    userId
                },
                // Expression attributes names to workaround reserved attributes issue
                ExpressionAttributeNames: { "#n": "name" },
                UpdateExpression: 'SET #n = :name, done = :done, dueDate = :dueDate',
                ExpressionAttributeValues: {
                    ':name': payload.name,
                    ':done': payload.done,
                    ':dueDate': payload.dueDate,
    
                }
            }).promise()
            .then(()=> logger.info('Updated todoItem', 'itemId', itemId, 'userId', userId, 'payload', payload))
            .catch(err => logger.error('Failed to upload: ', err))


       
    }

    async deleteTodoItem(itemId: string, userId: string) {
        logger.info(`Attempting to delte Item ${itemId} with User ${userId}`)
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                todoId: itemId,
                userId
            },
        }).promise()
        .then(() => logger.info(`Item ${itemId} deleted`))
        .catch(err => logger.error(`Failed to delete item ${itemId}`, {error: err}))
    }

    async getTodoItem(itemId: string): Promise<TodoItem> {
        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: 'todoId',
            KeyConditionExpression: 'todoId = :todoId',
            ExpressionAttributeValues: {
                ':todoId': itemId
            }
        }).promise()
        return result.Items[0] as TodoItem
    }
}

function createDynamoDBClient() {
    return new XAWS.DynamoDB.DocumentClient()
}