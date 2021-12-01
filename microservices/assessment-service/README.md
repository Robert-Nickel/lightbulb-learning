# Docker & K8s commands

## Creating a Cluster with t2 micro nodes
```
eksctl create cluster \
--name lightbulb-cluster \
--region eu-central-1 \
--nodegroup-name linux-nodes \
--node-type t2.micro \
--nodes 2
```

## Delete Cluster
`eksctl delete cluster --name lightbulb-cluster`

## Create Base64 encoded secrets
`echo -n MY_SECRET | base64`

## Docker Commands
- `docker ps` list containers
- `docker ps -a` list all containers
- `docker rmi ...` delete a docker image

## Kubectl Commnads
- `kubectl get pods` list active pods
- `kubectl get svc` 
- `kubectl apply -f deployment.yaml`  - create pod based on deployment.yaml file
- `kubectl delete pod ...` - deletes a pod
- `kubectl logs ...` - show log information for a pod

## Helpful Links:
- [Create NodePort, ClusterIP, LoadBalancer](https://aws.amazon.com/premiumsupport/knowledge-center/eks-kubernetes-services-cluster/)
- [Best Practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Basics for Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html#docker-basics-create-image)


