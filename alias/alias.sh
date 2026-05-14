alias d-login-backend="docker exec -it express_api sh"
alias d-login-frontend="docker exec -it express_webapp sh"
#alias d-migrate="docker exec -it express_api npx prisma migrate dev"
#alias d-migrate-status="docker exec -it express_api npm run migrate:status"

alias test-backend="cd /Users/arturo/projects/react-asset-register/backend && docker compose -f docker-compose.test.yml up -d --wait && npm test; docker compose -f docker-compose.test.yml down"