"""Traduce SOLO los rótulos en inglés de las ilustraciones de la Sesión 14.

Procedimiento por rótulo:
 1. Se borra el texto original reconstruyendo el fondo a partir de los píxeles
    del borde del rectángulo (interpolación bilineal ponderada tipo Coons).
    En modo 'dark' solo se sustituyen los píxeles del texto (más oscuros que el
    fondo), de modo que curvas o hebras cercanas de otro color se conservan.
 2. La imagen completa se amplía x3 (LANCZOS) para obtener buena resolución.
 3. Se escribe la traducción con una fuente semejante, calibrando tamaño,
    línea base, alineación y color a partir del texto original.
Los originales nunca se sobrescriben.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONTS = {
    'DV': '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    'DVB': '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    'CAR': '/usr/share/fonts/truetype/crosextra/Carlito-Regular.ttf',
    'CARB': '/usr/share/fonts/truetype/crosextra/Carlito-Bold.ttf',
}
S = 3  # factor de ampliación


def median1d(a, k=5):
    if len(a) < 3:
        return a
    pad = k // 2
    p = np.pad(a, ((pad, pad), (0, 0)), mode='edge')
    out = np.stack([np.median(p[i:i + k], axis=0) for i in range(len(a))])
    return out


def coons_bg(arr, x0, y0, x1, y1):
    H, W, _ = arr.shape
    h, w = y1 - y0, x1 - x0
    L = median1d(arr[y0:y1, x0 - 1].astype(float)) if x0 - 1 >= 0 else None
    R = median1d(arr[y0:y1, x1].astype(float)) if x1 < W else None
    T = median1d(arr[y0 - 1, x0:x1].astype(float)) if y0 - 1 >= 0 else None
    B = median1d(arr[y1, x0:x1].astype(float)) if y1 < H else None
    est = np.zeros((h, w, 3))
    for i in range(h):
        t = (i + 1) / (h + 1)
        for j in range(w):
            u = (j + 1) / (w + 1)
            num = np.zeros(3)
            den = 0.0
            if L is not None or R is not None:
                if L is not None and R is not None:
                    hv = (1 - u) * L[i] + u * R[i]
                    dh = min(u, 1 - u) * w
                elif L is not None:
                    hv, dh = L[i], u * w
                else:
                    hv, dh = R[i], (1 - u) * w
                wh = 1.0 / (dh + 0.5) ** 2
                num += wh * hv
                den += wh
            if T is not None or B is not None:
                if T is not None and B is not None:
                    vv = (1 - t) * T[j] + t * B[j]
                    dv = min(t, 1 - t) * h
                elif T is not None:
                    vv, dv = T[j], t * h
                else:
                    vv, dv = B[j], (1 - t) * h
                wv = 1.0 / (dv + 0.5) ** 2
                num += wv * vv
                den += wv
            est[i, j] = num / den
    return est


def dilate(mask, r=1):
    out = mask.copy()
    H, W = mask.shape
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            sh = np.zeros_like(mask)
            ys = slice(max(dy, 0), H + min(dy, 0))
            yd = slice(max(-dy, 0), H + min(-dy, 0))
            xs = slice(max(dx, 0), W + min(dx, 0))
            xd = slice(max(-dx, 0), W + min(-dx, 0))
            sh[yd, xd] = mask[ys, xs]
            out |= sh
    return out


def lum(a):
    return a[..., 0] * 0.299 + a[..., 1] * 0.587 + a[..., 2] * 0.114


def bands_from_mask(mask, n):
    rows = np.where(mask.any(axis=1))[0]
    if len(rows) == 0:
        raise ValueError('sin tinta en el rectángulo')
    groups = [[rows[0], rows[0]]]
    for r in rows[1:]:
        if r - groups[-1][1] <= 1:
            groups[-1][1] = r
        else:
            groups.append([r, r])
    # fusionar los huecos más pequeños hasta tener n bandas
    while len(groups) > n:
        gaps = [groups[k + 1][0] - groups[k][1] for k in range(len(groups) - 1)]
        k = int(np.argmin(gaps))
        groups[k] = [groups[k][0], groups[k + 1][1]]
        del groups[k + 1]
    # descartar bandas minúsculas (puntos de la i, tildes) si sobran
    return groups


def process(spec, src_dir, out_dir):
    src = Path(src_dir) / spec['file']
    im = Image.open(src).convert('RGB')
    arr = np.array(im)
    H, W, _ = arr.shape
    work = arr.copy()
    draws = []
    for lab in spec['labels']:
        x0, y0, x1, y1 = lab['rect']
        rot = lab.get('rotate', False)
        # ---- análisis del texto original (sobre la imagen sin modificar) ----
        patch = arr[y0:y1, x0:x1].astype(float)
        if lab.get('bg', 'median') == 'coons':
            bg = coons_bg(arr, x0, y0, x1, y1)
        else:
            ring = []
            if x0 - 1 >= 0: ring.append(arr[y0:y1, x0 - 1])
            if x1 < W: ring.append(arr[y0:y1, x1])
            if y0 - 1 >= 0: ring.append(arr[y0 - 1, x0:x1])
            if y1 < H: ring.append(arr[y1, x0:x1])
            med = np.median(np.concatenate(ring).astype(float), axis=0)
            bg = np.broadcast_to(med, patch.shape).copy()
        diff = np.abs(patch - bg).max(axis=2)
        dark = lum(bg) - lum(patch)
        strength0 = dark if lab.get('mode') == 'dark' else diff
        ink_thr = max(lab.get('ink_thr', 40), 0.5 * strength0.max())
        ink = strength0 > ink_thr
        if rot:  # texto vertical (de abajo hacia arriba): girar para analizar
            ink_r = np.rot90(ink, k=-1)  # horario
        else:
            ink_r = ink
        n = len(lab['orig'])
        groups = bands_from_mask(ink_r, n)
        if len(groups) != n:
            raise ValueError(f"{spec['file']} {lab['orig']}: {len(groups)} bandas")
        lines = []
        for (t, b) in groups:
            cols = np.where(ink_r[t:b + 1].any(axis=0))[0]
            lines.append(dict(top=t, bot=b, left=cols.min(), right=cols.max()))
        # color del texto: píxeles con mayor contraste
        strength = dark if lab.get('mode') == 'dark' else diff
        vals = strength[ink]
        cut = np.percentile(vals, 80)
        sel = ink & (strength >= cut)
        color = tuple(int(c) for c in np.median(patch[sel], axis=0))
        if 'color' in lab:
            color = tuple(lab['color'])
        # ---- borrado del texto ----
        if lab.get('mode') == 'dark':
            m = dilate(dark > lab.get('erase_thr', 35), lab.get('dil', 1))
        elif lab.get('mode') == 'any':
            m = dilate(diff > lab.get('erase_thr', 30), lab.get('dil', 1))
        else:
            m = np.ones(diff.shape, bool)
        region = work[y0:y1, x0:x1].astype(float)
        region[m] = bg[m]
        work[y0:y1, x0:x1] = np.clip(region, 0, 255).astype(np.uint8)
        draws.append(dict(lab=lab, lines=lines, color=color, rect=(x0, y0, x1, y1)))

    big = Image.fromarray(work).resize((W * S, H * S), Image.LANCZOS)
    report = []
    for d in draws:
        lab = d['lab']
        x0, y0, x1, y1 = d['rect']
        rot = lab.get('rotate', False)
        fpath = FONTS[lab['font']]
        lines = d['lines']
        # tamaño de fuente calibrado con el texto inglés original
        sh, sw = [], []
        for ln, txt in zip(lines, lab['orig']):
            f = ImageFont.truetype(fpath, 100)
            l, t, r, b = f.getbbox(txt, anchor='ls')
            sh.append(100 * (ln['bot'] - ln['top'] + 1) * S / (b - t))
            sw.append(100 * (ln['right'] - ln['left'] + 1) * S / (r - l))
        s_h = float(np.median(sh))
        s_w = float(np.median(sw))
        size = min(max((s_h + s_w) / 2, 0.88 * s_h), 1.08 * s_h) * lab.get('scale', 1.0)
        # dimensiones del lienzo de dibujo (en coordenadas ampliadas)
        if rot:
            cw, ch = (y1 - y0) * S, (x1 - x0) * S
        else:
            cw, ch = (x1 - x0) * S, (y1 - y0) * S
        xmin = (lab.get('xmin', None))
        xmax = (lab.get('xmax', None))
        while True:
            f = ImageFont.truetype(fpath, max(int(round(size)), 6))
            placements = []
            for k, (ln, eng, esp) in enumerate(zip(lines, lab['orig'], lab['new'])):
                le, te, re_, be = f.getbbox(eng, anchor='ls')
                base = ln['top'] * S - te + lab.get('dy', [0] * len(lines))[k] * S
                l, t, r, b = f.getbbox(esp, anchor='ls')
                align = lab.get('align', 'left')
                if isinstance(align, list):
                    align = align[k]
                if align == 'left':
                    x = ln['left'] * S - l
                elif align == 'right':
                    x = (ln['right'] + 1) * S - r
                else:
                    x = (ln['left'] + ln['right'] + 1) * S / 2 - (l + r) / 2
                placements.append([x, base, esp, l, r])
            if rot or (xmin is None and xmax is None):
                break
            lo = min(p[0] + p[3] for p in placements) / S + x0
            hi = max(p[0] + p[4] for p in placements) / S + x0
            shift = 0
            if xmax is not None and hi > xmax:
                shift = xmax - hi
            if xmin is not None and lo + shift < xmin:
                shift = xmin - lo
            if (xmax is None or hi + shift <= xmax + 0.01) and (xmin is None or lo + shift >= xmin - 0.01):
                for p in placements:
                    p[0] += shift * S
                break
            size *= 0.97
        if rot:
            layer = Image.new('RGBA', (H * S, W * S), (0, 0, 0, 0))
            ox, oy = (H - y1) * S, x0 * S
        else:
            layer = Image.new('RGBA', (W * S, H * S), (0, 0, 0, 0))
            ox, oy = x0 * S, y0 * S
        dr = ImageDraw.Draw(layer)
        for x, base, esp, l, r in placements:
            dr.text((x + ox, base + oy), esp, font=f, fill=d['color'] + (255,), anchor='ls')
        blur = lab.get('blur', spec.get('blur', 0.6))
        if blur:
            layer = layer.filter(ImageFilter.GaussianBlur(blur))
        if rot:
            layer = layer.transpose(Image.ROTATE_90)  # volver a vertical
        big.alpha_composite(layer) if big.mode == 'RGBA' else big.paste(layer, (0, 0), layer)
        report.append(dict(orig=' / '.join(lab['orig']), new=' / '.join(lab['new']),
                           font=lab['font'], size_px=round(size / S, 1), color=d['color']))
    out = Path(out_dir) / spec['out']
    big.save(out, optimize=True)
    return report


if __name__ == '__main__':
    cfg = json.load(open(sys.argv[1]))
    allrep = {}
    for spec in cfg['images']:
        allrep[spec['out']] = process(spec, cfg['src_dir'], cfg['out_dir'])
        print('OK', spec['out'])
    json.dump(allrep, open(Path(cfg['out_dir']) / '_reporte_traduccion.json', 'w'),
              ensure_ascii=False, indent=1)
