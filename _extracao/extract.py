#!/usr/bin/env python3
"""
Extrator dos 11 empreendimentos da Sunprime.
Le HTML bruto de /raw-html/*.html, extrai dados estruturados,
e gera empreendimentos-detalhados.json + download-list.txt (URLs de imagens a baixar).
"""
import json
import re
import sys
from pathlib import Path
from html import unescape

RAW = Path(__file__).parent / "raw-html"
OUT = Path(__file__).parent

SLUG_MAP = {
    "suncool-tower": {"id": 72, "url": "https://www.sunprime.com.br/empreendimento/5/72", "status": "Entregues"},
    "sunsky-tower": {"id": 71, "url": "https://www.sunprime.com.br/empreendimento/5/71", "status": "Entregues"},
    "sunview-tower": {"id": 70, "url": "https://www.sunprime.com.br/empreendimento/5/70", "status": "Entregues"},
    "chateau-excellence": {"id": 69, "url": "https://www.sunprime.com.br/empreendimento/5/69", "status": "Entregues"},
    "plural": {"id": 80, "url": "https://www.sunprime.com.br/empreendimento/6/80", "status": "Em construção"},
    "era": {"id": 77, "url": "https://www.sunprime.com.br/empreendimento/6/77", "status": "Em construção"},
    "futura": {"id": 75, "url": "https://www.sunprime.com.br/empreendimento/6/75", "status": "Em construção"},
    "sunhaus-tower": {"id": 74, "url": "https://www.sunprime.com.br/empreendimento/6/74", "status": "Em construção"},
    "sunstar-ocean-tower": {"id": 73, "url": "https://www.sunprime.com.br/empreendimento/6/73", "status": "Em construção"},
    "sion": {"id": 83, "url": "https://www.sunprime.com.br/empreendimento/4/83", "status": "Pré-lançamentos"},
    "organica": {"id": 82, "url": "https://www.sunprime.com.br/empreendimento/4/82", "status": "Pré-lançamentos"},
}

def clean_html(s: str) -> str:
    s = unescape(s)
    # substitui tags de quebra por newline
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.I)
    s = re.sub(r"</p>", "\n\n", s, flags=re.I)
    # remove restante
    s = re.sub(r"<[^>]+>", "", s)
    # normaliza whitespace
    s = re.sub(r"\n{3,}", "\n\n", s)
    s = re.sub(r"[ \t]+", " ", s)
    return s.strip()

def extract_main_image(html: str, id_: int):
    """A primeira imagem dentro de .empreendimentoDet é o render principal."""
    m = re.search(r'<div class="empreendimentoDet">.*?<img src="([^"]+)"', html, flags=re.S)
    return m.group(1) if m else None

def extract_logo(html: str, id_: int):
    m = re.search(rf'/upload/site_servico_logo/{id_}\.(png|jpg|jpeg)', html)
    return f"https://www.sunprime.com.br{m.group(0)}" if m else None

def extract_descricao(html: str):
    """Texto dentro de .spaceInfos (antes do .carrosselInt)."""
    m = re.search(r'<div class="spaceInfos">(.*?)</div>\s*</div>', html, flags=re.S)
    if not m:
        return None
    block = m.group(1)
    # remove tag img do logo
    block = re.sub(r'<img[^>]+/?>', '', block)
    # remove tag a do hotsite (fica visível como string)
    return clean_html(block)

def extract_hotsite(html: str):
    m = re.search(r'<a href="(https?://[^"]+)"[^>]*>ACESSE O HOTSITE', html, flags=re.I)
    return m.group(1) if m else None

def extract_gallery(html: str):
    """Imagens /upload/site_servico/imagens/N.(png|jpg)."""
    urls = re.findall(r'(/upload/site_servico/imagens/\d+\.(?:png|jpg|jpeg))', html)
    return [f"https://www.sunprime.com.br{u}" for u in sorted(set(urls))]

def extract_adicional(html: str, id_: int):
    m = re.search(rf'/upload/site_servico_adicional/{id_}\.(png|jpg|jpeg)', html)
    return f"https://www.sunprime.com.br{m.group(0)}" if m else None

def extract_ficha_tecnica(html: str):
    """Conteúdo do bloco .fotoAd / Especificações Técnicas."""
    m = re.search(r'<h3>Especifica[^<]*</h3>\s*<hr/?>\s*(.*?)</div>\s*</div>\s*<div class="col-md-1', html, flags=re.S)
    if not m:
        return None
    return clean_html(m.group(1))

def extract_arquitetos(html: str):
    """Todos os blocos <section class="arquiteto">."""
    blocks = re.findall(r'<section class="arquiteto">(.*?)</section>', html, flags=re.S)
    out = []
    for b in blocks:
        h3 = re.search(r'<h3>([^<]+)</h3>', b)
        desc = re.search(r'<div class="infos">.*?<h3>[^<]+</h3>\s*<p>(.*?)</p>', b, flags=re.S)
        img = re.search(r'/upload/site_arquiteto/(\d+)\.(png|jpg|jpeg)', b)
        quote = re.search(r'<div class="txtEsboco[^"]*">\s*<p>(.*?)</p>', b, flags=re.S)
        item = {
            "nome": h3.group(1).strip() if h3 else None,
            "descricao": clean_html(desc.group(1)) if desc else None,
            "imagem": f"https://www.sunprime.com.br/upload/site_arquiteto/{img.group(1)}.{img.group(2)}" if img else None,
            "quote": clean_html(quote.group(1)) if quote else None,
        }
        if item["nome"] or item["descricao"]:
            out.append(item)
    return out

def extract_localizacao(html: str):
    m = re.search(r'<div class="col-md-4 text-right infoLoc[^"]*">\s*<h3>Localiza[^<]*</h3>\s*<p>(.*?)</p>', html, flags=re.S)
    endereco = clean_html(m.group(1)) if m else None
    # Extract Google Maps coords: !3d{LAT}!... !2d{LON}
    iframe = re.search(r'<iframe[^>]+src="(https://www\.google\.com/maps/embed[^"]+)"', html)
    lat, lon = None, None
    if iframe:
        url = iframe.group(1)
        lm = re.search(r'!3d(-?[\d.]+)', url)
        ln = re.search(r'!2d(-?[\d.]+)', url)
        if lm: lat = float(lm.group(1))
        if ln: lon = float(ln.group(1))
    return {"endereco": endereco, "lat": lat, "lon": lon, "iframe_src": iframe.group(1) if iframe else None}

def extract_obs(html: str):
    m = re.search(r'<div class="obsEmpreendimentoInt"><p>(.*?)</p></div>', html, flags=re.S)
    return clean_html(m.group(1)) if m else None

def process(slug, meta):
    f = RAW / f"{slug}.html"
    if not f.exists():
        return {"slug": slug, "erro": "html nao encontrado"}
    html = f.read_text(encoding="utf-8")
    return {
        "slug": slug,
        "id_original": meta["id"],
        "url_original": meta["url"],
        "status": meta["status"],
        "render_principal": extract_main_image(html, meta["id"]),
        "logo": extract_logo(html, meta["id"]),
        "descricao": extract_descricao(html),
        "hotsite": extract_hotsite(html),
        "galeria": extract_gallery(html),
        "foto_adicional": extract_adicional(html, meta["id"]),
        "ficha_tecnica_texto": extract_ficha_tecnica(html),
        "arquitetos_e_parceiros": extract_arquitetos(html),
        "localizacao": extract_localizacao(html),
        "disclaimer": extract_obs(html),
    }

def main():
    data = [process(slug, meta) for slug, meta in SLUG_MAP.items()]
    out_json = OUT / "empreendimentos-detalhados.json"
    out_json.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    # Lista de imagens a baixar (galeria + adicional + logo + render + arquiteto)
    dl_list = []
    for emp in data:
        slug = emp["slug"]
        for url in emp.get("galeria", []):
            dl_list.append((slug, url, "galeria"))
        if emp.get("foto_adicional"): dl_list.append((slug, emp["foto_adicional"], "adicional"))
        if emp.get("logo"): dl_list.append((slug, emp["logo"], "logo"))
        if emp.get("render_principal"): dl_list.append((slug, emp["render_principal"], "render"))
        for arq in emp.get("arquitetos_e_parceiros", []):
            if arq.get("imagem"): dl_list.append((slug, arq["imagem"], "arquiteto"))
    dl_file = OUT / "download-list.txt"
    with dl_file.open("w") as fp:
        for slug, url, kind in dl_list:
            fp.write(f"{slug}\t{kind}\t{url}\n")
    # Resumo no stdout
    print(f"=== Resumo ===")
    for emp in data:
        galeria = len(emp.get("galeria") or [])
        desc = (emp.get("descricao") or "")[:60]
        arqs = len(emp.get("arquitetos_e_parceiros") or [])
        print(f"  {emp['slug']:25s} galeria={galeria:2d} arqs={arqs} desc={'sim' if desc else 'NAO':3s}  \"{desc}...\"")
    print(f"\nTotal imagens a baixar: {len(dl_list)}")
    print(f"JSON salvo em: {out_json}")
    print(f"Lista de download: {dl_file}")

if __name__ == "__main__":
    main()
