#!/usr/bin/env bash
# Deploys a2z-frontend as a 4th Docker container on the SAME EC2 instance
# already running a2z-backend (postgres/redis/api). Fast path for now —
# see README.md for the production S3+CloudFront path from the architecture
# doc once you have a real domain.
#
# Usage (on the EC2 instance):
#   ./ec2-bootstrap.sh <API_BASE_URL>
#   e.g. ./ec2-bootstrap.sh http://<EC2_PUBLIC_IP>:8080
set -euo pipefail

API_BASE_URL="${1:-}"
if [ -z "$API_BASE_URL" ]; then
  echo "Usage: $0 <API_BASE_URL>   e.g. $0 http://\$(curl -s ifconfig.me):8080"
  exit 1
fi

REPO_URL="https://github.com/kannan2096/a2z-frontend.git"
APP_DIR="$HOME/a2z-frontend"

echo "== 1/4: prerequisites (Docker should already be installed from the backend setup) =="
if ! command -v docker &> /dev/null; then
  echo "Docker not found — run a2z-backend's deploy/ec2-bootstrap.sh first, or install Docker manually."
  exit 1
fi

echo "== 2/4: cloning $REPO_URL =="
if [ -d "$APP_DIR/.git" ]; then
  echo "Repo already cloned at $APP_DIR, pulling latest instead."
  git -C "$APP_DIR" pull
else
  git clone "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"

echo "== 3/4: writing .env with VITE_API_BASE_URL=$API_BASE_URL =="
cat > .env << EOF
VITE_API_BASE_URL=$API_BASE_URL
EOF

echo "== 4/4: building and starting the container =="
sudo docker compose up -d --build

echo ""
sleep 5
echo "Checking health..."
curl -fs http://localhost:8081/health && echo "" || echo "Not ready yet — run: sudo docker compose logs -f frontend"

echo ""
echo "Next steps:"
echo "  - Open port 8081 in the EC2 security group so it's reachable from your browser."
echo "  - Visit http://<EC2_PUBLIC_IP>:8081 to see the Admin Console login page."
echo "  - No staff account exists yet (auth business logic is still stubbed in a2z-backend/auth/AuthController.java) — login won't work end-to-end until that's implemented."
