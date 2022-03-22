# Lightbulb Learning

## Developing

### Local supabase instance

[Official Reference](https://supabase.com/docs/guides/local-development)

You can run your local instance of supabase by following these steps:

1. Install the supabase CLI on your system

```bash
brew install supabase/tap/supabase
```

2. Start the supabase instance with

```bash
supabase start
```

### Developing tables
1. Change everything directly on your local supabase.
2. Commit the changes with `supabase db commit what_you_did_goes_here`. It shows up in the migrations folder now.
3. Run `supabase db reset` to verify that the new migration does not generate errors.
4. Generate the models in the frontend by executing `npm run genTypes`.
5. Add the constants and functions you need in `src/lib/supabaseClient.ts`.
6. Theoretically the structural db changes can be pushed with `supabase db push`, but I dont feel safe about that yet, so I run the migrations currently manually on the Dev and Prod environment. TODO: further investigation and improvement of this step.

### Connecting app to database

In order to connect to a database, you need to define the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in a `.env`-file. If you want to use the local database, you get those values after starting supabase. If you want to connect to a remote database instance, those values are in the supabase settings.

### Start SvelteKit App

Install the dependencies with
```bash
npm install
```
Then start a development server with:

```bash
npm run dev
```

### Testing

- Install the [official Playwright Plugin for VSC](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) for some nice tooling like debugging.
- Use the Page Object Pattern (check performancePage.ts for an example).
- Use `npm run test` to execute the existing tests
- Use `npx playwright codegen` if that helps creating new tests.
- Add the data you need for testing in seed.sql.

## Connect to hosted supabase

Connect to LightbulbLearningDev
```bash
psql -h db.ckjsuzpqlhcjbonsnuzp.supabase.co -U postgres
```

Connect to LightbulbLearning (PROD)
```bash
psql -h db.rkpsxesguhibbzhylmsd.supabase.co -U postgres
```

## Backup
Create a PROD backup: `pg_dump 'postgres://postgres:[PASSWORD]@db.rkpsxesguhibbzhylmsd.supabase.co:5432/postgres' > database-dump.sql`

Restore a PROD backup: `psql 'postgres://postgres:[PASSWORD]@db.rkpsxesguhibbzhylmsd.supabase.co:5432/postgres' < database-dump.sql`
