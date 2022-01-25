Demonstration of application functionality
1. login with existing account with existing challenge pool, open questions and open answers
   - lldemo@tempr.email
   - 123456789
2. create group to show async workload

Presentation of the system architecture
[Schaubild](https://app.diagrams.net/#G1YkT9ysZctfkS0ghIzVGWcQuxlOMpDJRh)

Demonstration of the cloud resources in the cloud provider UI
1. Amplify Apps
2. von da aus zu Cognito und AppSync gehen
3. DynamoDB Daten zeigen

Review of the cloud setup script
instrastructure-stack.ts zeigen
deploy.sh zeigen
create_amplify_app.sh zeigen

Creation of the different tenant types
create_amplify_app.sh ausführen

Demonstration of the CI/CD Pipeline
Änderung machen und pushen
GitHub Actions beobachten

Telemetry data
CloudWatch öffnen, Beispiel zeigen, zeigen dass das noch sehr viel mehr kann

Commercial model of the application
[Google Spreadsheet zeigen](https://docs.google.com/spreadsheets/d/1TFKLW81obnl-8ExXepsOn40TfKWki4uK3HHkYUYxock/edit?usp=sharing)

Special highlights the team want to show
- Ablauf mit JWT handling
- Monorepo
- Pair & Mob Programming
- (teilweise) Wechsel von Amplify zu Vercel
- SvelteKit unterstützt SSR
- Programmiersprachen (JVM in Lambda bad, node good)
- CDK (imperativ) compiles to CloudFormation (deklarativ)
- Build Prozess mit GitHub Actions