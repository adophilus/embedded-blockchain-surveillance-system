#!/usr/bin/env bash

git clone --depth 1 'https://github.com/vladmandic/face-api' /tmp/face-api
mv /tmp/face-api/model/* ./apps/server/models/faceapi