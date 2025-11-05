#!/usr/bin/env bash


forge script \
  ./script/DeploySurveillanceSystem.s.sol \
  --broadcast \
  --private-key $PRIVATE_KEY \
  --optimize \
  # --verify \
  # --verifier "$VERIFIER_NAME" \
  # --verifier-url "$VERIFIER_URL" \
  --rpc-url $RPC_URL 
