# Cloud Application Development Projekt: Lightbulb Learning
[meme-inspector.link](https://meme-inspector.link)

## Das Team
Das Team besteht aus Kevin Olomu ([@kolomu](https://github.com/kolomu)), Nicolai Stephan ([@nistephan](https://github.com/nistephan)) und Robert Nickel ([@Robert-Nickel](https://github.com/Robert-Nickel)).

## Problem
Lightbulb Learning hat die Vision, auf das langfristige Lernen zu optimieren. Die Anforderungen an Absolventen den Zukunft sind nicht die gleichen wie an die der Vergangenheit. Sie müssen kommunizieren, kollaborieren, komplexe Problemstellungen analysieren und Lösungen als Team entwickeln können. Aus dem Zugang zum Internet, und dem Wissen um den richtigen Umgang mit der gigantischen Menge an Informationen erwächst die Fähigkeit, die Lösungen für die Probleme der Zukunft entwickeln zu können.

## Lösung
Um dies zu erreichen, stellt Lightbulb Learning eine Lern- und Prüfungsplattform dar, auf der Studenten lernen sich originelle Fragen zu überlegen und diese zu formulieren, die Fragen der anderen Studenten präzise zu beantworten und sich gegenseitig Feedback dazu zu geben. Egal ob Frage, Antwort oder Feedback, jede Form der Partizipation ist auch ein Teil des Leistungsnachweises.

## Abgrenzung zur Masterarbeit
Im Sinne des Moduls "Cloud Application Development" wurde teilweise schon bestehende Architektur von Lightbulb Learning dahingehend erweitert, dass sämtliche Aspekte der Inhalte der Vorlesung darin vorkommen. Für diese Formen der Erweiterbarkeit war die Architektur von Anfang an, in Form von eventbasierter Kommunikation, ausgelegt. Dazu gehören alle Leistungen rund um den Assessment Service im EKS, dem Message Broker, den Queues, die Lambdas sowie die Aspekte der Teilsysteme, welche die Multi-Tenancy betreffen.

## Cloud Anbieter: AWS
Als Cloud Provider entschieden wir uns für Amazon Web Services, dafür gab es mehrere Gründe
- AWS ist der etablierteste Cloud Anbieter, somit ist Erfahrung damit auf dem Arbeitsmarkt von großem Wert
- In vielen Aspekten ist die AWS technologischer Vorreiter, wie etwa in den Serverless Komponenten
- AWS verfügt über sehr viele unterschiedliche verwaltete Services, so dass man sehr viele Möglichkeiten zur Problemlösung hat
_TODO: Über mehr Gründe für AWS nachdenken, vielleicht in konkreter Abgrenzung zu den Alternativen?_

## Technologie Stack

![](https://github.com/Lightbulb-Learning/lightbulb-learning/blob/main/documentation/system_architecture_cad.drawio.png)
Abb. 1: Übersicht der System Architektur

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
Abb. 2: Darstellung des Datenmodells in Amplify Studio

### AppSync
[AWS AppSync](https://aws.amazon.com/de/appsync/) nutzen wir indirekt durch Amplify. Die Idee dieses Services ist das automatisierte Mapping einer Datenstruktur aus DynamoDB auf eine [GraphQL API](https://graphql.org/). Dafür lädt man ein GraphQL-Schema hoch, welches die gewünschte Struktur beschreibt, und sowohl die dafür benötigten Tabellen als auch die Bereitstellung des Endpunkts wird von AppSync übernommen. Das GraphQL-Schema beinhaltet außerdem die Zugriffsregeln auf die jeweiligen Daten. Beispielsweise ist es in unserem Fall nur den Erstellern eines OpenQuestionDrafts gestattet, diesen zu lesen, zu verändern oder zu löschen.

### Cognito
[Amazon Cognito](https://aws.amazon.com/cognito/) erlaubt es schnell und einfach Benutzeranmeldungen und Zugriffskontrollen für Web-und Mobil Anwendungen hinzuzufügen. Über Userpools lassen sich beispielsweise pro Premium Tenant mehrere Benutzer abbilden. Zudem ist es möglich innerhalb eines Userpools Benutzer einer oder mehreren Gruppen hinzufügen. In Cognito lassen sich auch die Attribute eines jeden Nutzers definieren. Bei lightbulb-learning setzen wir beispielsweise ein eigenes Attribut: `admin_of_group`. Damit lässt sich dann bestimmen welcher User der Administrator einer Gruppe ist.

### DynamoDB
[Amazon DynamoDB](https://aws.amazon.com/dynamodb/) ist eine verwaltete NoSQL Key-Value Datenbank. DynamoDB bietet eine integrierte Sicherheit, kontinuerliche Backups, Replikationen basierend auf Regionen und Datenbankverwaltungswerkzeuge. In diesem Projekt wird die DynamoDB mit AppSync eingesetzt. Für jeden premium Tenant werden separat DynamoDB Instanzen provisioniert. 

Es werden folgende Tabellen in DynamoDB gepflegt:
- ChallengePoolTable
- OpenAnswerDraftTable
- OpenAnswerTable
- OpenFeedbackDraftTable
- OpenFeedbackTable
- OpenQuestionDraftTable
- OpenQuestionTable

### Microservices
Es wurde ein Microservice mit `Docker` erstellt. Dieser Dockercontainer konnte dann bei der [Amazon Elastic Container Registry (Amazon ECR)](https://aws.amazon.com/de/ecr/) gespeichert werden. Dadurch war man in der Lage ein [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/de/eks/) einzurichten, das auf den gespeicherten Dockercontainer zugreifen kann. Das EKS wurde so eingerichtet, dass ein Kubernetes Cluster mit zwei EC2 Instanzen ausgeführt wird.

Nachdem die meiste Funktionalität mit AWS Lambdas umgesetzt wurde, hat man entschieden, dass kein Microservice für das Projekt benötigt wird. Der größte Vorteil, der aus dieser Entscheidung entsteht, ist, dass durch die Lambdas um ein vielfaches weniger Kosten entstehen. Die EC2 Instanzen müssten durchgehend aktiv sein, während die Lambdas nur für die eigentliche Ausführungszeit berechnet werden.	

### Event driven Architektur

Die Architektur von Lightbulb Learning war zu Beginn asynchron eventbasiert geplant. Damit ist gemeint, dass alle abonnierenden Komponenten in Form eines Events über Änderungen abonnierter Domainenobjekte informiert werden. Dadurch ist ein beliebig erweiterbarer _fan out_ von Informationen über in der Vergangenheit liegende Geschehnisse möglich, auf die alle Microservices und Functions nach eigenem Ermessen reagieren können. Dabei wird, soweit die Theorie, weder der Nutzer mit zusätzlicher Wartezeit, noch der Entwickler mit zusätzlicher Komplexität belangt. Die Events bilden dabei die API der Kompenenten, und werden entsprechend der Prinzipien der API Versionierung kompatibel gehalten.

Da die Zeitpunkte und der Umfang der auftretenden Ereignisse von äußeren Faktoren wir Nutzereingaben abhängt, muss ein Weg definiert sein, um auch mit starken Schwankungen umgehen zu können. Dabei unterstützt der Simple Queue Service (SQS) der AWS. Die Queues werden als Abonennten der [Simple Notification Service](https://aws.amazon.com/de/sns/) (SNS) Topics definiert, und halten die Events persistent und in der richtigen Reihenfolge, bis sie von den zuständigen Abonennten abgearbeitet werden können.

Ein Beispiel: Legt ein Nutzer eine offene Frage an, so wirft die App ein "OpenQuestionCommittedEvent". Dieses Event landet auf dem `open-question-topic` topic, inklusive eines Zeitstempels, Typs und einigen Daten zum fachlichen Inhalt, wie den Fragetext und den Antworttext des committeten Objekts. Dieses Topic wird von der `createOpenQuestionQueue` und der  `Microservice-Assessment` Queue abonniert und Events für die Verarbeitung (unter Sicherstellung der korrekten Reihenfolge) persistiert. Die Absichten der beiden abonnierenden Microservices sind dabei völlig unterschiedlich, doch das ist dem Produzenten des Events weder bekannt noch wichtig. Selbst wenn überhaupt keine Komponente ein Event beachten würde: der Produzent des Events ist dafür nicht in der Verantwortung und stellt sich diese Frage nicht einmal.

Bei der Umsetzung dieser Architektur bemerkten wir die damit zusammenhängenden Hürden: in erster Linie in der Hinsicht der zur Verfügungstellung der Daten und Resultate von Operationen aus Nutzersicht. Dieser ist nicht bereit (und sein Browser nicht darauf ausgelegt), nach einer Interaktion länger als ein paar hundert Millisekunden auf ein Ergebnis zu warten. Ein so schnelle Antwort ist bei schreibenden Operationen mit JVM basierten Lambdas (wie unsere Scala3 Lambdas) völlig unrealistisch, da die Anfragen im Falle von cold-starts leicht über 10 Sekunden dauern können. Desweiteren steigt die Komplexität der Applikation durch die breitere Verteilung der Verantwortung, und die dadurch entstehende Vielzahl an internen Schnittstellen noch weiter. Somit entschlossen wir, die Topics mit den Events zwar zu behalten, und somit die Erweiterbarkeit um unabhängige Microservice zu gewährleisten, diese jedoch nicht im Rahmen des Projekts in Cloud Application Development zu implementieren.

### CDK & CloudFormation
Das [AWS Cloud Development KIT](https://aws.amazon.com/cdk/) ist ein Framework zur Definition von Cloud-Anwendungsressourcen mittels Programmiersprachen. 
Dabei erstellt man sogenannte Konstrukte für die jeweiligen Cloud Resourcen. Die Konstrukte haben Voreinstellungen, will man von diesen Abweichung kann man dies beispielsweise über gewisse Parameter machen. Auch das Schreiben von eigenen Funktionen für die Erstellung bestimmter Konstrukte haben wir erfolgreich eingesetzt. Beispielsweise für das Provisionieren der Lambda-Funktionen. Das AWS-CDK provisioniert dann die Resourcen mittels AWS CloudFormation. Bei Lightbulb Learning haben wir für das CDK anfangs Java eingesetzt. Später haben wir uns für TypeScript entschieden, da hier die Dokumentation einfacher war. 

[CloudFormation](https://aws.amazon.com/cloudformation/) ist ein Service welcher es ermöglicht Resourcen in einer einfachen Weise bereitzustellen und zu verwalten. Es fällt in die Infrastructure-as-Code Kategorie. Dadurch ist es möglich anhand von einer einfachen Operation, nachverfolgbar, bestimmte Resourcen weltweit oder in einer bestimmten Region bereitzustellen. Zudem lässt sich dadurch das Resourcenmanagement automatisieren.

Es existieren zwei Ansätze für Infrastructure as Code. Deklarativ (funktional) und imperativ (prozedural). 
Der deklarative Ansatz konzentriert sich darauf wie die Zielkonfiguration aussehen soll, wohingegen der imperative Ansatz Schritt-für-Schritt erklärt wie man die Zielkonfiguration erhält. Der imperative Ansatz ist wesentlich fehleranfälliger als der deklarative. Mit Cloudformation nutzen wir den deklarativen Ansatz, da wir hier nur mitteilen welche Resourcen provisioniert werden sollen und nicht wie wir vom aktuellen Zustand zum Zielzustand gelangen.

### GitHub Actions
Für den Build unserer Lambdas sowie die Synthetisierung unserer deklarativen Infrastrukturdefinition verwenden wir GitHub Actions. Details dazu beschreiben wir im Abschnitt "Continuous Delivery & Version Control".

## 12 Faktoren
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

## Multi-Tenancy und Multi-User
Legt ein Nutzer eine neue Gruppe an, so wird er Admin dieser Gruppe und hat die Möglichkeit weitere Nutzer in diese Gruppe einzuladen. Beim Erstellen einer solchen Gruppe wird auch die Tenant-ID oder auch Gruppen-ID erstellt. Jeder Nutzer kann nur in einer Gruppe sein.
Vor dem Erstellen der Gruppe muss man zwischen einer der folgenden drei Möglichkeiten entscheiden:
- **Free**
	- Der Service kostet den Kunden hierbei `nichts`.
	- Es können bis zu `25 Nutzer` in einer Free Gruppe sein.
- **Standard**
	- Der Service kostet den Kunden `5$ monatlich`
	- Es können bis zu `500 Nutzer` in einer Standard Gruppe sein.
- **Premium**
	- Der Service kostet den Kunden `10$ monatlich`
	- Es können `unbegrenzt Nutzer` in einer Premium Gruppe sein.
	- Es wird eine eigene Amplify App für einen Premiumkunden angelegt.
	
### Isolation zwischen den Tenants
Die Free- und Standardgruppen werden innerhalb der selben Amplify App angelegt. Die Isolation erfolgt lediglich über das Filtern der Tenant-ID (oder auch Gruppen-Id).
Für die Premiumkunden wird jeweils eine eigene Amplify App erstellt, welche eigene DynamoDB Tabellen enthält. Dadurch wird eine klare Isolation der Daten hergestellt.

## Prozesse
### Infrastructure as Code / CDK
Die [Infrastructure.ts](../infrastructure/bin/infrastructure.ts) dient als Einstiegspunkt für das AWS-CDK. Hier definieren wir den Namen des Stacks sowie die Umgebungsvariablen und die Region. Wir haben einen separaten technischen Account angelegt welcher die benötigten Rechte besitzt um Cloud Resourcen zu provisionieren.

Im Konstruktor erzeugen wir eine neue Instanz von dem [Infrastructure-Stack.ts](../infrastructure/lib/infrastructure-stack.ts). Dort werden die Resourcen und deren jeweiligen Berechtigungen konfiguriert. Es handelt es sich hierbei um eine *Resource-Based-Policy*, dabei erlauben wir bestimmten Resourcen gewisse Operationen auf oder mit ausgewählten Resourcen.


Folgende Resourcen werden provisionert:
- **Policies**: Für jede Lambdafunktion wurde eine Policy definiert, welche nur die Aktionen erlaubt, die für die Erfüllung der Operation benötigt wird. 

- **Topics**: (openQuestionTopic, openAnswerTopic, openFeedbackTopic)

- **Queues**: createOpenQuestionQueue

- **Lambdas**:
Für das bauen der Lambdafunktionen bedienen wir uns selbstgeschriebenen Funktionen `buildLambda` und `buildLambdaJS`. Diese Funktionien retournieren ein Instanz vom Typ Lambdafunktion. Die Lambdafunktion enthält bestimmte Parametern wie z.B. der Einstiegspunkt der Klasse, die Laufzeitumgebung, die Größe, den Timeout und wo der Codeabschnitt zu finden ist.

  - commitOpenQuestionLambda (für das Speichern einer Frage)
  - commitOpenAnswerLambda (für das Speichern einer Antwort)
  - commitOpenFeedbackLambda (für das Speichern des Feedbacks)
  - createOpenQuestionLambda (für das Erstellen einer Frage)
  - createGroupLambda (für das Erstellen einer Gruppe)
  - addUserToGroupLambda (für das Beitreten einer Gruppe)
  - addUserToGroupHttpLambda (für das Erstellen einer Gruppe über HTTP, diese Funktion ruft addUserToGroupLambda auf)
  - listUserGroupsHttpLambda (für das auslesen der Nutzergruppen)
  - upgradeGroupHttpLambda (für das Upgraden einer `Free` Gruppe auf eine `Standard` Gruppe)
  - authorizationLambdaJS (custom-authorizer, für das Prüfen der Berechtigung über das API-Gateway)
  - jwtHandler (für das verifizieren des JWT und Aufbereitung eines Rückgabeobjekts mit dem andere Lambdafunktionen arbeiten)
  - getGroupInformation (für das Abfragen von Gruppeninformationen)
  - getGroupStatus (für das Abfragen des Gruppenstatus)
- **HttpApi** mit corsPreflight Konfiguration und den jeweiligen Routen, welche den Pfad auf die hier verlinkten Lambdafunktionen referenziert.

### Continuous Delivery &  Version Control (Git)
Damit durch einen Push auf den main branch automatisch ein deploy der AWS CDK passiert, wird Github Actions verwendet. Konkret wird hierfür die [main.yml](../.github/workflows/main.yml) verwendent. Der Job wird auf einem Ubuntu System ausgeführt. Zuerst müssen dann die Credentials (`aws-access-key-id` und `aws-secret-access-key`) sowie die verwendete `aws-region` eingetragen werden. Für die Umgebung muss noch npm, nodejs und ein jdk installiert werden. Jetzt können alle scala3 als auch javascript Lambdas gebaut werden. Um dann am Ende mit den  Befehlen `cdk synth` das Cloudformation Template erstellen und mit `cdk deploy` die Resourcen deployen zu können, muss das AWS CDK installiert werden.

Für jeden Premiumkunden wird eine eigene Amplify App, die unter anderem eine eigene DynamoDB Tabelle enthält, erstellt. Mithilfe des [create_amplify_app.sh](../infrastructure/create_amplify_app.sh) kann eine solche Amplify App erstellt werden. Zuerst wird der Name des zu erstellenden Premiumkundens abgefragt. Danach wird `amplify init` ausgeführt, um lokal eine neue Amplify App zu erstellen, um sie anschließend mit `amplify push` hochzuladen. Für jeden Premiumkunden wird ein neuer branch mit dem jeweiligen Namen angelegt, Anpassungen mit dem Namen im Frontend gemacht und den branch gepusht.

Vercel erkennt sofort Änderungen an den bestehenden branches, aber auch neu erstellte branches. So wird das Frontend direkt gebaut und unter einem Link bereitgestellt. Jeder Premiumkunde erhält somit ein eigenes Frontend, die er beliebig anpassen kann, mit eigener URL, die am Ende des Scripts ausgegeben wird.

Als letzter Befehl im Script wird `amplify console auth` ausgeführt. Derjenige, der das Script ausführt, muss am Ende noch ein Custom Attribut per Hand erstellen: `admin_of_group`. Das Attribut ist wichtig für das Verwalten der Gruppen, wer Admin von welcher Gruppe ist und damit mehr Rechte hat.

Es wurde versucht das Skript zum Erstellen einer neuen Amplify App für einen Premiumkunden mit Github Actions zu lösen, sodass das Skript sehr leicht auszuführen ist, ohne jegliche Installation von Abhängigkeiten. Gescheitert ist das ganze, da sich herausgestellt hat, dass Amplify für eine automatisierte Erstellung nicht so gut geeignet ist, da viele Parameter händisch in der CLI eingegeben werden müssen und man diese nicht als Parameter direkt mitgeben kann.

## Kommerzielles SaaS-Modell 
### Kostenanalyse
Um die Gesamtkosten der Infrastruktur pro Monat berechnen zu können, müssen vier Posten im Detail betrachtet werden: Die Kosten von `Vercel`, `Lambdas`, `API Gateway` und `DynamoDB`.
- **Vercel**
Für den Dienst bei Vercel wird ein Fixbetrag von 25$ pro Monat fällig.
- **Lambdas**
Für die Kosten der Lambdas müssen einige Variablen beachtet werden, um den Preis pro Monat berechnen zu können. Wichtig hierbei ist der durchschnittliche Speicher pro Lambda und die durchschnittliche Anfragedauer.
Es wird also in der Einheit Speicher mal Zeit berechnet. Im konkreten Fall GBs. Um den tatsächlichen Preis zu berechnen wird folgende Formel verwendet:
((Anforderungen Pro Monat * durchschnittliche Anfragedauer * 0,001 * durchschnittlicher Speicher (in MB) * 0,0009765625) - 400000) * 0,0000166667
Die 400000 stehen für das Freikontingent (in GBs) pro Monat, das abgezogen werden kann. 1 GBs kostet also 0,0000166667$.
- **API Gateway**
Eine Anfrage an das API Gateway kostet 0,000001$. Das Freikontingent beträgt hierbei 1000000 Anfragen pro Monat. Daraus ergibt sich also folgende Formel zur Kostenberechnung:
(Anzahl Anfragen pro Monat - 1000000) * 0,000001
- **DynamoDB**
Die Kosten bei der DynamoDB unterscheiden sich zwischen Lese- und Schreibzugriffe. Schreibzugriffe kosten 1,525$ pro 1000000 Zugriffe. Lesezugriffe kosten 0,305$ pro 1000000 Zugriffe. Für diese Anwendung wird davon ausgegangen, dass jeweils die Hälfte Schreibzugriffe und die andere Hälfte Lesezugriffe sind. Daraus ergibt sich folgende Formel zur Berechnung der Kosten:
((Anzahl Zugriffe pro Monat / 2) * 1,525/1000000)+((Anzahl Zugriffe Pro Monat/ 2) * 0,305/1000000)

Um jetzt sinnvolle Werte für die Kosten pro Monat zu erhalten, müssen einige Variablen geschätzt werden:
- **Lambdas**
    - **Speicher**
    Als durchschnittlichen Wert wird `300MB` pro Lambda angenommen. Die meisten Lambdas haben 256MB und nur zwei benötigen 512MB.
    - **Anfragedauer**
    Als durchschnittliche Anfragedauer wird `5000ms` angenommen. Das kann sich durch weniger Coldstarts z.b. stark verringern.
- **Anzahl der Nutzer**
    - **Premiumkunden**
    Für die Anzahl der Premiumkunden wird eine Schätzung abgegeben. Zur Zeit in den ersten beiden Monaten 1 Kunde, danach 2, 3 und 5. 
Die durchschnittlichen Nutzer pro Premiumkunden werden auf `1000`geschätztz.
    - **Free- und Standardkunden**
    Für die Free- und Standardkunden werden Vielfache der Premiumkunden angegeben. In diesem Fall `4` für `Standard` und `150` für `Free`.
    Die durchschnittlichen Nutzer pro Standardkunde werden auf `300` und pro Freekunde auf `25` geschätzt.
    - **Anzahl Anfragen pro Nutzer**
    Wie viele Anfragen ein Nutzer pro Monat stellt wird in diesem Fall auf `150` geschätzt.

Alle oben genannten geschätzten Variablen lassen sich leicht in der Tabellenkalkulation anpassen, um sofort angepasste Werte zu erhalten. 
### Commercial Model
Da man monatliche Kosten der Nutzer zu erwarten hat, wurde sich für ein Abomodell entschieden, wobei die Kunden monatlich einen Preis bezahlen. Durch die oben genannten Schätzungen können die monatlichen Kosten kumuliert werden und daraus den zu fordernden Preis ableiten. Mit den oben genannten Schätzungen wurde sich für folgenden Preise entschieden: `Standard 5$` und `Premium 10$`
Mit diesen Werten kann man in folgendem Diagramm erkennen, dass der break even Punkt im April stattfinden wird.
![](https://github.com/Lightbulb-Learning/lightbulb-learning/blob/main/documentation/BreakEven.png)

# Special Highlights
## Monorepo
Die Verwendung eines Monorepos brachte mehr Vor- als Nachteile mit sich, weshalb wir uns frühzeitig dafür entschieden. Da wir viele Komponenten (Lambdas, API Gateway, ...) haben, die miteinander kommunizieren und dafür Schnittstellen definieren müssen, müssten diese eigentlich entsprechend explizit versioniert werden. Die Komplexität dieses Unterfangens ist nicht zu unterschätzen, da das Gesamtsystem zu jedem Zeitpunkt vollständig kompatibel gehalten werden muss. So müsste man in einigen Fällen Funktionen zeitgleich deployen, was sehr schwer umzusetzen ist. Hier zeigt die Monorepo Struktur seine Stärke: Alle Änderungen können auf einem einzigen Branch gepusht werden, und beim Merge dieses Branches werden alle Schnittstellen-Änderungen in einem einzigen Deployment auf die Produktionsumgebung gebracht, wodurch eine nahtlose Funktionsfähigkeit der Anwendung garantiert wird.

## JWT Handling
JWT steht für JSON Web Tokens. Es ist ein standardisiertes Zugriffstoken, welches es zwei Parteien ermöglicht, sicher Daten auszutauschen. Alle wichtigen Informationen bezüglich einer Entität sind in diesem Token enthalten, so dass keine weiteren Datenbankanfragen notwendig sind. Es eignet sich perfekt für Authentifizierungsverfahren, da Kurznachrichten sicher verschlüsselt und vermittelt werden können. So kann verifiziert werden, wer der Absender ist und ob er die notwendigen Rechte besitzt.

Ein JWT enthält einen Header (Algorithmus und Typ des Tokens), ein Payload (Key-Value Paare auch "Claims" genannt z.B. `iss` für issuer) sowie eine Verifikationssignatur. 

Bei vielen Client Anfragen wird das JWT als Header bzw. im Body als Payload mitangegeben. Für die Verifikation des JWT sowie für das beisteuern weiterer  Werte, rufen die AWS-Lambdas eine weitere AWS-Lambda, den jwtHandler auf. Diese Lambda-Funktion extrahiert abhängig vom `issuer` claim den Cogito-Userpool. Im Cognito-Userpool sind jwks hinterlegt, sie repräsentieren eine Menge von öffentlichen Schlüsseln. 
Der Vorteil hierbei: Dadurch, dass dynamisch abhängig vom `issuer claim` die URL des Userpools ausgelesen wird, brauchen wir beim Anlegen eines neuen Premiumtenants, welcher einen eigenen Userpool hat,  keine Gedanken um die Authentifizierung zu machen.
Das jwt vom client wird nach dem `kid` (key identfier) claim gefiltert. Wurde der korrekte JSON-Web-Key  ermittelt, lässt sich das jwt, mit der jsonwebtoken library, verifizieren.  Ist das Token erfolgreich verifiziert, wird ein JSON Objekt mit den benötigten Werten: 
- usermail
- userpool
- amount_of_groups
- cognito:groups
- admin_of_group

zurückgegeben.
