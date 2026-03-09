# P04 Request ID and Logging

## Project Standards

- Validation failures: `400 {"error": "Bad Request"}`
- Unknown routes: `404 {"error": "Not Found"}`

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
## Request ID and Logging

Every request includes an `x-request-id`.

- If the client sends `x-request-id`, the server reuses it.
- Otherwise, the server generates one.
- The response always includes the final `x-request-id`.

Requests are logged as structured JSON with:

- `requestId`
- `method`
- `path`
- `status`
- `durationMs`

Sensitive data such as passwords, tokens, and auth headers are never logged.