#!/usr/bin/env python3
"""Baixa as 165 imagens listadas em download-list.txt em paralelo (ThreadPool)."""
import os
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

BASE = Path(__file__).parent.parent / "public" / "extracted-images"
LIST = Path(__file__).parent / "download-list.txt"

def target_path(slug: str, kind: str, url: str) -> Path:
    fname = url.rsplit("/", 1)[-1]
    if kind == "arquiteto":
        return BASE / "_arquitetos" / fname
    return BASE / slug / kind / fname

def download(slug, kind, url):
    tgt = target_path(slug, kind, url)
    tgt.parent.mkdir(parents=True, exist_ok=True)
    if tgt.exists() and tgt.stat().st_size > 0:
        return (url, tgt, "cached")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        tgt.write_bytes(data)
        return (url, tgt, f"ok ({len(data)}B)")
    except Exception as e:
        return (url, tgt, f"FAIL: {e}")

def main():
    jobs = []
    with LIST.open() as fp:
        for line in fp:
            slug, kind, url = line.rstrip("\n").split("\t")
            jobs.append((slug, kind, url))
    ok = fail = cached = 0
    fails = []
    with ThreadPoolExecutor(max_workers=12) as ex:
        futs = [ex.submit(download, *j) for j in jobs]
        for f in as_completed(futs):
            url, tgt, status = f.result()
            if status.startswith("FAIL"):
                fail += 1; fails.append((url, status))
            elif status == "cached":
                cached += 1
            else:
                ok += 1
    print(f"OK novos:  {ok}")
    print(f"Cached:    {cached}")
    print(f"FAILED:    {fail}")
    print(f"TOTAL:     {len(jobs)}")
    if fails:
        print("\nFalhas:")
        for u, s in fails[:20]:
            print(f"  {u}  ->  {s}")

if __name__ == "__main__":
    main()
