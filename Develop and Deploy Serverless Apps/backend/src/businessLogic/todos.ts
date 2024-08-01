import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';
import { getUserId } from '../lambda/utils';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import * as uuid from 'uuid'
import { TodosAccess } from '../dataLayer/todosAccess';
import { getUploadUrl } from '../fileStorage/attachmentUtils';

const todoAccess = new TodosAccess()

export async function getTodos(userId: string) {
    return await todoAccess.getTodoItems(userId)
}

export async function createTodo(
    createToDoRequest: CreateTodoRequest,
    event: APIGatewayProxyEvent
): Promise<TodoItem> {
    const itemId = uuid.v4()
    const userId = getUserId(event)

    const newItem: TodoItem = {
        ...createToDoRequest,
        userId: userId,
        todoId: itemId,
        done: false,
        attachmentUrl: '',
        createdAt: new Date().toISOString(),
    }

    return await todoAccess.createTodoItem(newItem)
}

export async function updateTodo(itemId: string, userId: string, payload: TodoUpdate) {
    await todoAccess.updateTodoItem(itemId, userId, payload)
}

export async function deleteTodo(itemId: string, event: APIGatewayProxyEvent) {
    const userId = getUserId(event)
    todoAccess.deleteTodoItem(itemId, userId)
}

export async function createAttachmentPresignedUrl(todoId: string) {
    return await getUploadUrl(todoId)
}
