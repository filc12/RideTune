#!/usr/bin/env python3
"""Compose RideTune Play Store assets: promo screenshots + feature graphic."""
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps
import os

SRC = "/sessions/fervent-tender-ptolemy/mnt/RideTune-github/store-assets"
OUT = os.path.join(SRC, "final")
os.makedirs(OUT, exist_ok=True)

F_BOLD = "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf"
F_REG = "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"

BG_TOP = (9, 13, 22)
BG_BOT = (13, 21, 36)
ACCENT = (74, 158, 255)
WHITE = (255, 255, 255)
GREY = (148, 163, 184)
BORDER = (42, 58, 85)

W, H = 1080, 1920


def gradient_bg(w, h):
    img = Image.new("RGB", (w, h))
    for y in range(h):
        t = y / h
        c = tuple(int(a + (b - a) * t) for a, b in zip(BG_TOP, BG_BOT))
        ImageDraw.Draw(img).line([(0, y), (w, y)], fill=c)
    # radial glow top-right
    glow = Image.new("L", (w, h), 0)
    gd = ImageDraw.Draw(glow)
    gd.ellipse([w * 0.35, -h * 0.25, w * 1.35, h * 0.35], fill=60)
    glow = glow.filter(ImageFilter.GaussianBlur(180))
    blue = Image.new("RGB", (w, h), (30, 70, 140))
    img = Image.composite(blue, img, glow)
    return img


def rounded_shot(shot, target_w, radius=44):
    ratio = target_w / shot.width
    shot = shot.resize((target_w, int(shot.height * ratio)), Image.LANCZOS)
    mask = Image.new("L", shot.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, shot.width - 1, shot.height - 1], radius, fill=255)
    return shot, mask


def draw_headline(draw, lines, y, size=76):
    font = ImageFont.truetype(F_BOLD, size)
    for line in lines:
        # line = list of (text, color)
        widths = [draw.textlength(t, font=font) for t, _ in line]
        total = sum(widths)
        x = (W - total) / 2
        for (t, col), tw in zip(line, widths):
            draw.text((x, y), t, font=font, fill=col)
            x += tw
        y += int(size * 1.22)
    return y


def promo(shot_path, out_name, lines, sub=None):
    canvas = gradient_bg(W, H)
    draw = ImageDraw.Draw(canvas)
    y = draw_headline(draw, lines, 96)
    if sub:
        fsub = ImageFont.truetype(F_REG, 40)
        tw = draw.textlength(sub, font=fsub)
        draw.text(((W - tw) / 2, y + 14), sub, font=fsub, fill=GREY)
        y += 70
    shot = Image.open(shot_path).convert("RGB")
    target_w = 820
    shot, mask = rounded_shot(shot, target_w)
    sx = (W - target_w) // 2
    sy = y + 70
    # shadow
    sh = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle([sx - 8, sy + 12, sx + target_w + 8, sy + shot.height + 12], 50, fill=(0, 0, 0, 180))
    sh = sh.filter(ImageFilter.GaussianBlur(30))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), sh).convert("RGB")
    canvas.paste(shot, (sx, sy), mask)
    # border
    d2 = ImageDraw.Draw(canvas)
    d2.rounded_rectangle([sx, sy, sx + target_w - 1, sy + shot.height - 1], 44, outline=BORDER, width=3)
    canvas = canvas.crop((0, 0, W, H))
    canvas.save(os.path.join(OUT, out_name), "PNG")
    print("saved", out_name)


shots = {
    "home": f"{SRC}/RT_store_03.png",
    "bikes": f"{SRC}/Screenshot_2026_0703_195800.jpg",
    "load": f"{SRC}/Screenshot_2026_0626_172057.jpg",
    "clicks": f"{SRC}/Screenshot_2026_0626_141556.jpg",
    "diary": f"{SRC}/Screenshot_2026_0626_172840.jpg",
}

promo(shots["home"], "RT_screen_1_home.png",
      [[("Suspension setup ", WHITE)], [("made ", WHITE), ("simple", ACCENT)]],
      "OEM-based data for your exact bike")
promo(shots["bikes"], "RT_screen_2_bikes.png",
      [[("100+ bikes", ACCENT), (" from", WHITE)], [("the brands you ride", WHITE)]],
      "Adventure, naked, sport, touring & more")
promo(shots["load"], "RT_screen_3_load.png",
      [[("Adjust for ", WHITE), ("your", ACCENT)], [("real load", ACCENT)]],
      "Rider, passenger and luggage — recalculated")
promo(shots["clicks"], "RT_screen_4_clicks.png",
      [[("Count the ", WHITE), ("clicks", ACCENT)], [("with confidence", WHITE)]],
      "Preload, rebound and compression explained")
promo(shots["diary"], "RT_screen_5_diary.png",
      [[("Track every ride,", WHITE)], [("keep what ", WHITE), ("works", ACCENT)]],
      "Ride diary with setups and sensations")

# ---------- Feature graphic 1024x500 ----------
FW, FH = 1024, 500
photo = Image.open(f"{SRC}/wind-tan-Paw1IpeN4yA-unsplash.jpg").convert("RGB")
# crop: keep rider on right side. photo is 3000x3000; take a wide band centered on rider (center-ish)
top = int(3000 * 0.04)
band = photo.crop((0, top, 3000, top + int(3000 * FH / FW)))
band = band.resize((FW, FH), Image.LANCZOS)
# shift rider right: rider is centered; paste band offset so rider sits at ~68% x
fg = Image.new("RGB", (FW, FH), BG_TOP)
offset = int(FW * 0.18)
fg.paste(band, (offset, 0))
# fill left edge with stretched blur of band's left column
edge = band.crop((0, 0, 40, FH)).resize((offset, FH)).filter(ImageFilter.GaussianBlur(40))
fg.paste(edge, (0, 0))
# dark gradient overlay left->right for text legibility
grad = Image.new("L", (FW, 1))
for x in range(FW):
    t = x / FW
    v = int(235 * max(0.0, 1 - t * 1.55))
    grad.putpixel((x, 0), v)
grad = grad.resize((FW, FH))
dark = Image.new("RGB", (FW, FH), (6, 9, 16))
fg = Image.composite(dark, fg, grad)
# bottom vignette
vg = Image.new("L", (1, FH))
for y in range(FH):
    vg.putpixel((0, y), int(120 * max(0, (y / FH - 0.6) / 0.4)))
vg = vg.resize((FW, FH))
fg = Image.composite(dark, fg, vg)

d = ImageDraw.Draw(fg)
f_logo = ImageFont.truetype(F_BOLD, 92)
f_tag = ImageFont.truetype(F_REG, 34)
f_small = ImageFont.truetype(F_BOLD, 26)
lx, ly = 56, 130
# accent bar like app header
d.rounded_rectangle([lx, ly + 12, lx + 10, ly + 84], 5, fill=ACCENT)
d.text((lx + 34, ly), "Ride", font=f_logo, fill=WHITE)
w_ride = d.textlength("Ride", font=f_logo)
d.text((lx + 34 + w_ride, ly), "Tune", font=f_logo, fill=ACCENT)
d.text((lx + 36, ly + 116), "Motorcycle suspension setup", font=f_tag, fill=(226, 232, 240))
d.text((lx + 36, ly + 168), "for your real load", font=f_tag, fill=GREY)
# badge
bt = "OEM-BASED DATA"
btw = d.textlength(bt, font=f_small)
bx, by = lx + 36, ly + 236
d.rounded_rectangle([bx, by, bx + btw + 44, by + 52], 26, outline=ACCENT, width=2)
d.text((bx + 22, by + 12), bt, font=f_small, fill=ACCENT)
fg.save(os.path.join(OUT, "RT_feature_graphic_1024x500.png"), "PNG")
print("saved feature graphic")
