# 12.factors.net

## I. Codebase
- erfuellt durch mono-repo struktur

## II. Dependencies
- alle dependencies werden in form von build.sbt (scala lambda funktionen) oder Node Module über die package.json angegeben

## III. Config
- 1. Resource handles to the database, Memcached, and other backing services
- AWS.Amplify DataStore weis wo die Tabellen sind?!
- 2. Credentials to external services such as Amazon S3 or Twitter
- haben wir nicht
- 3. Per-deploy values such as the canonical hostname for the deploy
- in awsCommon z.B. baseUrl, zaehlt das als "Environment Variable?"

## IV. Backing services
- Resourcen werden über Cloud Formation und mittels AWS-CDK gemanaged

## V. Build, release, run
- ??? 

## VI. Processes
- Code is executed als Lambda Funktion auf AWS (teilt keinen State)
- Sachen mit State werden in Dynamo DBs gespeichert (Gruppen)

## VII. Port binding
- ueber API Gateway schnittstelle nach außen mit default port (80)

## VIII. Concurrency
Wir können durch AWS beliebig skalieren

## IX. Disposability
Fast Startup and shutdown of processes

## X. Dev/prod parity
CI Pipeline wird bei jedem Commit ausgeführt mittels Github Actions

## XI. Logs
logs werden in streams mit dem jeweiligen context geloggt

## XII. Admin processes
- admin process `create_amplify_app.sh` in same environment? could be a todo!
