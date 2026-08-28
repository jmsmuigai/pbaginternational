#!/usr/bin/env python3
"""
Generates every placeholder image the PBAG site ships with: event cover
art, subsidiary banners, the wordmark logo, a favicon, an OG social-share
image, and team-avatar placeholders — all drawn programmatically (gradient
meshes, layered geometric shapes, halftone/grain texture, typography) so
the repo has real, on-brand artwork out of the box with no external image
service required.

These are intentionally described as placeholders throughout the docs:
swap them for real event photography / motion graphics before launch (see
docs/GEMINI_ANTIGRAVITY_TASKS.md for a brief you can hand to an
image-generation tool).

Run: python3 scripts/generate_images.py
"""
import math
import os
import random

from PIL import Image, ImageDraw, ImageFilter, ImageFont

random.seed(7)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "apps", "web", "public", "images")

FONT_DIR = "/usr/share/fonts/truetype/dejavu"
FONT_BOLD = os.path.join(FONT_DIR, "DejaVuSans-Bold.ttf")
FONT_REG = os.path.join(FONT_DIR, "DejaVuSans.ttf")

BRAND = {
    "ink": (18, 11, 35),
    "surface": (27, 17, 48),
    "violet": (124, 58, 237),
    "violetDark": (91, 33, 182),
    "gold": (245, 180, 0),
    "coral": (251, 93, 93),
    "emerald": (34, 197, 94),
    "sky": (14, 165, 233),
    "cream": (252, 247, 240),
}


def font(path, size):
    return ImageFont.truetype(path, size)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def diagonal_gradient(size, c1, c2, angle_deg=35):
    w, h = size
    base = Image.new("RGB", (w, h), c1)
    top = Image.new("RGB", (w, h), c2)
    mask = Image.new("L", (w, h))
    md = mask.load()
    rad = math.radians(angle_deg)
    dx, dy = math.cos(rad), math.sin(rad)
    # project every corner onto the gradient direction to normalize 0..1
    corners = [(0, 0), (w, 0), (0, h), (w, h)]
    projections = [x * dx + y * dy for x, y in corners]
    lo, hi = min(projections), max(projections)
    for y in range(h):
        for x in range(0, w, 2):  # step 2 for speed, fine at this resolution
            p = (x * dx + y * dy - lo) / (hi - lo)
            v = int(255 * max(0, min(1, p)))
            md[x, y] = v
            if x + 1 < w:
                md[x + 1, y] = v
    base.paste(top, (0, 0), mask)
    return base


def add_blobs(img, colors, count=5, alpha=70):
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for _ in range(count):
        c = random.choice(colors)
        r = random.randint(int(min(w, h) * 0.18), int(min(w, h) * 0.42))
        cx = random.randint(-r // 2, w + r // 2)
        cy = random.randint(-r // 2, h + r // 2)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*c, alpha))
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=min(w, h) * 0.06))
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def add_grain(img, intensity=10):
    w, h = img.size
    noise = Image.effect_noise((w, h), 24).convert("L")
    noise = noise.point(lambda p: 128 + (p - 128) * intensity // 100)
    rgb_noise = Image.merge("RGB", (noise, noise, noise))
    return Image.blend(img.convert("RGB"), rgb_noise, 0.03)


def rings(draw, cx, cy, color, n=4, gap=26, width=3, alpha=90):
    for i in range(n):
        r = 40 + i * gap
        bbox = [cx - r, cy - r, cx + r, cy + r]
        draw.ellipse(bbox, outline=(*color, alpha), width=width)


def rounded_pill(draw, xy, radius, fill):
    draw.rounded_rectangle(xy, radius=radius, fill=fill)


def fit_text(draw, text, font_path, max_width, start_size, min_size=24):
    size = start_size
    while size > min_size:
        f = font(font_path, size)
        bbox = draw.textbbox((0, 0), text, font=f)
        if bbox[2] - bbox[0] <= max_width:
            return f
        size -= 4
    return font(font_path, min_size)


def watermark(img, label="PBAG"):
    draw = ImageDraw.Draw(img)
    w, h = img.size
    f = font(FONT_BOLD, 26)
    pad = 28
    draw.text((pad, h - pad - 30), label, font=f, fill=(*BRAND["cream"], 210))
    return img


def draw_monogram(draw, cx, cy, r, fg=(252, 247, 240, 255)):
    # A simple geometric "P" badge mark used as the PBAG monogram.
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=fg, width=max(3, r // 14))
    stem_w = max(6, r // 6)
    draw.rectangle([cx - r * 0.32, cy - r * 0.55, cx - r * 0.32 + stem_w, cy + r * 0.55], fill=fg)
    draw.pieslice(
        [cx - r * 0.32, cy - r * 0.55, cx - r * 0.32 + r * 0.75, cy + r * 0.02],
        -90, 90, fill=fg,
    )
    # punch the inner curve of the "P" bowl
    draw.pieslice(
        [cx - r * 0.32 + stem_w, cy - r * 0.55 + stem_w * 0.6, cx - r * 0.32 + r * 0.75 - stem_w * 0.6, cy - r * 0.02 - stem_w * 0.4],
        -90, 90, fill=(0, 0, 0, 0),
    )


def event_poster(path, title, subtitle, tag, c1, c2, size=(1600, 900)):
    img = diagonal_gradient(size, c1, c2, angle_deg=random.choice([20, 35, 50, 65]))
    img = add_blobs(img, [BRAND["gold"], BRAND["coral"], BRAND["violet"], BRAND["sky"]], count=6, alpha=55)
    draw = ImageDraw.Draw(img, "RGBA")
    w, h = size

    # decorative ring cluster (motion-graphics feel)
    rings(draw, int(w * 0.86), int(h * 0.22), BRAND["cream"], n=5, gap=22, width=2, alpha=110)
    rings(draw, int(w * 0.1), int(h * 0.85), BRAND["gold"], n=3, gap=30, width=2, alpha=90)

    # spotlight beam shapes for a "stage" feel
    for i, ang in enumerate([-18, -6, 6, 18]):
        beam = Image.new("RGBA", size, (0, 0, 0, 0))
        bd = ImageDraw.Draw(beam)
        cx = w * (0.15 + i * 0.24)
        bd.polygon(
            [(cx, -40), (cx + 260, -40), (cx + 520, h + 40), (cx - 220, h + 40)],
            fill=(255, 255, 255, 10),
        )
        beam = beam.rotate(ang, center=(cx, h / 2))
        img = Image.alpha_composite(img.convert("RGBA"), beam)

    draw = ImageDraw.Draw(img, "RGBA")

    # category tag pill
    tag_font = font(FONT_BOLD, 30)
    tb = draw.textbbox((0, 0), tag.upper(), font=tag_font)
    pill_w, pill_h = tb[2] - tb[0] + 56, tb[3] - tb[1] + 34
    rounded_pill(draw, [80, 70, 80 + pill_w, 70 + pill_h], radius=pill_h // 2, fill=(*BRAND["cream"], 235))
    draw.text((80 + 28, 70 + 14), tag.upper(), font=tag_font, fill=BRAND["ink"])

    # title
    title_font = fit_text(draw, title, FONT_BOLD, w - 200, 96, 54)
    draw.text((84, h * 0.42), title, font=title_font, fill=BRAND["cream"])

    # subtitle
    sub_font = font(FONT_REG, 34)
    draw.text((86, h * 0.42 + title_font.size + 22), subtitle, font=sub_font, fill=(*BRAND["cream"], 220))

    draw_monogram(draw, w - 110, h - 110, 48, fg=(*BRAND["cream"], 230))
    img = add_grain(img)
    img = watermark(img.convert("RGBA"), "PBAG INTERNATIONAL")
    img.convert("RGB").save(path, quality=92)
    print("wrote", path)


def subsidiary_banner(path, name, tagline, c1, c2, size=(1200, 1500)):
    img = diagonal_gradient(size, c1, c2, angle_deg=random.choice([25, 45, 70]))
    img = add_blobs(img, [BRAND["cream"], c2, c1], count=5, alpha=45)
    draw = ImageDraw.Draw(img, "RGBA")
    w, h = size

    rings(draw, int(w * 0.5), int(h * 0.28), BRAND["cream"], n=6, gap=24, width=2, alpha=90)

    # abstract stacked bars motif (arts / talent / production feel)
    bar_colors = [BRAND["cream"], BRAND["gold"], BRAND["coral"]]
    for i in range(3):
        bw = w * (0.16 + i * 0.05)
        bh = h * (0.10 + i * 0.05)
        x0 = w * 0.08 + i * 40
        y0 = h * 0.72 - i * (bh + 14)
        draw.rounded_rectangle([x0, y0, x0 + bw, y0 + bh], radius=18, fill=(*bar_colors[i % 3], 210))

    name_font = fit_text(draw, name, FONT_BOLD, w - 140, 84, 44)
    draw.text((70, h * 0.42), name, font=name_font, fill=BRAND["cream"])

    tag_font = font(FONT_REG, 30)
    # simple manual wrap
    words = tagline.split()
    lines, cur = [], ""
    for wd in words:
        trial = (cur + " " + wd).strip()
        if draw.textbbox((0, 0), trial, font=tag_font)[2] > w - 140:
            lines.append(cur)
            cur = wd
        else:
            cur = trial
    if cur:
        lines.append(cur)
    for i, ln in enumerate(lines):
        draw.text((72, h * 0.42 + name_font.size + 20 + i * 40), ln, font=tag_font, fill=(*BRAND["cream"], 225))

    draw_monogram(draw, w - 96, h - 96, 44, fg=(*BRAND["cream"], 230))
    img = add_grain(img)
    img = watermark(img.convert("RGBA"), "PBAG")
    img.convert("RGB").save(path, quality=92)
    print("wrote", path)


def logo(path, size=640):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, "RGBA")
    cx = cy = size // 2
    r = int(size * 0.42)
    grad = diagonal_gradient((size, size), BRAND["violetDark"], BRAND["coral"], 40)
    mask = Image.new("L", (size, size), 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)
    img.paste(grad.convert("RGBA"), (0, 0), mask)
    draw = ImageDraw.Draw(img, "RGBA")
    draw_monogram(draw, cx, cy, int(r * 0.62), fg=(*BRAND["cream"], 255))
    img.save(path)
    print("wrote", path)


def favicon(path, size=256):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, "RGBA")
    cx = cy = size // 2
    r = int(size * 0.46)
    grad = diagonal_gradient((size, size), BRAND["violet"], BRAND["coral"], 40)
    mask = Image.new("L", (size, size), 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)
    img.paste(grad.convert("RGBA"), (0, 0), mask)
    draw = ImageDraw.Draw(img, "RGBA")
    draw_monogram(draw, cx, cy, int(r * 0.68), fg=(*BRAND["cream"], 255))
    img.save(path)
    print("wrote", path)


def og_image(path, size=(1200, 630)):
    img = diagonal_gradient(size, BRAND["ink"], BRAND["violetDark"], 30)
    img = add_blobs(img, [BRAND["gold"], BRAND["coral"], BRAND["violet"]], count=6, alpha=60)
    draw = ImageDraw.Draw(img, "RGBA")
    w, h = size
    rings(draw, w - 220, 150, BRAND["cream"], n=5, gap=20, width=2, alpha=100)
    draw_monogram(draw, 150, h // 2, 90, fg=(*BRAND["cream"], 255))
    title_font = font(FONT_BOLD, 62)
    draw.text((280, h * 0.34), "PBAG International", font=title_font, fill=BRAND["cream"])
    sub_font = font(FONT_REG, 30)
    draw.text((282, h * 0.34 + 74), "Theatre · Talent · Production · Leadership", font=sub_font, fill=(*BRAND["cream"], 220))
    img = add_grain(img)
    img.convert("RGB").save(path, quality=92)
    print("wrote", path)


def avatar(path, seed_color1, seed_color2, size=480):
    img = diagonal_gradient((size, size), seed_color1, seed_color2, random.choice([15, 45, 75, 105]))
    img = add_blobs(img, [BRAND["cream"]], count=3, alpha=35)
    draw = ImageDraw.Draw(img, "RGBA")
    cx, cy = size // 2, int(size * 0.42)
    r = int(size * 0.2)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*BRAND["cream"], 235))
    draw.ellipse(
        [cx - r * 1.6, cy + r * 1.15, cx + r * 1.6, cy + r * 1.15 + r * 2.2],
        fill=(*BRAND["cream"], 235),
    )
    img = img.convert("RGB")
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size, size], radius=int(size * 0.12), fill=255)
    out = Image.new("RGB", (size, size), BRAND["ink"])
    out.paste(img, (0, 0), mask)
    out.save(path, quality=92)
    print("wrote", path)


def hero_texture(path, size=(1920, 1080)):
    """A large abstract background used behind the landing-page carousel
    when a slide has no dedicated cover art loaded yet."""
    img = diagonal_gradient(size, BRAND["ink"], BRAND["surface"], 20)
    img = add_blobs(img, [BRAND["violet"], BRAND["coral"], BRAND["gold"], BRAND["sky"]], count=8, alpha=45)
    draw = ImageDraw.Draw(img, "RGBA")
    w, h = size
    for i in range(10):
        rings(draw, random.randint(0, w), random.randint(0, h), BRAND["cream"], n=2, gap=18, width=1, alpha=35)
    img = add_grain(img, intensity=8)
    img.convert("RGB").save(path, quality=90)
    print("wrote", path)


def kikuyu_theme_background(path, base_color, accent1, accent2, size=(1920, 1080)):
    """A traditional Kenyan Kikuyu inspired background pattern with earthy tones
    and geometric elements (diamonds/triangles) mimicking traditional weaves/beadwork."""
    img = Image.new("RGB", size, base_color)
    draw = ImageDraw.Draw(img, "RGBA")
    w, h = size
    
    # Draw repeating diamond patterns
    pattern_size = 120
    for y in range(0, h + pattern_size, pattern_size):
        for x in range(0, w + pattern_size, pattern_size):
            # Offset every other row
            ox = x + (pattern_size // 2 if (y // pattern_size) % 2 == 1 else 0)
            
            # Outer diamond
            points = [
                (ox, y - pattern_size//2),
                (ox + pattern_size//2, y),
                (ox, y + pattern_size//2),
                (ox - pattern_size//2, y)
            ]
            draw.polygon(points, outline=(*accent1, 40), width=4)
            
            # Inner diamond
            inner_pts = [
                (ox, y - pattern_size//4),
                (ox + pattern_size//4, y),
                (ox, y + pattern_size//4),
                (ox - pattern_size//4, y)
            ]
            draw.polygon(inner_pts, fill=(*accent2, 30))
            
            # Small center dot
            r = 6
            draw.ellipse([ox - r, y - r, ox + r, y + r], fill=(*accent1, 60))

    img = add_grain(img, intensity=12)
    img.save(path, quality=90)
    print("wrote", path)

def main():
    for sub in ["events", "subsidiaries", "brand", "about", "avatars"]:
        os.makedirs(os.path.join(OUT, sub), exist_ok=True)

    # Events
    event_poster(
        os.path.join(OUT, "events", "ithaka-cia-kamiriithu.jpg"),
        "Ithaka cia Kamĩrĩĩthũ",
        "PBAG Theatre · Kenya National Theatre, Nairobi",
        "Theatre",
        BRAND["violetDark"], BRAND["coral"],
    )
    event_poster(
        os.path.join(OUT, "events", "peers-got-talent-finale.jpg"),
        "Peers Got Talent",
        "Season Finale · PBAG Grounds, Nairobi",
        "Talent Show",
        BRAND["gold"], BRAND["coral"],
    )
    event_poster(
        os.path.join(OUT, "events", "pbag-bunge-summit.jpg"),
        "PBAG Bunge Summit",
        "Youth Leadership · Online + Nairobi Hub",
        "Civic / Leadership",
        BRAND["emerald"], BRAND["sky"],
    )

    # Subsidiaries
    subsidiary_banner(
        os.path.join(OUT, "subsidiaries", "pbag-theatre.jpg"),
        "PBAG Theatre", "Stage stories that move the nation.",
        BRAND["violetDark"], BRAND["violet"],
    )
    subsidiary_banner(
        os.path.join(OUT, "subsidiaries", "peers-got-talent.jpg"),
        "Peers Got Talent", "Where undiscovered talent gets its first stage.",
        BRAND["gold"], (251, 146, 60),
    )
    subsidiary_banner(
        os.path.join(OUT, "subsidiaries", "peatice-production.jpg"),
        "Peatice Production", "The craft behind every PBAG production.",
        BRAND["coral"], (185, 28, 28),
    )
    subsidiary_banner(
        os.path.join(OUT, "subsidiaries", "pbag-bunge.jpg"),
        "PBAG Bunge", "Building the next generation of leaders.",
        BRAND["emerald"], BRAND["sky"],
    )

    # Brand
    logo(os.path.join(OUT, "brand", "logo.png"))
    favicon(os.path.join(OUT, "brand", "favicon.png"))
    og_image(os.path.join(OUT, "brand", "og-image.jpg"))
    hero_texture(os.path.join(OUT, "brand", "hero-texture.jpg"))

    # Kikuyu Themes
    kikuyu_theme_background(
        os.path.join(OUT, "brand", "kikuyu-theme-1.jpg"),
        base_color=(24, 12, 12),       # Dark earthy brown/black
        accent1=(139, 69, 19),         # Saddle Brown
        accent2=(178, 34, 34)          # Firebrick Red
    )
    kikuyu_theme_background(
        os.path.join(OUT, "brand", "kikuyu-theme-2.jpg"),
        base_color=(20, 15, 10),       # Very dark brown
        accent1=(205, 133, 63),        # Peru
        accent2=(128, 0, 0)            # Maroon
    )

    # About / gallery avatar placeholders
    palette_pairs = [
        (BRAND["violet"], BRAND["coral"]),
        (BRAND["gold"], BRAND["violetDark"]),
        (BRAND["emerald"], BRAND["sky"]),
        (BRAND["coral"], BRAND["gold"]),
    ]
    for i, (c1, c2) in enumerate(palette_pairs, start=1):
        avatar(os.path.join(OUT, "about", f"leader-{i}.jpg"), c1, c2)

    print("\nAll images generated at", OUT)


if __name__ == "__main__":
    main()
