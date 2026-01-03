docker-compose -f docker_compose/local/docker-compose.yml down --rmi all --volumes --remove-orphans
docker-compose -f docker_compose/local/docker-compose.yml up --build