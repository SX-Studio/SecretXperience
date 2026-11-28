#!/bin/bash
# viseme tracks for every acted line + the on-screen narrator line (n28)
cd "$(dirname "$0")/.."; args=()
for f in assets/vo/*.wav; do id=$(basename $f .wav); case $id in n22|[a-z]*_*) [ -s .words/$id.json ] && args+=("$id=$f:.words/$id.json");; esac; done
/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/venv/bin/python ../tools_shared/visemes.py . "${args[@]}" | cut -c1-60
