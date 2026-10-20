"""ACE-Step 1.5 CPU generation driver (turbo DiT, optional 0.6B LM).

Run with: venv/bin/python -I scripts/gen.py --root <acestep dir> ...
"""
import argparse, os, sys, time, json, shutil

ap = argparse.ArgumentParser()
ap.add_argument("--root", required=True)          # dir containing checkpoints/ and repo/
ap.add_argument("--duration", type=float, default=10)
ap.add_argument("--out", required=True)            # list of output wav paths (comma-separated) or one
ap.add_argument("--seeds", default="")             # comma-separated seeds
ap.add_argument("--caption", default="")
ap.add_argument("--caption-file", default="")
ap.add_argument("--lyrics", default="[Instrumental]")
ap.add_argument("--lyrics-file", default="")
ap.add_argument("--bpm", type=int, default=None)
ap.add_argument("--key", default="")
ap.add_argument("--lm", action="store_true")       # use 0.6B LM thinking
ap.add_argument("--dtype", default="bf16", choices=["bf16", "fp32"])
ap.add_argument("--steps", type=int, default=8)
ap.add_argument("--shift", type=float, default=3.0)
ap.add_argument("--threads", type=int, default=4)
a = ap.parse_args()

os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("HF_HUB_DISABLE_TELEMETRY", "1")
sys.path.insert(0, os.path.join(a.root, "repo"))

import torch
torch.set_num_threads(a.threads)

# Don't auto-download the 1.7B LM: our minimal set has turbo DiT + VAE + text encoder (+0.6B LM).
import acestep.model_downloader as md
md.MAIN_MODEL_COMPONENTS = ["acestep-v15-turbo", "vae", "Qwen3-Embedding-0.6B"]

from acestep.handler import AceStepHandler
from acestep.inference import GenerationParams, GenerationConfig, generate_music

dit = AceStepHandler()
if a.dtype == "bf16":
    # Upstream forces float32 on CPU; this CPU has AMX/AVX512-BF16, so load the DiT in bf16
    # (halves RAM: ~4.8 GB instead of ~9.6 GB).
    orig = dit._load_main_model_from_checkpoint
    def patched(**kw):
        dit.dtype = torch.bfloat16
        return orig(**kw)
    dit._load_main_model_from_checkpoint = patched

t0 = time.time()
status, ok = dit.initialize_service(project_root=a.root, config_path="acestep-v15-turbo",
                                    device="cpu", use_flash_attention=False, compile_model=False,
                                    offload_to_cpu=False, quantization=None)
print("DIT INIT", ok, f"{time.time()-t0:.1f}s", "dtype", dit.dtype, flush=True)
print(status, flush=True)
if not ok:
    sys.exit(1)

llm = None
if a.lm:
    from acestep.llm_inference import LLMHandler
    llm = LLMHandler()
    t1 = time.time()
    st, ok2 = llm.initialize(checkpoint_dir=os.path.join(a.root, "checkpoints"),
                             lm_model_path="acestep-5Hz-lm-0.6B", backend="pt", device="cpu",
                             dtype=torch.bfloat16 if a.dtype == "bf16" else torch.float32)
    print("LM INIT", ok2, f"{time.time()-t1:.1f}s", st, flush=True)
    if not ok2:
        sys.exit(1)

caption = open(a.caption_file).read().strip() if a.caption_file else a.caption
lyrics = open(a.lyrics_file).read().strip() if a.lyrics_file else a.lyrics
outs = a.out.split(",")
seeds = [int(s) for s in a.seeds.split(",")] if a.seeds else [None] * len(outs)

timings = []
for out, seed in zip(outs, seeds):
    params = GenerationParams(
        task_type="text2music", caption=caption, lyrics=lyrics, instrumental=True,
        vocal_language="unknown", bpm=a.bpm, keyscale=a.key, timesignature="4" if a.bpm else "",
        duration=a.duration, inference_steps=a.steps, shift=a.shift,
        seed=seed if seed is not None else -1,
        thinking=a.lm, use_cot_metas=False, use_cot_caption=False, use_cot_language=False,
    )
    cfg = GenerationConfig(batch_size=1, use_random_seed=seed is None,
                           seeds=[seed] if seed is not None else None, audio_format="wav")
    tmp = os.path.join(os.path.dirname(os.path.abspath(out)), "_gen_tmp")
    os.makedirs(tmp, exist_ok=True)
    tg = time.time()
    res = generate_music(dit, llm, params, cfg, save_dir=tmp)
    dt = time.time() - tg
    if not res.success:
        print("GEN FAILED", res.error, flush=True)
        sys.exit(2)
    au = res.audios[0]
    shutil.move(au["path"], out)
    tc = res.extra_outputs.get("time_costs") if isinstance(res.extra_outputs, dict) else None
    info = {"out": out, "seed": au["params"].get("seed"), "gen_seconds": round(dt, 1),
            "sample_rate": au.get("sample_rate"), "time_costs": tc}
    print("GEN DONE", json.dumps(info, default=str), flush=True)
    timings.append(info)
    shutil.rmtree(tmp, ignore_errors=True)

print("ALL", json.dumps(timings, default=str), flush=True)
