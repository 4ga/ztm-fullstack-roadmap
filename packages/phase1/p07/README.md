## Database

This project stores todos in SQLite using `better-sqlite3`.

Migrations are stored in `migrations/` and applied in filename order.
Applied migrations are tracked in the `schema_migrations` table.

Run migrations manually with:

npm run migrate

The app also applies pending migrations on startup.

## Testing

Integration tests use an isolated in-memory SQLite database (`:memory:`).
Each test creates a fresh database, runs migrations, and closes the connection after the test.

To keep tests deterministic:

- todo IDs are injected
- timestamps are injected
- no state is shared across tests
