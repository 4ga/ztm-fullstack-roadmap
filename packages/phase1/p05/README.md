# P05 Global Error Handler

## Project Standards

- Validation failures: `400 {"error": "Bad Request"}`
- Unknown routes: `404 {"error": "Not Found"}`
- Unexpected errors: `500 { "error": "Internal Server Error" }`

## Install

```bash
npm install
```

## Run tests

```bash
npm test
```

## Run dev server (if applicable)

```bash
npm run dev
```

## Error responses

All errors return JSON in this format:

```json
{ "error": "string" }
```

### Standard error responses:

- 400 `{ "error": "Bad Request" }`
- 404 `{ "error": "Not Found" }`
- 500 `{ "error": "Internal Server Error" }`

### Notes:

- stack traces are never returned to clients
- the global error middleware is registered last
- the response includes `x-request-id` when request id middleware is present
