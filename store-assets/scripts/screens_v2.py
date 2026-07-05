#!/usr/bin/env python3
"""Promo screenshots v2: iPhone-style mockup (like hero) instead of flat card."""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os

SRC = "/sessions/fervent-tender-ptolemy/mnt/RideTune-github/store-assets"
OUT = os.path.join(SRC, "final")
F_BOLD = "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf"
F_REG = "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"

BG_TOP = (9, 13, 22)
BG_BOT = (13, 21, 36)
ACCENT = (74, 158, 255)
WHITE = (255, 255, 255)
GREY = (148, 163, 184)
W, H = 1080, 1920


def gradient_bg(w, h):
    img = Image.new("RGB", (w, h))
    dd = ImageDraw.Draw(img)
    for y in range(h):
        t = y / h
        c = tuple(int(a + (b - a) * t) for a, b in zip(BG_TOP, BG_BOT))
        dd.line([(0, y), (w, y)], fill=c)
    glow = Image.new("L", (w, h), 0)
    gd = ImageDraw.Draw(glow)
    gd.ellipse([w * 0.35, -h * 0.25, w * 1.35, h * 0.35], fill=60)
    glow = glow.filter(ImageFilter.GaussianBlur(180))
    blue = Image.new("RGB", (w, h), (30, 70, 140))
    return Image.composite(blue, img, glow)


def build_phone(shot_path, body_w=660):
    """Upright iPhone-style mockup sized to show the full screenshot."""
    S = 2
    bez = 14 * S
    frame_w = 8 * S
    margin = 20 * S
    pw = body_w * S
    shot0 = Image.open(shot_path).convert("RGB")
    scr_w = pw - 2 * (frame_w + bez)
    shot_h = int(scr_w * shot0.height / shot0.width)
    sb = int(0.055 * shot_h)
    scr_h = sb + shot_h
    ph = scr_h + 2 * (frame_w + bez)
    R = 104 * S
    img = Image.new("RGBA", (pw + 2 * margin, ph + 2 * margin), (0, 0, 0, 0))
    ox = oy = margin

    # titanium frame
    fm = Image.new("L", img.size, 0)
    ImageDraw.Draw(fm).rounded_rectangle([ox, oy, ox + pw, oy + ph], R, fill=255)
    metal = Image.new("RGB", img.size)
    md = ImageDraw.Draw(metal)
    for yy in range(img.size[1]):
        t = yy / img.size[1]
        v = int(105 + 55 * abs(0.5 - t) * 2)
        md.line([(0, yy), (img.size[0], yy)], fill=(v, v + 2, v + 6))
    img.paste(metal, (0, 0), fm)

    # black bezel
    bm = Image.new("L", img.size, 0)
    ImageDraw.Draw(bm).rounded_rectangle(
        [ox + frame_w, oy + frame_w, ox + pw - frame_w, oy + ph - frame_w], R - frame_w, fill=255)
    img.paste(Image.new("RGBA", img.size, (8, 9, 12, 255)), (0, 0), bm)

    # screen
    sx0, sy0 = ox + frame_w + bez, oy + frame_w + bez
    sx1, sy1 = ox + pw - frame_w - bez, oy + ph - frame_w - bez
    sw, sh = sx1 - sx0, sy1 - sy0
    shot = shot0
    top_col = shot.getpixel((10, 6))
    sb_h = sb
    screen = Image.new("RGB", (sw, sh), top_col)
    shot_r = shot.resize((sw, sh - sb_h), Image.LANCZOS)
    screen.paste(shot_r, (0, sb_h))
    sd = ImageDraw.Draw(screen)
    # status bar: time + signal/battery
    f_time = ImageFont.truetype(F_BOLD, int(sb_h * 0.44))
    sd.text((int(sw * 0.115), int(sb_h * 0.30)), "9:41", font=f_time, fill=WHITE)
    ic_top = int(sb_h * 0.36)
    bx = int(sw * 0.76)
    for i in range(4):
        bh = int(sb_h * (0.12 + i * 0.06))
        x0 = bx + i * 7 * S
        sd.rounded_rectangle([x0, ic_top + int(sb_h * 0.30) - bh, x0 + 4 * S, ic_top + int(sb_h * 0.30)], 2, fill=WHITE)
    btx = bx + int(sw * 0.075)
    bw_, bh_ = int(sw * 0.055), int(sb_h * 0.30)
    sd.rounded_rectangle([btx, ic_top, btx + bw_, ic_top + bh_], 6, outline=WHITE, width=2)
    sd.rounded_rectangle([btx + 4, ic_top + 4, btx + int(bw_ * 0.72), ic_top + bh_ - 4], 3, fill=WHITE)

    smask = Image.new("L", (sw, sh), 0)
    ImageDraw.Draw(smask).rounded_rectangle([0, 0, sw - 1, sh - 1], R - frame_w - bez, fill=255)
    img.paste(screen, (sx0, sy0), smask)

    # dynamic island
    di_w, di_h = int(sw * 0.29), int(sh * 0.030)
    di_x = sx0 + (sw - di_w) // 2
    di_y = sy0 + int(sh * 0.013)
    dd = ImageDraw.Draw(img)
    dd.rounded_rectangle([di_x, di_y, di_x + di_w, di_y + di_h], di_h // 2, fill=(5, 5, 8, 255))
    dd.ellipse([di_x + di_w - di_h + 6, di_y + 6, di_x + di_w - 6, di_y + di_h - 6], fill=(18, 22, 34, 255))

    # side buttons
    dd.rounded_rectangle([ox - 4 * S, oy + int(ph * 0.155), ox + 2 * S, oy + int(ph * 0.155) + 30 * S], 4 * S, fill=(88, 90, 96, 255))
    dd.rounded_rectangle([ox - 4 * S, oy + int(ph * 0.225), ox + 2 * S, oy + int(ph * 0.225) + 52 * S], 4 * S, fill=(88, 90, 96, 255))
    dd.rounded_rectangle([ox - 4 * S, oy + int(ph * 0.30), ox + 2 * S, oy + int(ph * 0.30) + 52 * S], 4 * S, fill=(88, 90, 96, 255))
    dd.rounded_rectangle([ox + pw - 2 * S, oy + int(ph * 0.21), ox + pw + 4 * S, oy + int(ph * 0.21) + 84 * S], 4 * S, fill=(88, 90, 96, 255))

    return img.resize((img.width // S, img.height // S), Image.LANCZOS)


def draw_headline(draw, lines, y, size=76):
    font = ImageFont.truetype(F_BOLD, size)
    for line in lines:
        widths = [draw.textlength(t, font=font) for t, _ in line]
        total = sum(widths)
        x = (W - total) / 2
        for (t, col), tw in zip(line, widths):
            draw.text((x, y), t, font=font, fill=col)
            x += tw
        y += int(size * 1.22)
    return y


def promo(shot_path, out_name, lines, sub=None):
    canvas = gradient_bg(W, H).convert("RGBA")
    draw = ImageDraw.Draw(canvas)
    y = draw_headline(draw, lines, 96)
    if sub:
        fsub = ImageFont.truetype(F_REG, 40)
        tw = draw.textlength(sub, font=fsub)
        draw.text(((W - tw) / 2, y + 14), sub, font=fsub, fill=GREY)
        y += 70
    phone = build_phone(shot_path)
    avail = H - (y + 60) - 56
    if phone.height > avail:
        f = avail / phone.height
        phone = phone.resize((int(phone.width * f), avail), Image.LANCZOS)
    px = (W - phone.width) // 2
    py = y + 60
    # shadow
    sh_img = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    alpha = phone.split()[3].point(lambda a: int(a * 0.7))
    shadow = Image.new("RGBA", phone.size, (0, 0, 0, 255))
    shadow.putalpha(alpha)
    sh_img.paste(shadow, (px + 14, py + 26), shadow)
    sh_img = sh_img.filter(ImageFilter.GaussianBlur(26))
    canvas = Image.alpha_composite(canvas, sh_img)
    canvas.alpha_composite(phone, (px, py))
    canvas = canvas.crop((0, 0, W, H)).convert("RGB")
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
