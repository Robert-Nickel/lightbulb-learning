# Cloud Application Development Projekt: Lightbulb Learning
[meme-inspector.link](https://meme-inspector.link)

## Das Team
Das Team besteht aus Kevin Olomu ([@kolomu](https://github.com/kolomu)), Nicolai Stephan ([@nistephan](https://github.com/nistephan)) und Robert Nickel ([@Robert-Nickel](https://github.com/Robert-Nickel)).

## Problem
Lightbulb Learning hat die Vision, auf das langfristige Lernen zu optimieren. Die Anforderungen an Absolventen den Zukunft sind nicht die gleichen wie an die der Vergangenheit. Sie müssen kommunizieren, kollaborieren, komplexe Problemstellungen analysieren und Lösungen als Team entwickeln können. Aus dem Zugang zum Internet, und dem Wissen um den richtigen Umgang mit der gigantischen Menge an Informationen erwächst die Fähigkeit, die Lösungen für die Probleme der Zukunft entwickeln zu können.

## Lösung
Um dies zu erreichen, stellt Lightbulb Learning eine Lern- und Prüfungsplattform dar, auf der Studenten lernen sich originelle Fragen zu überlegen und diese zu formulieren, die Fragen der anderen Studenten präzise zu beantworten und sich gegenseitig Feedback dazu zu geben. Egal ob Frage, Antwort oder Feedback, jede Form der Partizipation ist auch ein Teil des Leistungsnachweises.

## Abgrenzung zur Masterarbeit
Im Sinne des Moduls "Cloud Application Development" wurde teilweise schon bestehende Architektur von Lightbulb Learning dahingehend erweitert, dass sämtliche Aspekte der Inhalte der Vorlesung darin vorkommen. Für diese Formen der Erweiterbarkeit war die Architektur von Anfang an, in Form von eventbasierter Kommunikation, ausgelegt. Dazu gehören der Assessment Service, der Simple Notification Service, der Simple Queue Service, die Lambdas sowie die Aspekte der Teilsysteme, welche die Multi-Tenancy betreffen.

## Cloud Anbieter: AWS
Als Cloud Provider entschieden wir uns für Amazon Web Services, dafür gab es mehrere Gründe
- AWS ist der etablierteste Cloud Anbieter, somit ist Erfahrung damit auf dem Arbeitsmarkt von großem Wert
- In vielen Aspekten ist die AWS technologischer Vorreiter, wie etwa in den Serverless Komponenten
- AWS verfügt über sehr viele unterschiedliche verwaltete Services, so dass man sehr viele Möglichkeiten zur Problemlösung hat
_TODO: Über mehr Gründe für AWS nachdenken, vielleicht in konkreter Abgrenzung zu den Alternativen?_

## Eventbasierte Architektur
Die Architektur von Lightbulb Learning ist asynchron eventbasiert. Damit ist gemeint, dass alle abonnierenden Komponenten in Form eines Events über Änderungen abonnierter Domainenobjekte informiert werden. Dadurch ist ein beliebig erweiterbarer _fan out_ von Informationen über in der Vergangenheit liegende Geschehnisse möglich, auf die alle Microservices und Functions nach eigenem Ermessen reagieren können. Dabei wird weder der Nutzer mit zusätzlicher Wartezeit, noch der Entwickler mit zusätzlicher Komplexität belangt. Die Events bilden dabei die API der Kompenenten, und werden entsprechend der Prinzipien der API Versionierung kompatibel gehalten.

Da die Zeitpunkte und der Umfang der auftretenden Ereignisse von äußeren Faktoren wir Nutzereingaben abhängt, muss ein Weg definiert sein, um auch mit starken Schwankungen umgehen zu können. Dabei unterstützt der Simple Queue Service der AWS. Die Queues werden als Abonennten der Simple Notification Service Topics definiert, und halten die Events persistent und in der richtigen Reihenfolge, bis sie von den zuständigen Abonennten abgearbeitet werden können.

Ein Beispiel: Legt ein Nutzer eine offene Frage an, so wirft die App ein "OpenQuestionCommittedEvent". Dieses Event landet auf dem `open-question-topic` topic, inklusive eines Zeitstempels, Typs und einigen Daten zum fachlichen Inhalt, wie den Fragetext und den Antworttext des committeten Objekts. Dieses Topic wird von der `createOpenQuestionQueue` und der  `Microservice-Assessment` Queue abonniert und Events für die Verarbeitung (unter Sicherstellung der korrekten Reihenfolge) persistiert. Die Absichten der beiden abonnierenden Microservices sind dabei völlig unterschiedlich, doch das ist dem Produzenten des Events weder bekannt noch wichtig. Selbst wenn überhaupt keine Komponente ein Event beachten würde: der Produzent des Events ist dafür nicht in der Verantwortung und stellt sich diese Frage nicht einmal.

## Tech Stack (Was benutzt ihr und warum?)

![](https://github.com/Lightbulb-Learning/lightbulb-learning/blob/main/documentation/system_architecture_cad.drawio.png)

### Frontend
Für das Frontend von Lightbulb Learning verwenden wir das recht moderne Frontend-Framework [SvelteKit](https://kit.svelte.dev/). Dieses ermöglicht WebApps aller Dimensionen, Dateisystembasiertes Routing und bei Bedarf eine Kombination aus Serverside Rendering (SSR) und Portable Web App (PWA). In unserem Fall entschieden wir uns erstmal für die PWA, da sonst Teile des Quellcodes sowohl auf dem Server (für das Prerendering) als auch später nochmal im Browser (für die Hydration) ausgeführt wird, was impliziert, dass die jeweiligen Abhängigkeiten auf beiden Seiten verfügbar sein müssen oder das entsprechend abgefangen werden muss. Ein weiterer Vorteil von Svelte ist die gute Entwicklererfahrung: Komponenten werden in einer einzigen Datei definiert (Mit Struktur, Interaktivität und Styling), können die Mechanismen der Reaktivität beinhalten und daraus wird hochoptimierter JavaScript+HTML+CSS Code generiert, welcher schlussendlich dem Browser ausgeliefert wird.

Als Programmiersprache verwenden wir für unser Frontend [TypeScript](https://www.typescriptlang.org/), eine typsichere und sehr populäre Variante von JavaScript. Die Vorteile von TypeScript sind enorm: Durch die starke Typisierung wird es IDEs ermöglicht, bessere Codevervollständigung anzubieten, Fehler früher zu erkennen und somit schneller besseren Code zu schreiben.

### Vercel
Vercel ist ein eigenständiger Service außerhalb von AWS für den Build und das Hosting von Frontend Apps. Zu Beginn des Projekts lösten wir diese Aufgaben (Build & Hosting) mit AWS Amplify, wechselten nach einiger Zeit auf Vercel, da Amplify starke Qualitätsprobleme und Kompatibilitätseinschränkungen mit Frontend-Applikationen wie SvelteKit Apps aufwies, welche die modernere Modul-Struktur anstelle der veralteten CommonJS-Struktur verwenden. Vercel ist moderner als Amplify und bietet eine wirklich angenehme Benutzbarkeit aus Entwicklersicht. Als GitHub App registriert kann es auf Pushes auf beliebige Branches reagieren, das heißt einem Commit folgt immer ein Checkout, einem Checkout folgt der Build und dem Build folgt ein Preview-Deployment, anhand derer unter realen Bedingungen neue Features getestet und evaluiert werden können. Sowohl das Domain-Management in Form eines DNS als auch das nötige Content Delivery Network für die Auslieferung der PWA wird von Vercel übernommen.
    
### API Gateway & Lambdas
Das API Gateway ist ein verwalteter Service von Amazon, welcher es ermöglicht APIs zu verwalten und zu überwachen.
API steht für Application Programming Interface und ist eine Programmierschnittstelle. Programmierer können mittels APIs Software erstellen die mit externen Systemen interagieren. Das API-Gateway dient als Eingangstor für die Anwendung. Es übernimmt Aufgaben wie die Annahme einer Anfrage, das Traffic Managament, CORS Unterstützung, Autorisierung, Zugriffskontrolle sowie Überwachung. In diesem Projekt wird hauptsächlich die HTTP-API verwendet. Diese ist leichtgewichtiger als die REST-API und ist dauer auch günstiger. Die HTTP-API ordnet einer Route eine Lambda-Funktion zu. In diesem Projekt handelt es sich hauptsächlich um POST-Anfragen, welche einen Payload beinhalten.

Die Zugriffskontrolle ist beispielswiese über sogenannte `Custom-Authorizer`-Lambdas möglich. In dem Authorizer, war es uns möglich über die Definition einer Lambda Funktion zu prüfen, ob die aktuelle Anfrage für die angeforderte Resource berechtigt ist. Wir haben versucht eine POST-Route mit einem `Custom-Authorizer` zu sichern. Mittels der REST-Testanwendung Postman konnte die Route `/upgradeGroup` mit der Lambda Funktion: `authorizationLambdaJS` abgesichert werden, sodass nur User die in AWS Cognito ein bestimmtes Attribut hatten, die Gruppe upgraden konnten. Im Browser war dies durch die Preflight-Anfrage wegen der CORS-Absicherung leider nicht möglich. Dabei haben wir festgestellt, dass die Lambda-Authorisierungsfunktionen nicht ohne weiteres leicht zu debuggen waren, da Log-Statements nicht aufgelistet wurden. Vermutlich eignen sich die Custom-Authorizer für `GET-Anfragen` um einiges besser.

**AWS Lambda** ist ein serverloser Rechenservice, welcher Code basierend auf Ereignissen ausführt und die Rechenresourcen automatisch verwaltet. 
Beispielsweise kann eine AWS Lambda ausgeführt werden, sobald ein User einen Challengepool anlegt. Dann könnte zum Beispiel Operationen an der Datenbank (z.B. DynamoDB) vorgenommen werden. Man kann somit Code verwenden um benutzerdefinierte Logik für AWS-Services bzw. eigene Backend-Services zu nutzen.
Dieser Code wird auf hochverfügbarer Recheninfrastruktur ausgeführt. Dadurch muss sich der Kunde keine Gedanken um die  unterliegenden Resourcen wie z.B. die Server machen. Vorteile hierbei sind Skalierbarkeit und Kosteneffizienz. Da der Code nur ausgeführt wird, wenn er benötigt wird, skaliert es mit der Anzahl der Anfragen. Dadurch, dass jede Anfrage zustandslos ist, ist eine horizontale Skalierung bis ins "unendliche" möglich. Man zahlt nur für die Ausführungszeit der Lambda Funktion statt für die Laufzeit des kompletten Servers.  
Somit gehört AWS Lambda in die Kategorie `Function-As-A-Service`. 

Die Lambdas werden in einer bevorzugten Programmiersprache auf dem Entwicklerrechner bzw. direkt in der Cloud geschrieben und auf den AWS Servern deployed.

Wir haben uns für Scala 3 sowie JavaScript für das entwickeln der Lambda-Funktionen entschieden. 
Scala komibniert objektorientierte und funktionale Programmierung in einer Sprache. Durch statischen Typen können Fehler in komplexen Anwendungen vermeiden werden. Scala verfügt über viele Module und sogar Java Libraries können direkt in Scala eingesetzt werden. Der Code kann in Java Code kompiliert werden. Dadurch muss keine neue Laufzeitumgebung installiert werden. Scala 3 hat viele breaking changes, sodass es nicht mühelos ist, Code für Scala 2 auszuführen.

Entwickelt wurden die Scala Lambda Funktionen auf einem Entwicklerrechner welche die Scala Version 3.0.1 und die sbt version 1.5.5 eingesetzt hat. 
Die Scala Dateien wurden dann in eine FAT-JAR Datei kompiliert und als ZIP-Datei implizit über das AWS-CDK hochgeladen.

Wir haben folgende Scala-Lambda-Funktionen definiert
- addUserToGroupHttpLambda
- addUserToGroupLambda
- commitOpenAnswerLambda
- commitOpenFeedbackLambda
- commitOpenQuestionLambda
- createGroupLambda
- createOpenQuestionLambda
- listUserGroupsHttpLambda
- upgradeGroupLambda

Ferner haben wir noch JavaScript Lambda Funktionen definiert:
- authorizationLambdaJS
- getGroupInformation
- getGroupStatus
- jwtHandler

Dabei handelt es sich um Node Package Module (NPM) welche auch über das AWS-CDK hochgeladen werden.
Für die Node Package Module wurde NodeJS mit der Version 17.2.0 eingesetzt.

### Amplify
AWS Amplify ist ein Accelerator für die Entwicklung von WebApps von AWS. Es kapselt einige weitere Dienste wie AppSync, Cognito und DynamoDB und stellt eine Reihe von Ressourcen zur Verfügung, um die Interaktion mit diesen Diensten im Sinne der schnellen Entwicklung zu vereinfachen. Wir starteten mit Amplify für die Umsetzung unserer Frontend Applikation inklusive offline-first Datenhaltung, Registrierung und Login, Hosting und automatisierte Builds. Die [Amplify CLI](https://docs.amplify.aws/cli/) bietet einen einfachen Weg, benötigte Ressourcen anzulegen und zu verwalten. Außerdem gibt es eine übersichtliche UI innerhalb der AWS Managementkonsole, welche nicht nur den aktuellen Status aller Ressourcen darstellt, sondern mit [Amplify Studio](https://aws.amazon.com/de/amplify/studio/) sogar bis auf die Ebene der Datenstruktur ermöglicht, direkt Änderungen vorzunehmen und zu deployen.

![](https://github.com/Lightbulb-Learning/lightbulb-learning/blob/main/documentation/amplify-studio.png)
Abb. 1: Darstellung des Datenmodells in Amplify Studio

### AppSync (Robert)
### Cognito (Kevin)
- Cognito ist ...
- special attributes pro User

### DynamoDB (Kevin)
- Was ist DynamoDB
- Warum DynamoDB

### Microservices (Nicolai)
    - Docker
    - K8s
    - evtl. Helm?
    - EKS & ECR
### Event driven architecture (Robert)
    - SNS
    - SQS
### CDK & CloudFormation (Kevin)
- Was ist Cloud Formation?

- Was ist CDK?

- Warum Infrastructure as Code?

- Was ist TypeScript?

    - TypeScript
    - imperativ -> deklarativ -> idempotent
### GitHub Actions

## 12 Factors
### I. Codebase
"Eine im Versionsmanagementsystem verwaltete Codebase, viele Deployments"
Wir benutzen eine Monorepo Strukur für das Projekt Lightbulb Learning. Das bedeutet, dass sämtlicher projektbezogener Code in einem einzigen git Repository auf GitHub verwaltet wird.

Die einzelnen Komponenten werden durch die Ordnerstruktur innerhalb dieses Repositories voneinander getrennt. Beispielsweise gibt es einen `app` Ordner, in dem sich der Code für das Frontend befindet, einen `infrastructure` Ordner, in dem sich die Konfiguration unsere Cloud-Infrastruktur befindet und so weiter.

Durch diese Struktur gibt es einige Vorteile:
- Die Verwaltung des Codes aus Entwicklersicht ist deutlich vereinfacht, da jeder nur ein Repository lokal verwalten muss. Änderungen sind unmittelbar sichtbar.
- Die Kompatibilität zwischen den einzelnen Komponenten ist stark vereinfacht. Bei der Entwicklung eines Features welches mehrere Komponenten betrifft, kann mit einem Branch gearbeitet werden, welcher alle Änderungen sämtlicher Komponenten beinhaltet. Somit ist zu jedem Zeitpunkt klar, welcher Stand der einzelnen Komponenten zu allen anderen Komponenten kompatibel ist.
- Auch Änderungen (Refactorings) an Bestandscode ist weniger ein Problem durch diese Struktur: Man kann alle Abhängigkeiten in einem einzigen Pull Request abbilden und muss beispielsweise eigene Libraries nicht durch komplexere Versionierung kompatibel halten.

### II. Abhängigkeiten
"Abhängigkeiten explizit deklarieren und isolieren"

Alle verwendeten Programmier-Bibliotheken werden in Form von Abhängigkeitsdeklarationen in den Paketsystemen SBT (Scala Build Tool) und NPM (Node Package Manager). Dies vereinfacht den Einstieg in die Entwicklung unseres Projekts: neue Entwickler brauchen nur wenig Tooling auf der lokalen Maschine (Ausnahmen: eine IDE z.B. Visual Studio Code, JDK, AWS-cli, amplify-cli, NodeJS, SBT, git).

### III. Konfiguration
"Die Konfiguration in Umgebungsvariablen ablegen"

Die Dateien `aws-exports.cjs` und `team-provider.json` sind eine Konfigurationsdatei, werden aber in git verwaltet. Da tenants eigene Branches kriegen, können die entsprechenden Dateien dann dort abgelegt werden. Der Grund für die einzelnen Branches pro Tenant liegt eigentlich in der funktionalen Anpassbarkeit in Abhängigkeit der Bedürfnisse und dem Whitelabelling für die Tenants.

Die Credentials für die Deployments werden über Umgebungsvariablen `AWS_ACCESS_KEY_ID` und `AWS_SECRET_ACCESS_KEY` bezogen und können so sowohl auf den Entwicklerrechnern jeweils unterschiedlich sein, als auch in der CI/CD Pipeline für einen technischen Benutzer definiert sein.

TODO: in awsCommon die baseUrl auslagern

### IV. Unterstützende Dienste
"Unterstützende Dienste als angehängte Ressourcen behandeln"

Für die Entwicklung des Projekts nutzen wir eine Reihe von unterstützenden Diensten von AWS, mit denen unsere Dienste unmittelbar kommunizieren.
- DynamoDB (Datenhaltung)
- Simple Notification Service (Messaging)
- Simple Queueing Service (Queueing)
- API Gateway
- Cognito

Die Definitionen der Resourcen werden mittels dem CDK (Cloud Development Kit) mit TypeScript imperativ erzeugt. Die daraus entstehenden Cloud Formation Konfigurationen sind deklarativ und ermöglichen somit sowohl den Abgleich mit aktuell laufenden Diensten (Drift Detection), das Hinzufügen und Entfernen weiterer Ressourcen zur Laufzeit des Infrastruktur-Stacks, als auch das Deployment aller benötigten Ressourcen in einer frischen Infrastrukturumgebung.

### V. Build, release, run
"Build- und Run-Phase strikt trennen"

Bei den Scala Lambdas wird in der Build-Phase mittels SBT eine .jar-Datei erzeugt, welche alle Abhängigkeiten zu Bibliotheken beinhaltet. Da wir diese Lambdas so konzipiert haben, dass sie nicht auf Deployment-abhängige Konfiguration angewiesen sind, werden diese JARs im nächsten Schritt zu AWS Lambda hochgeladen und bereitgestellt.

Bei unseren NodeJS Lambdas läuft dieser Prozess ganz ähnlich, nur dass anstelle der .jar-Dateien eine `index.js` Datei in Kombination mit einem `node_modules` Ordner, der alle Abhängigkeiten beinhaltet, hochgeladen wird.

Der Frontend-Code durchläuft diesen Prozess in Vercel, einem Dienst für das Hosting von Web-Apps mit einem Fokus auf moderne Frontend-Frameworks wie SvelteKit. Im Build-Prozess werden zuerst die .svelte Dateien in hochoptimiertes HTML, CSS und JavaScript transpiliert. Ein Release wird dann von Vercel erzeugt, indem die Konfiguration in Form von Umgebungsvariablen zur Verfügung gestellt wird. Vercel bietet zusätzlich für jeden Release eine Preview an (sinnvoll für Feature-Branches), welcher evaluiert werden kann, bevor man diesen Stand zur Prod-Version deklariert (über einen Merge auf den `main` Branch). Dies entspricht dem "run" dieses Faktors.

### VI. Prozesse
"Die App als einen oder mehrere Prozesse ausführen"

Lambdas keinen Zustand teilen, da die Instanzen, auf denen sie ausgeführt werden, keinen Vertrag über die Zuverlässigkeit der Erhaltung dieser Instanz anbieten. Das bedeutet beispielsweise, dass keine Dateien abgelegt und in einer späteren Ausführung wieder ausgelesen werden können. Das Paradigma Function-as-a-Service beinhaltet per Definition, dass die damit gebauten Applikationen völlig zustandslos und "Shared Nothing" sind.

Für die Authentifizierung und Autorisierung verwenden wir statt der üblichen Sessions self-contained JWTs. Das bedeutet, dass diese sowohl über Access Token, Refresh Token, ID Token als auch eine Signatur verfügen, und somit validierte Schlüsse über den Ersteller einer Anfrage zulassen.

Für die Datenhaltung verwenden wir DynamoDB, wo auch der funktionale Zustand, beispielsweise Veränderungen von Daten, abgelegt werden.

### VII. Bindung an Ports
"Dienste durch das Binden von Ports exportieren"

Da in unserem Backend in Form von AWS Lambdas die Laufzeitumgebung sowie auch das Portmapping vollständig von AWS übernommen wird, mussten wir uns nicht manuell um die Injektion eines Webservers kümmern. Die Routing Schicht bilden wir mit dem Dienst AWS API Gateway ab.

### VIII. Nebenläufigkeit
"Mit dem Prozess-Modell skalieren"

Die Prozess-Formation unserer Anwendung wird, wie so vieles, durch AWS und nicht manuell von uns verwaltet. Das bedeutet, dass unser API Gateway vermutlich Web-Prozesse nutzt, während beispielsweise die Lambdas Worker-Prozesse nutzen. Die aus diesem Faktor hervorgehenden Vorteile bleiben dennoch erhalten: Die Prozesse sind hervorragend horizontal teilbar (z.B. da sie stateless sind), und können somit planetweit skaliert werden. 

### IX. Einweggebrauch
"Robuster mit schnellem Start und problemlosen Stopp"

Die Verwaltung der Prozesse innerhalb der AWS Cloud wird von Profis übernommen, weltweit angewendet und reflektiert die interenen Kosten für den Betrieb der Cloud: Je schneller die Prozesse beim `SIGTERM` Signal stoppen können, desto eher kann die dafür verwendete Hardware-Ressource anderweitig vermietet und somit monetarisiert werden. Daher ist davon auszugehen, dass diese auf den schneller Start, Stop und Wechsel zwischen Prozessen optimiert haben. Beispielsweise die Worker Prozesse der Lambdas erfüllen die Metapher der "Schafe statt Kühe" besonders gut.

### X. Dev-Prod-Vergleichbarkeit
"Entwicklung, Staging und Produktion so ähnlich wie möglich halten"

Unsere Continious Deployment Pipeline wird bei jedem Commit mittels Github Actions automatisch ausgeführt. Bei Fehlern während des Builds werden alle per E-Mail informiert. Da die Cloud-Dienste nur teilweise auch lokal betrieben werden können, wird schon für die Entwicklung permanent deployed. Dadurch verlängert sich die Länge der Feedbackschleife (was frustrierend sein kann). Der Vorteil ist, dass die Dienste wirklich immer gleich sind.

|                                        | Traditionelle App | Zwölf-Faktor-App       | Lightbulb Learning                                                     |
| -------------------------------------- | ----------------- | ---------------------- | ---------------------------------------------------------------------- |
| Zeit zwischen Deployments              | Wochen            | Stunden                | pro Commit -> Stunden                                                  |
| Code-Autoren und Code-Deployer         | Andere Menschen   | Dieselben Menschen     | Diesselben Menschen                                                    |
| Entwicklungs- und Produktions-Umgebung | Unterschiedlich   | So ähnlich wie möglich | Frontend: fast gleich, Lambdas, DynamoDB & IaC direkt in AWS -> gleich |

### XI. Logs
"Logs als Strom von Ereignissen behandeln"

Für das Logging verwenden wir an jeder Stelle den `stdout`, AWS kümmert sich darum, die Logs im Dienst CloudWatch zu aggregieren und les- und filterbar zu machen.

### XII. Admin-Prozesse
"Admin/Management-Aufgaben als einmalige Vorgänge behandeln"

Alle von uns verwendeten Programmiersprachen verfügen über einen REPL (read-eval-print loop) Mechanismus, sodass administrative Eingriffe darüber getriggert werden können. Unser einziger administrativer Schritt ist das Anlegen eines neuen Premium-Tenants, dafür befindet sich der Code in der Versionsverwaltung. Die Ausführung wird, wegen sonst überflüssiger Abhängigkeiten, von lokal getriggert. Ein besserer Ansatz wäre, diese Ausführung beispielsweise mit GitHub Actions durchzuführen.

## Multi-Tenancy und Multi-User (Nicolai)
    - Welche Arten haben wir und was ist der Unterschied?
    - Konzept mit Gruppen erstellen und beitreten
    - Filterung der CP aus Grundlage der Gruppen/Tenants
    

## Processes (Wie geht ihr vor?)
    - Continuous Delivery &  Version Control (Git) (Nicolai)
    - Infrastructure as Code / CDK (Kevin)
      - Hier erklaeren was wir provisionieren mit Code
      - Umgebungsvariablen? Produktion und DEV system?
    - Skript für Premium tenants [create_amplify_app.sh](../infrastructure/create_amplify_app.sh) (Nicolai)
        - Branch for premium tenants
        - Versuch das mit GitHub Actions zu machen gescheitert -> Amplify das falsche Tool für den Job
    
## Commercial SaaS (Nicolai)
    - Cost analysis
    - Commercial Model

# Special highlights the team want to show
## Monorepo
Die Verwendung eines Monorepos brachte mehr Vor- als Nachteile mit sich, weshalb wir uns frühzeitig dafür entschieden. Da wir viele Komponenten (Lambdas, API Gateway, ...) haben, die miteinander kommunizieren und dafür Schnittstellen definieren müssen, müssten diese eigentlich entsprechend explizit versioniert werden. Die Komplexität dieses Unterfangens ist nicht zu unterschätzen, da das Gesamtsystem zu jedem Zeitpunkt vollständig kompatibel gehalten werden muss. So müsste man in einigen Fällen Funktionen zeitgleich deployen, was sehr schwer umzusetzen ist. Hier zeigt die Monorepo Struktur seine Stärke: Alle Änderungen können auf einem einzigen Branch gepusht werden, und beim Merge dieses Branches werden alle Schnittstellen-Änderungen in einem einzigen Deployment auf die Produktionsumgebung gebracht, wodurch eine nahtlose Funktionsfähigkeit der Anwendung garantiert wird.

## Ablauf mit JWT handling [K]
