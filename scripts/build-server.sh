#!/usr/bin/env bash

pnpm --filter @embedded-blockchain-surveillance-system/docs-openapi build && \
  pnpm --filter @embedded-blockchain-surveillance-system/api build
