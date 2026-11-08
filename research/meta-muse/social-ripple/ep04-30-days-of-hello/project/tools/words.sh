#!/bin/bash
cd /tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/hf/videos/sr-ep04
export HYPERFRAMES_PYTHON=/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/venv/bin/python
for f in assets/vo/*.wav; do id=$(basename $f .wav); [ -s .words/$id.json ] && continue; timeout 300 /root/.npm/_npx/702923228c2ce1e6/node_modules/.bin/hyperframes transcribe $f --json 2>&1 </dev/null | grep '"type":"words"' > .words/$id.json; echo $id; done; rm -f assets/vo/transcript.json; echo DONE
