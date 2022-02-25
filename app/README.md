# Lightbulb Learning

## Developing

### Local supabase instance

You can run your local instance of supabase by following these steps:

1. Install the supabase CLI on your system

```bash
brew install supabase/tap/supabase
```

2. Start the supabase instance with

```bash
supabase start
```

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

## Connect to hosted supabase

Connect to LightbulbLearningDev
```bash
psql -h db.ckjsuzpqlhcjbonsnuzp.supabase.co -U postgres
```

Connect to LightbulbLearning (PROD)
```bash
psql -h db.rkpsxesguhibbzhylmsd.supabase.co -U postgres```