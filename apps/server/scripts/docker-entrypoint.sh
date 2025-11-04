#!/usr/bin/env bash

export INFISICAL_TOKEN=$(infisical login --method=universal-auth --client-id=$INFISICAL_CLIENT_ID --client-secret=$INFISICAL_CLIENT_SECRET --silent --plain)
infisical run --projectId $INFISICAL_PROJECT_ID --env production -- pnpm --filter @embedded-blockchain-surveillance-system/server start
