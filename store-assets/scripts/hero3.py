#!/usr/bin/env python3
"""Hero v3: screenshot fills whole screen; feature strip moved below phone."""
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
import numpy as np
import os

SRC = "/sessions/fervent-tender-ptolemy/mnt/RideTune-github/store-assets"
OUT = os.path.join(SRC, "final")
F_BOLD = "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf"
F_REG = "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"

ref = Image.open(f"{SRC}/a02515e4-56cb-4307-9527-e183dfa752f5.png").convert("RGB")
Wr, Hr = ref.size

# ---------- extract blue icons from reference (before editing) ----------
def extract_icon(box):
    patch = ref.crop(box).convert("RGB")
    a = np.array(patch).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    blueness = np.clip(b - np.maximum(r, g), 0, 255)
    bright = np.clip(b - 40, 0, 255)
    alpha = np.clip(blueness * 2.2, 0, 255) * (bright > 30)
    alpha = alpha.astype(np.uint8)
    out = np.zeros((*alpha.shape, 4), dtype=np.uint8)
    out[..., 0], out[..., 1], out[..., 2] = 62, 132, 247
    out[..., 3] = alpha
    return Image.fromarray(out, "RGBA")

icon_bike = extract_icon((431, 1388, 496, 1432))
icon_shield = extract_icon((545, 1405, 590, 1466))
icon_bolt = extract_icon((670, 1434, 708, 1497))

# ---------- perspective-insert screenshot over FULL screen ----------
def find_coeffs(pa, pb):
    matrix = []
    for p1, p2 in zip(pa, pb):
        matrix.append([p1[0], p1[1], 1, 0, 0, 0, -p2[0] * p1[0], -p2[0] * p1[1]])
        matrix.append([0, 0, 0, p1[0], p1[1], 1, -p2[1] * p1[0], -p2[1] * p1[1]])
    A = np.matrix(matrix, dtype=float)
    B = np.array(pb).reshape(8)
    res = np.dot(np.linalg.inv(A.T * A) * A.T, B)
    return np.array(res).reshape(8)

shot = Image.open(f"{SRC}/RT_store_03.png").convert("RGB")
sw, sh = shot.size

TL = (470, 547)
TR = (851, 493)
BR = (726, 1598)   # straight-edge intersections; corners chamfered below
BL = (392, 1522)
quad = [TL, TR, BR, BL]
src_pts = [(0, 0), (sw, 0), (sw, sh), (0, sh)]

coeffs = find_coeffs(quad, src_pts)
warped = shot.transform((Wr, Hr), Image.PERSPECTIVE, coeffs, Image.BICUBIC)

# chamfered mask (cut 26px at each corner to respect rounded screen corners)
def chamfer(p_prev, p, p_next, t=26):
    def toward(a, b, t):
        vx, vy = b[0] - a[0], b[1] - a[1]
        n = (vx * vx + vy * vy) ** 0.5
        return (a[0] + vx / n * t, a[1] + vy / n * t)
    return [toward(p, p_prev, t), toward(p, p_next, t)]

pts = []
q = quad
cuts = [30, 30, 48, 42]
for i in range(4):
    pts += chamfer(q[(i - 1) % 4], q[i], q[(i + 1) % 4], cuts[i])
mask = Image.new("L", (Wr, Hr), 0)
ImageDraw.Draw(mask).polygon(pts, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(1.2))
ref.paste(warped, (0, 0), mask)

# ---------- fit to 1080x1920 ----------
W, H = 1080, 1920
scale = H / Hr
new_w = int(Wr * scale)
hero = ref.resize((new_w, H), Image.LANCZOS)
canvas = Image.new("RGB", (W, H))
pad_l = (W - new_w) // 2
left_fill = hero.crop((0, 0, pad_l, H)).transpose(Image.FLIP_LEFT_RIGHT).filter(ImageFilter.GaussianBlur(18))
right_fill = hero.crop((new_w - (W - new_w - pad_l), 0, new_w, H)).transpose(Image.FLIP_LEFT_RIGHT).filter(ImageFilter.GaussianBlur(18))
left_fill = ImageEnhance.Brightness(left_fill).enhance(0.5)
right_fill = ImageEnhance.Brightness(right_fill).enhance(0.5)
canvas.paste(left_fill, (0, 0))
canvas.paste(right_fill, (pad_l + new_w, 0))
canvas.paste(hero, (pad_l, 0))

# ---------- footer feature strip (below phone, right of the moto) ----------
canvas = canvas.convert("RGBA")
band = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bd = ImageDraw.Draw(band)
# soft dark gradient at the bottom for legibility
for y in range(1660, H):
    a = int(150 * (y - 1660) / (H - 1660))
    bd.line([(0, y), (W, y)], fill=(4, 7, 14, a))
canvas = Image.alpha_composite(canvas, band)
d = ImageDraw.Draw(canvas)

f_big = ImageFont.truetype(F_BOLD, 38)
f_sub = ImageFont.truetype(F_REG, 29)
cols = [
    (icon_bike, "100+", "motorcycles", 535),
    (icon_shield, "Expert", "recommendations", 745),
    (icon_bolt, "Works in", "minutes", 968),
]
ICON_H = 64
Y_ICON = 1712
Y_BIG = 1790
Y_SUB = 1842
for icon, big, sub, cx in cols:
    ic = icon.resize((int(icon.width * ICON_H / icon.height), ICON_H), Image.LANCZOS)
    canvas.alpha_composite(ic, (cx - ic.width // 2, Y_ICON))
    wb = d.textlength(big, font=f_big)
    d.text((cx - wb / 2, Y_BIG), big, font=f_big, fill=(245, 248, 252))
    ws = d.textlength(sub, font=f_sub)
    d.text((cx - ws / 2, Y_SUB), sub, font=f_sub, fill=(176, 186, 200))

canvas.convert("RGB").save(os.path.join(OUT, "RT_screen_0_hero.png"), "PNG")
print("saved")
