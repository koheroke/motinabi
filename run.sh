docker compose down -v --rmi all --volumes
docker system prune -f --volumes
cd ./frontend
npm run build
cd ../backend
docker compose up -d
