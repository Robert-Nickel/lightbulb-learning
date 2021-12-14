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
## Processes
    - Continuous Delivery
    - Infrastructure as Code / CDK
    - Version Control (Git)
## Multi-User
## Multi-Tenancy
## Commercial SaaS
  - Cost analysis
  - Commercial Model
