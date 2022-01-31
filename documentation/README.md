# Lightbulb Learning
(mind 5.000 Wörter)

## Das Team
Das Team besteht aus Kevin Olomu (@kolomu), Nicolai Stephan (@nistephan) und Robert Nickel (@Robert-Nickel).

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

## Tech Stack
    - Frontend
    - Amplify
    - Microservices 
        - Docker
        - K8s
        - evtl. Helm?
    - Communication

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

## Processes
    - Continuous Delivery
    - Infrastructure as Code / CDK
    - Version Control (Git)
## Multi-User
## Multi-Tenancy
To add a premium tenant run the script [create_amplify_app.sh](../infrastructure/create_amplify_app.sh) and follow the instructions. 

// TODO: describe free and standard Multi-Tenancy with Groups 

## Commercial SaaS
  - Cost analysis
  - Commercial Model
