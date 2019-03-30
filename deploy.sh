docker build -t dyegomaas/complex-client:latest -t dyegomaas/complex-client:$SHA -f ./client/Dockerfile ./client
docker build -t dyegomaas/complex-server:latest -t dyegomaas/complex-server:$SHA -f ./server/Dockerfile ./server
docker build -t dyegomaas/complex-worker:latest -t dyegomaas/complex-worker:$SHA -f ./worker/Dockerfile ./worker

docker push dyegomaas/complex-client:latest
docker push dyegomaas/complex-server:latest
docker push dyegomaas/complex-worker:latest

docker push dyegomaas/complex-client:$SHA
docker push dyegomaas/complex-server:$SHA
docker push dyegomaas/complex-worker:$SHA

kubectl apply -f k8s
kubectl set image deployments/client-deployment client=dyegomaas/complex-client:$SHA
kubectl set image deployments/server-deployment server=dyegomaas/complex-server:$SHA
kubectl set image deployments/worker-deployment worker=dyegomaas/complex-worker:$SHA