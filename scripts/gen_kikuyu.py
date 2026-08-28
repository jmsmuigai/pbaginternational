import os
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "apps", "web", "public", "images", "brand")
os.makedirs(OUT, exist_ok=True)

def add_grain(img, intensity=10):
    w, h = img.size
    noise = Image.effect_noise((w, h), 24).convert("L")
    noise = noise.point(lambda p: 128 + (p - 128) * intensity // 100)
    rgb_noise = Image.merge("RGB", (noise, noise, noise))
    return Image.blend(img.convert("RGB"), rgb_noise, 0.03)

def kikuyu_theme_background(path, base_color, accent1, accent2, size=(1920, 1080)):
    img = Image.new("RGB", size, base_color)
    draw = ImageDraw.Draw(img, "RGBA")
    w, h = size
    
    pattern_size = 120
    for y in range(0, h + pattern_size, pattern_size):
        for x in range(0, w + pattern_size, pattern_size):
            ox = x + (pattern_size // 2 if (y // pattern_size) % 2 == 1 else 0)
            
            points = [
                (ox, y - pattern_size//2),
                (ox + pattern_size//2, y),
                (ox, y + pattern_size//2),
                (ox - pattern_size//2, y)
            ]
            draw.polygon(points, outline=(*accent1, 40), width=4)
            
            inner_pts = [
                (ox, y - pattern_size//4),
                (ox + pattern_size//4, y),
                (ox, y + pattern_size//4),
                (ox - pattern_size//4, y)
            ]
            draw.polygon(inner_pts, fill=(*accent2, 30))
            
            r = 6
            draw.ellipse([ox - r, y - r, ox + r, y + r], fill=(*accent1, 60))

    img = add_grain(img, intensity=12)
    img.save(path, quality=90)
    print("wrote", path)

if __name__ == "__main__":
    kikuyu_theme_background(
        os.path.join(OUT, "kikuyu-theme-1.jpg"),
        base_color=(24, 12, 12),
        accent1=(139, 69, 19),
        accent2=(178, 34, 34)
    )
    kikuyu_theme_background(
        os.path.join(OUT, "kikuyu-theme-2.jpg"),
        base_color=(20, 15, 10),
        accent1=(205, 133, 63),
        accent2=(128, 0, 0)
    )
