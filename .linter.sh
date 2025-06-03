#!/bin/bash
cd /home/kavia/workspace/code-generation/solonotehub-26733-41a20b75/solonotehub
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

