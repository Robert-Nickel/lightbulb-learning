# Demonstration of application functionality
1. login with existing account with existing challenge pool, open questions and open answers
   - lldemo@tempr.email
   - 123456789
2. create group to show async workload

# Presentation of the system architecture
[Schaubild](https://app.diagrams.net/#G1YkT9ysZctfkS0ghIzVGWcQuxlOMpDJRh)

# Demonstration of the cloud resources in the cloud provider UI
- Amplify Apps
- von da aus zu
  - Cognito
  - AppSync
  - DynamoDB

# Review of the cloud setup script
instrastructure-stack.ts zeigen
deploy.sh zeigen
create_amplify_app.sh zeigen
[Build-Konfiguration in Vercel](https://vercel.com/lightbulb-learning/lightbulb-learning-cad/settings/general)

# Creation of the different tenant types
create_amplify_app.sh ausführen

# Demonstration of the CI/CD Pipeline
Änderung machen (Limit von 50 für standard auf 2 setzen, um Limitation zeigen zu können) und pushen
GitHub Actions beobachten

# Telemetry data
CloudWatch öffnen, Beispiel zeigen, zeigen dass das noch sehr viel mehr kann
TODO: Gutes Beispiel finden

# Commercial model of the application
[Google Spreadsheet zeigen](https://docs.google.com/spreadsheets/d/1TFKLW81obnl-8ExXepsOn40TfKWki4uK3HHkYUYxock/edit?usp=sharing)

# Special highlights the team want to show
- Ablauf mit JWT handling
- Monorepo
- Pair & Mob Programming
- (teilweise) Wechsel von Amplify zu Vercel wegen Qualitätsproblemen
- AWS Dokumentation oft in schlechtem Zustand
- SvelteKit unterstützt SPA & SSR (via Hydration)
- Programmiersprachen (Scala -> JVM in Lambda bad, NodeJS good)
- CDK (imperativ) compiles to CloudFormation (deklarativ)
- Build Prozess mit GitHub Actions