# P06 Todos CRUD API

Deterministic in-memory CRUD REST API built with Node.js, TypeScript, Express, Zod, Vitest, and Supertest.

## Endpoints

| Method | Path         | Body                                          | Success Response          |
| ------ | ------------ | --------------------------------------------- | ------------------------- |
| POST   | `/todos`     | `{ "title": "Buy milk" }`                     | `201` todo                |
| GET    | `/todos`     | none                                          | `200 { "items": Todo[] }` |
| GET    | `/todos/:id` | none                                          | `200` todo                |
| PATCH  | `/todos/:id` | `{ "title"?: string, "completed"?: boolean }` | `200` updated todo        |
| DELETE | `/todos/:id` | none                                          | `204`                     |

## Todo shape

```json
{
  "id": "todo-1",
  "title": "Buy milk",
  "completed": false
}
```

## Error responses

Validation failures:

```json
{ "error": "Bad Request" }
```

Not found:

```json
{ "error": "Not Found" }
```

Unexpected errors:

```json
{ "error": "Internal Server Error" }
```

## Examples

### Create

```http
POST /todos
Content-Type: application/json

{
  "title": "Learn Express"
}
```

Response:

```json
{
  "id": "todo-1",
  "title": "Learn Express",
  "completed": false
}
```

### List

```http
GET /todos
```

Response:

```json
{
  "items": [
    {
      "id": "todo-1",
      "title": "Learn Express",
      "completed": false
    }
  ]
}
```

### Patch

```http
PATCH /todos/todo-1
Content-Type: application/json

{
  "title": "Learn Express deeply",
  "completed": true
}
```

### Delete

```http
DELETE /todos/todo-1
```
