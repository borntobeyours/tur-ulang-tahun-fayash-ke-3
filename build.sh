#!/bin/bash
set -euo pipefail

APP_NAME="fayash-birthday-3rd"
REGISTRY="registry.internal.oh-my.dev"
NOMAD_SERVER="10.40.40.12"
LOCAL_CONTAINER="${APP_NAME}-dev"
BUILD_FILE=".last-build"
HOST_PORT="3400"
CONTAINER_PORT="80"

cd "$(dirname "$0")"

usage() { echo "Usage: $0 [dev|prod]"; exit 1; }
[ $# -eq 1 ] || usage

case "$1" in
  dev)
    [ -f dev.env ] || { echo "Missing dev.env"; exit 1; }
    set -a; . ./dev.env; set +a
    [ -n "${GEMINI_API_KEY:-}" ] || { echo "GEMINI_API_KEY not set in dev.env"; exit 1; }

    TAG=$(date +%Y%m%d-%H%M%S)
    IMAGE="${REGISTRY}/${APP_NAME}:${TAG}"

    echo "[DEV] Building ${IMAGE}"
    docker build \
      --build-arg "GEMINI_API_KEY=${GEMINI_API_KEY}" \
      -t "${IMAGE}" -t "${REGISTRY}/${APP_NAME}:dev" .

    echo "[DEV] Restarting local container"
    docker rm -f "${LOCAL_CONTAINER}" >/dev/null 2>&1 || true
    docker run -d \
      --name "${LOCAL_CONTAINER}" \
      --restart unless-stopped \
      -p "${HOST_PORT}:${CONTAINER_PORT}" \
      "${IMAGE}" >/dev/null

    echo "[DEV] Pushing ${IMAGE} and :dev"
    docker push "${IMAGE}"
    docker push "${REGISTRY}/${APP_NAME}:dev"

    echo "${TAG}" > "${BUILD_FILE}"
    echo "[DEV] Done. Tag=${TAG}"
    echo "Dev URL: https://birthday-fayash-3rd.oh-my.dev"
    ;;

  prod)
    [ -f "${BUILD_FILE}" ] || { echo "No ${BUILD_FILE}. Run './build.sh dev' first."; exit 1; }
    TAG=$(cat "${BUILD_FILE}")
    IMAGE="${REGISTRY}/${APP_NAME}:${TAG}"

    echo "[PROD] Promoting ${IMAGE}"
    RENDERED=$(sed "s|__TAG__|${TAG}|g" "${APP_NAME}.nomad.tpl")

    echo "[PROD] Submitting job to ${NOMAD_SERVER}"
    ssh "root@${NOMAD_SERVER}" "nomad job run -" <<< "${RENDERED}"

    echo "[PROD] Status:"
    ssh "root@${NOMAD_SERVER}" "nomad job status ${APP_NAME}" | head -20

    echo "[PROD] Done. Tag=${TAG}"
    echo "Prod URL: https://fayash.harjulianto.com"
    ;;

  *) usage ;;
esac
