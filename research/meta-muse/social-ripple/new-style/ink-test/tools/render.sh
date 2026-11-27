#!/bin/bash
cd /tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/hf/videos/ink-test
export HYPERFRAMES_RENDER_DETACHED=1
/root/.npm/_npx/f8bff2a7a94cc3a6/node_modules/.bin/hyperframes render . --workers 3 -o renders/ink-test.mp4 > renders/render.log 2>&1; echo EXIT $? >> renders/render.log
