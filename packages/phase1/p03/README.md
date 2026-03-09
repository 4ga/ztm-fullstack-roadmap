# P03 Env Config + Fail-Fast

## Requirements

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

## Environment variables

This app validates environment variables on startup and fails fast if they are invalid.

Required / supported variables:

- `NODE_ENV` - one of: `development`, `test`, `production`
  - default: `development`
- `PORT` - positive integer
  - default: `3000`

Copy the example file:

```bash
cp .env.example .env
```

Important:

- Environment variables are read in `src/config.ts` only
- Invalid config prevents the server from starting
- Secrets must never be logged
