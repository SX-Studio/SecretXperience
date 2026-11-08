import sys, time
from huggingface_hub import snapshot_download
ck = sys.argv[1]
t=time.time()
snapshot_download("ACE-Step/Ace-Step1.5", local_dir=ck,
    allow_patterns=["acestep-v15-turbo/*", "vae/*", "Qwen3-Embedding-0.6B/*", "config.json", "README.md"])
print("main done", time.time()-t, flush=True)
snapshot_download("ACE-Step/acestep-5Hz-lm-0.6B", local_dir=f"{ck}/acestep-5Hz-lm-0.6B")
print("lm done", time.time()-t, flush=True)
