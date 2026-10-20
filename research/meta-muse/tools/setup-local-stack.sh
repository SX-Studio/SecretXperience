#!/usr/bin/env bash
# Rebuilds the local, quota-free production stack in a fresh cloud container.
# Usage: bash research/meta-muse/tools/setup-local-stack.sh [scratch_dir]
set -euo pipefail
S="${1:-${TMPDIR:-/tmp}/mm-stack}"
mkdir -p "$S/models/kokoro"

# HyperFrames: HTML -> MP4 renderer, plus local transcribe / tts / beats / registry blocks.
export HYPERFRAMES_SKIP_SKILLS=1
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
export HYPERFRAMES_BROWSER_PATH="$PRODUCER_HEADLESS_SHELL_PATH"
npx -y hyperframes@latest telemetry disable >/dev/null 2>&1 || true
npx -y hyperframes@latest skills update            # core agent skills -> ~/.claude/skills
npx -y hyperframes@latest models install parakeet  # 640 MB on-device ASR, word timestamps

# Hypit: SVML video-cloning skill + CLI (own-organisation use only, see its LICENSE).
npx -y skills add hypit-ai/hypit -g -y || true
npm install --global @hypit/hypit

# Kokoro-82M TTS (Apache-2.0, commercial-safe), CPU, ~3x faster than real time.
python3 -m venv "$S/venv"
"$S/venv/bin/pip" install -q kokoro-onnx soundfile numpy scipy
base=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
[ -f "$S/models/kokoro/kokoro-v1.0.onnx" ] || curl -sSL -o "$S/models/kokoro/kokoro-v1.0.onnx" "$base/kokoro-v1.0.onnx"
[ -f "$S/models/kokoro/voices-v1.0.bin" ] || curl -sSL -o "$S/models/kokoro/voices-v1.0.bin" "$base/voices-v1.0.bin"

# Optional: OmniVoice (code Apache-2.0, WEIGHTS CC-BY-NC: tests and non-monetised work only).
if [ "${WITH_OMNIVOICE:-0}" = 1 ]; then
  python3 -m venv "$S/venv-omni"
  "$S/venv-omni/bin/pip" install -q torch==2.8.0 torchaudio==2.8.0 --index-url https://download.pytorch.org/whl/cpu
  "$S/venv-omni/bin/pip" install -q omnivoice soundfile
fi
# Optional: ACE-Step 1.5 music (code + weights MIT). ~7.7 GB of checkpoints, Python 3.12 venv.
# Generate with tools/acestep/gen.py (CPU, bf16, turbo 8 steps): ~4-5 min per 75 s take.
if [ "${WITH_ACESTEP:-0}" = 1 ]; then
  A="$S/acestep"; mkdir -p "$A"
  [ -d "$A/repo" ] || git clone --depth 1 https://github.com/ACE-Step/ACE-Step-1.5 "$A/repo"
  python3.12 -m venv "$A/venv"
  "$A/venv/bin/pip" install -q -U pip huggingface_hub
  "$A/venv/bin/pip" install -q torch==2.10.0 torchaudio==2.10.0 torchvision==0.25.0 --index-url https://download.pytorch.org/whl/cpu
  "$A/venv/bin/pip" install -q safetensors==0.7.0 "transformers>=4.51.0,<4.58.0" "diffusers>=0.37.0" scipy soundfile loguru einops accelerate numba "vector-quantize-pytorch>=1.27.15" toml diskcache xxhash pyyaml tqdm matplotlib pytorch-wavelets pywavelets "setuptools<72"
  "$A/venv/bin/python" -I - "$A" <<'PY'
import sys
from huggingface_hub import snapshot_download
a = sys.argv[1]
snapshot_download("ACE-Step/Ace-Step1.5", local_dir=f"{a}/checkpoints",
                  allow_patterns=["acestep-v15-turbo/*", "vae/*", "Qwen3-Embedding-0.6B/*", "config.json", "README.md"])
snapshot_download("ACE-Step/acestep-5Hz-lm-0.6B", local_dir=f"{a}/checkpoints/acestep-5Hz-lm-0.6B")
PY
fi
echo "Stack ready in $S. Export PRODUCER_HEADLESS_SHELL_PATH before 'npx hyperframes render'."
