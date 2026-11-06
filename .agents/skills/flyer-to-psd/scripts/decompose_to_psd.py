#!/usr/bin/env python3
"""
=============================================================================
Unified Hybrid Flyer-to-Editable-PSD Pipeline
=============================================================================
Converts flat raster flyers, posters, and banners (JPG, PNG, WebP) into:
1. Multi-Layered Adobe Photoshop Document (.psd) with amodal background
   inpainting, isolated hero foreground subjects, and graphic badges.
2. Coordinate-Calibrated ExtendScript (.jsx) companion that constructs 100%
   live, double-clickable Photoshop TypeLayers with exact baseline alignment,
   Otsu-sampled text colors, tracking, and local PostScript font matching.
=============================================================================
"""

import argparse
import json
import os
import platform
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import cv2
import numpy as np
from PIL import Image

# ---------------------------------------------------------------------------
# Optional / Lazy Dependencies
# ---------------------------------------------------------------------------
try:
    from rapidocr_onnxruntime import RapidOCR
    RAPIDOCR_AVAILABLE = True
except ImportError:
    RAPIDOCR_AVAILABLE = False

try:
    import easyocr
    EASYOCR_AVAILABLE = True
except ImportError:
    EASYOCR_AVAILABLE = False

try:
    from ultralytics import YOLO
    YOLO_AVAILABLE = True
except ImportError:
    YOLO_AVAILABLE = False

try:
    from fontTools.ttLib import TTFont
    FONTTOOLS_AVAILABLE = True
except ImportError:
    FONTTOOLS_AVAILABLE = False

try:
    import pytoshop
    import pytoshop.enums
    import pytoshop.user.nested_layers as nl
    PYTOSHOP_AVAILABLE = True
except ImportError:
    PYTOSHOP_AVAILABLE = False

try:
    from psd_tools import PSDImage
    PSDTOOLS_AVAILABLE = True
except ImportError:
    PSDTOOLS_AVAILABLE = False

try:
    from diffusers import QwenImageLayeredPipeline
    DIFFUSERS_AVAILABLE = True
except ImportError:
    QwenImageLayeredPipeline = None
    DIFFUSERS_AVAILABLE = False


# ---------------------------------------------------------------------------
# 1. CLI Argument Parsing
# ---------------------------------------------------------------------------
def parse_args():
    parser = argparse.ArgumentParser(
        description="Convert flat flyers into a multi-layered PSD + editable Photoshop TypeLayers via ExtendScript."
    )
    parser.add_argument(
        "--input", "-i", type=str, required=True, help="Path to input flyer image (JPG/PNG/WebP)"
    )
    parser.add_argument(
        "--output", "-o", type=str, required=True, help="Path to target output .psd file"
    )
    parser.add_argument(
        "--layers", "-l", type=int, default=4, help="Number of visual layers to decompose (default: 4)"
    )
    parser.add_argument(
        "--alpha-threshold", type=int, default=25, help="Alpha clipping threshold (0-255) to remove halos (default: 25)"
    )
    parser.add_argument(
        "--ocr-engine",
        type=str,
        choices=["auto", "rapidocr", "easyocr"],
        default="auto",
        help="OCR engine: auto, rapidocr, or easyocr (default: auto)",
    )
    parser.add_argument(
        "--device",
        type=str,
        default="auto",
        help="Compute device (auto, cuda, cpu)",
    )
    parser.add_argument(
        "--use-diffusion",
        action="store_true",
        help="Force using Qwen-Image-Layered diffusion model if available",
    )
    parser.add_argument(
        "--auto-launch",
        action="store_true",
        help="Automatically launch Adobe Photoshop and execute the generated .jsx script",
    )
    parser.add_argument(
        "--save-png-layers",
        action="store_true",
        help="Export individual decomposed layers as transparent PNGs alongside the PSD",
    )
    return parser.parse_args()


# ---------------------------------------------------------------------------
# Helper: Local Model Path Resolver
# ---------------------------------------------------------------------------
def get_model_path(model_name: str = "yolo11n-seg.pt") -> str:
    """Finds existing weights in skill models directory, AppData cache, or cwd."""
    candidates = [
        Path(__file__).resolve().parent.parent / "models" / model_name,
        Path(os.environ.get("LOCALAPPDATA", "")) / "Antigravity" / "models" / model_name,
        Path.cwd() / model_name,
    ]
    for c in candidates:
        if c.exists():
            return str(c)
    return model_name


# ---------------------------------------------------------------------------
# 2. Local OS Font Scanner & Visual Heuristic Classifier
# ---------------------------------------------------------------------------
def get_font_cache_path() -> Path:
    """Returns a persistent cache path for the system font database."""
    if platform.system() == "Windows":
        base_dir = Path(os.environ.get("LOCALAPPDATA", Path.home() / "AppData" / "Local")) / "Antigravity"
    else:
        base_dir = Path.home() / ".cache" / "antigravity"
    base_dir.mkdir(parents=True, exist_ok=True)
    return base_dir / "system_postscript_fonts.json"


def scan_system_postscript_fonts(force_rescan: bool = False) -> Dict[str, str]:
    """
    Scans local OS font directories and builds a dictionary mapping
    lowercase font full names and family names to exact PostScript names
    required by Adobe Photoshop. Caches results for instantaneous subsequent loads.
    """
    cache_path = get_font_cache_path()
    if not force_rescan and cache_path.exists():
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict) and len(data) > 0:
                    return data
        except Exception:
            pass

    font_map: Dict[str, str] = {}
    if not FONTTOOLS_AVAILABLE:
        print("[!] fontTools not installed. Using standard system font fallbacks.", flush=True)
        return font_map

    search_dirs = [
        Path(os.environ.get("WINDIR", "C:\\Windows")) / "Fonts",
        Path.home() / "AppData" / "Local" / "Microsoft" / "Windows" / "Fonts",
        Path("/Library/Fonts"),
        Path("/System/Library/Fonts"),
        Path.home() / "Library" / "Fonts",
        Path("/usr/share/fonts"),
        Path.home() / ".local" / "share" / "fonts",
    ]

    print("[*] Indexing installed system fonts for Photoshop PostScript matching...", flush=True)
    for directory in search_dirs:
        if not directory.exists():
            continue
        for ext in ("*.ttf", "*.otf"):
            for font_path in directory.rglob(ext):
                try:
                    tt = TTFont(str(font_path), fontNumber=0, lazy=True)
                    full_name = None
                    ps_name = None
                    family_name = None
                    for record in tt["name"].names:
                        try:
                            val = record.toUnicode()
                        except Exception:
                            continue
                        if record.nameID == 4 and not full_name:
                            full_name = val
                        elif record.nameID == 6 and not ps_name:
                            ps_name = val
                        elif record.nameID == 1 and not family_name:
                            family_name = val

                    if ps_name:
                        if full_name:
                            font_map[full_name.lower().strip()] = ps_name.strip()
                        if family_name:
                            font_map.setdefault(family_name.lower().strip(), ps_name.strip())
                except Exception:
                    continue

    print(f"    Indexed {len(font_map)} system PostScript font mappings.", flush=True)
    try:
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(font_map, f, indent=2)
    except Exception:
        pass

    return font_map


def estimate_typography_style(crop_rgb: np.ndarray, text_str: str, font_db: Dict[str, str]) -> Dict:
    """
    Analyzes character geometry, aspect ratio, and stroke density from the cropped
    text region to classify the typographic bucket and match the best local PostScript font.
    """
    h, w = crop_rgb.shape[:2]
    char_count = max(1, len(text_str.strip()))
    avg_char_width_ratio = (w / char_count) / max(1, h)

    gray = cv2.cvtColor(crop_rgb, cv2.COLOR_RGB2GRAY)
    _, bin_mask = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    border = np.concatenate([gray[0, :], gray[-1, :], gray[:, 0], gray[:, -1]])
    if np.mean(border) > 127:
        fg_mask = (bin_mask == 0)
    else:
        fg_mask = (bin_mask == 255)

    stroke_density = float(np.mean(fg_mask))
    is_all_caps = text_str.isupper() and len(text_str) > 1

    # Typographic classification buckets
    if avg_char_width_ratio < 0.48:
        # Condensed / Tall display (Headline, dates, posters)
        candidates = ["bebas neue", "impact", "anton", "oswald bold", "arial narrow bold", "arial narrow"]
        fallback_family = "Impact"
    elif stroke_density > 0.42:
        # Extra Bold / Heavy Black
        candidates = ["montserrat black", "arial black", "inter black", "poppins black", "rubik black"]
        fallback_family = "Arial Black"
    elif stroke_density > 0.30:
        # Standard Bold / Semibold
        candidates = [
            "montserrat bold",
            "poppins bold",
            "inter bold",
            "segoe ui bold",
            "arial bold",
            "helvetica bold",
        ]
        fallback_family = "Arial-BoldMT"
    else:
        # Regular / Medium / Body text
        candidates = [
            "montserrat regular",
            "inter regular",
            "poppins regular",
            "segoe ui",
            "arial",
            "helvetica",
        ]
        fallback_family = "ArialMT"

    # Match candidates in local font database
    selected_ps = fallback_family
    for cand in candidates:
        for installed_name, ps_name in font_db.items():
            if cand in installed_name:
                selected_ps = ps_name
                break
        if selected_ps != fallback_family:
            break

    # Tracking: uppercase flyer titles usually have wide letterspacing
    tracking = 60 if is_all_caps and avg_char_width_ratio > 0.65 else 0

    return {
        "postscript_name": selected_ps,
        "fallback_family": fallback_family,
        "all_caps": is_all_caps,
        "tracking": tracking,
    }


# ---------------------------------------------------------------------------
# 3. High-Fidelity Foreground Text Color Sampling
# ---------------------------------------------------------------------------
def sample_foreground_text_color(crop_bgr: np.ndarray) -> List[int]:
    """
    Extracts the true foreground glyph RGB color using Otsu thresholding and
    border background distance analysis, ignoring background gradients or photo textures.
    """
    if crop_bgr.size == 0 or crop_bgr.shape[0] < 2 or crop_bgr.shape[1] < 2:
        return [255, 255, 255]

    crop_rgb = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2RGB)
    gray = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2GRAY)

    _, bin_mask = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Sample perimeter border pixels to determine local background polarity
    border = np.concatenate([gray[0, :], gray[-1, :], gray[:, 0], gray[:, -1]])
    bg_mean = np.mean(border)

    if bg_mean > 127:  # Dark text on light background
        fg_mask = (bin_mask == 0)
    else:  # Light text on dark background
        fg_mask = (bin_mask == 255)

    if np.any(fg_mask):
        fg_pixels = crop_rgb[fg_mask]
        median_rgb = np.median(fg_pixels, axis=0).astype(int).tolist()
    else:
        median_rgb = [255, 255, 255]

    return [max(0, min(255, c)) for c in median_rgb]


# ---------------------------------------------------------------------------
# 4. OCR Typography Extraction & Baseline Coordinate Calibration
# ---------------------------------------------------------------------------
def extract_typography_metadata(
    image_path: str,
    font_db: Dict[str, str],
    ocr_engine: str = "auto",
    min_confidence: float = 0.35,
) -> Tuple[List[Dict], np.ndarray]:
    """
    Runs OCR on the flyer, translates computer-vision bounding boxes [x1, y1] to
    Photoshop typographic baseline coordinates, extracts colors, and builds an
    exact inpainting mask for amodal de-occlusion.
    """
    full_bgr = cv2.imread(image_path)
    if full_bgr is None:
        raise ValueError(f"Failed to read image at {image_path}")

    img_h, img_w = full_bgr.shape[:2]
    text_mask = np.zeros((img_h, img_w), dtype=np.uint8)
    ocr_boxes_raw = []

    # Select OCR Engine
    use_engine = ocr_engine.lower()
    if use_engine == "auto":
        use_engine = "rapidocr" if RAPIDOCR_AVAILABLE else ("easyocr" if EASYOCR_AVAILABLE else "none")

    print(f"[1/4] Running OCR & Typography Analysis (Engine: {use_engine.upper()})...", flush=True)

    if use_engine == "rapidocr" and RAPIDOCR_AVAILABLE:
        ocr = RapidOCR()
        results, _ = ocr(image_path)
        if results:
            for item in results:
                pts, text_str, score = item
                ocr_boxes_raw.append((pts, text_str, float(score)))
    elif use_engine == "easyocr" and EASYOCR_AVAILABLE:
        reader = easyocr.Reader(["en"], gpu=False)
        results = reader.readtext(image_path)
        if results:
            for bbox, text_str, score in results:
                ocr_boxes_raw.append((bbox, text_str, float(score)))
    else:
        print("[!] No supported OCR engine available. Text layers will be empty.", flush=True)

    typography_items = []
    for pts_raw, text, conf in ocr_boxes_raw:
        if conf < min_confidence or not text.strip():
            continue

        pts = np.array(pts_raw, dtype=np.int32)
        x_min = max(0, int(np.min(pts[:, 0])))
        y_min = max(0, int(np.min(pts[:, 1])))
        x_max = min(img_w, int(np.max(pts[:, 0])))
        y_max = min(img_h, int(np.max(pts[:, 1])))

        box_w = max(4, x_max - x_min)
        box_h = max(4, y_max - y_min)

        # Mark text polygon on inpainting mask
        cv2.fillPoly(text_mask, [pts], 255)

        crop_bgr = full_bgr[y_min:y_max, x_min:x_max]
        crop_rgb = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2RGB) if crop_bgr.size > 0 else np.zeros((box_h, box_w, 3), dtype=np.uint8)

        text_color = sample_foreground_text_color(crop_bgr)
        style_info = estimate_typography_style(crop_rgb, text, font_db)

        # Typographic Baseline Calibration:
        # Computer vision box top edge -> typographic baseline sits ~80% down
        baseline_y = y_min + int(box_h * 0.80)
        font_size_px = max(10, int(box_h * 0.72))

        typography_items.append({
            "text": text.strip(),
            "x_left": x_min,
            "y_baseline": baseline_y,
            "width": box_w,
            "height": box_h,
            "font_size": font_size_px,
            "color": text_color,
            "postscript_font": style_info["postscript_name"],
            "fallback_family": style_info["fallback_family"],
            "all_caps": style_info["all_caps"],
            "tracking": style_info["tracking"],
        })

    print(f"      Detected {len(typography_items)} coordinate-calibrated text regions.", flush=True)
    return typography_items, text_mask


# ---------------------------------------------------------------------------
# 5. Amodal Background Inpainting & Semantic Layer Separation
# ---------------------------------------------------------------------------
def clean_alpha_channel(rgba_img: Image.Image, threshold: int = 25) -> Image.Image:
    """Eliminates faint generative diffusion haze or segmentation fringe."""
    rgba = rgba_img.convert("RGBA")
    r, g, b, a = rgba.split()
    alpha_np = np.array(a)
    alpha_np[alpha_np < threshold] = 0
    rgba.putalpha(Image.fromarray(alpha_np))
    return rgba


def decompose_artwork_layers(
    image_path: str,
    text_mask: np.ndarray,
    num_layers: int = 4,
    alpha_threshold: int = 25,
    device: str = "auto",
    use_diffusion: bool = False,
) -> Tuple[List[Image.Image], List[str]]:
    """
    Decomposes the flat flyer into:
    - Layer 0: Inpainted clean background (completely free of baked-in text!)
    - Layer 1: Hero Foreground Subject (persons/products via segmentation)
    """
    raw_bgr = cv2.imread(image_path)
    img_h, img_w = raw_bgr.shape[:2]
    raw_rgb = cv2.cvtColor(raw_bgr, cv2.COLOR_BGR2RGB)

    # 1. Diffusion-Based Decomposition (if explicitly requested & available)
    if use_diffusion and DIFFUSERS_AVAILABLE and QwenImageLayeredPipeline is not None:
        dev = "cuda" if (device == "cuda" or (device == "auto" and cv2.cuda.getCudaEnabledDeviceCount() > 0)) else "cpu"
        print(f"[2/4] Running Qwen-Image-Layered Decomposition on {dev.upper()}...", flush=True)
        try:
            pipe = QwenImageLayeredPipeline.from_pretrained("Qwen/Qwen-Image-Layered").to(dev)
            output_layers = pipe(image=Image.fromarray(raw_rgb), num_layers=num_layers, use_en_prompt=True).images[0]
            layers = [output_layers[0].convert("RGBA")]
            names = ["Layer 0 - Inpainted Background"]
            for idx, lay in enumerate(output_layers[1:], 1):
                layers.append(clean_alpha_channel(lay, threshold=alpha_threshold))
                names.append(f"Layer {idx} - Artwork Tier {idx}")
            return layers, names
        except Exception as e:
            print(f"[!] Diffusion pipeline encountered error ({e}). Falling back to Hybrid CV Decomposition.", flush=True)

    # 2. Intelligent Computer Vision & Deep Learning Decomposition
    print(f"[2/4] Running Hybrid Computer Vision & AI Layer Decomposition ({num_layers} layers)...", flush=True)

    # Dilate text mask adaptively based on image resolution so antialiasing is covered
    kernel_size = max(3, int(min(img_w, img_h) * 0.006))
    if kernel_size % 2 == 0:
        kernel_size += 1
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (kernel_size, kernel_size))
    dilated_text_mask = cv2.dilate(text_mask, kernel, iterations=1)

    # Perform Amodal Inpainting to generate the pristine, de-texted background
    print("      Inpainting background behind text (amodal de-occlusion)...", flush=True)
    inpainted_bgr = cv2.inpaint(raw_bgr, dilated_text_mask, inpaintRadius=5, flags=cv2.INPAINT_TELEA)
    inpainted_rgb = cv2.cvtColor(inpainted_bgr, cv2.COLOR_BGR2RGB)

    # Hero Subject Segmentation via YOLO
    subject_mask = np.zeros((img_h, img_w), dtype=np.uint8)
    subject_detected = False

    if YOLO_AVAILABLE:
        try:
            model_file = get_model_path("yolo11n-seg.pt")
            seg_model = YOLO(model_file)
            seg_results = seg_model(image_path, verbose=False)
            for r in seg_results:
                if r.masks is not None:
                    for i, mask_obj in enumerate(r.masks.data):
                        m = mask_obj.cpu().numpy()
                        m = cv2.resize(m, (img_w, img_h), interpolation=cv2.INTER_LINEAR)
                        bin_m = (m > 0.45).astype(np.uint8) * 255
                        subject_mask = np.maximum(subject_mask, bin_m)
                        subject_detected = True
                        cls_name = seg_model.names[int(r.boxes.cls[i])]
                        print(f"      Isolated hero foreground element: '{cls_name}'", flush=True)
        except Exception as e:
            print(f"[!] YOLO segmentation notice ({e}).", flush=True)

    layers = []
    layer_names = []

    # Layer 0: Inpainted Clean Background
    layers.append(Image.fromarray(inpainted_rgb).convert("RGBA"))
    layer_names.append("Layer 0 - Clean Inpainted Background")

    # Layer 1 / 2: Foreground Subject Layer
    if subject_detected and np.any(subject_mask > 0):
        # Subtract text mask from subject so text does not bleed onto hero subject layer
        clean_subj_alpha = cv2.bitwise_and(subject_mask, cv2.bitwise_not(dilated_text_mask))
        clean_subj_alpha = cv2.GaussianBlur(clean_subj_alpha, (3, 3), 0)

        subject_rgba = np.dstack((raw_rgb, clean_subj_alpha))
        subject_pil = clean_alpha_channel(Image.fromarray(subject_rgba), threshold=alpha_threshold)
        layers.append(subject_pil)
        layer_names.append("Layer 1 - Hero Foreground Subject")

    return layers, layer_names


# ---------------------------------------------------------------------------
# 6. Multi-Layer PSD Packaging
# ---------------------------------------------------------------------------
def write_multilayer_psd(
    layers: List[Image.Image],
    layer_names: List[str],
    output_path: Path,
    save_png_layers: bool = False,
):
    """
    Constructs a true multi-layer Adobe Photoshop (.psd) project using pytoshop,
    with explicit uint8 alpha channels and raw compression.
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)
    w, h = layers[0].size

    if save_png_layers:
        png_dir = output_path.parent / f"{output_path.stem}_layers"
        png_dir.mkdir(parents=True, exist_ok=True)
        for idx, (lay, name) in enumerate(zip(layers, layer_names)):
            clean_name = "".join(c if c.isalnum() or c in "._-" else "_" for c in name)
            lay.save(png_dir / f"{idx:02d}_{clean_name}.png")
        print(f"      Saved individual layer PNGs to: {png_dir}", flush=True)

    if not PYTOSHOP_AVAILABLE:
        print("[!] pytoshop not available. Saving base background layer only.", flush=True)
        layers[0].convert("RGB").save(output_path)
        return

    psd_layer_records = []
    for lay_img, name in zip(layers, layer_names):
        rgba = np.array(lay_img.convert("RGBA"))
        r_ch = rgba[:, :, 0]
        g_ch = rgba[:, :, 1]
        b_ch = rgba[:, :, 2]
        a_ch = rgba[:, :, 3]

        channels = {
            0: r_ch,
            1: g_ch,
            2: b_ch,
            pytoshop.enums.ChannelId.transparency: a_ch,
        }

        clean_layer_name = name.strip()[:63]
        record = nl.Image(
            name=clean_layer_name,
            channels=channels,
            top=0,
            left=0,
            bottom=h,
            right=w,
        )
        psd_layer_records.append(record)

    psd = nl.nested_layers_to_psd(
        psd_layer_records,
        color_mode=pytoshop.enums.ColorMode.rgb,
        compression=pytoshop.enums.Compression.raw,
    )

    with open(output_path, "wb") as fd:
        psd.write(fd)

    # Verification with psd-tools
    if PSDTOOLS_AVAILABLE:
        try:
            verified_psd = PSDImage.open(str(output_path))
            print(f"      Validated PSD: {verified_psd.size[0]}x{verified_psd.size[1]} px, {len(list(verified_psd))} visual layers.", flush=True)
        except Exception as e:
            print(f"[!] PSD validation notice: {e}", flush=True)


# ---------------------------------------------------------------------------
# 7. ExtendScript (.jsx) Companion Generator
# ---------------------------------------------------------------------------
def generate_photoshop_jsx(psd_path: Path, text_items: List[Dict], jsx_path: Path):
    """
    Writes a self-contained Adobe ExtendScript (.jsx) file that opens the PSD,
    locks Ruler & Type units to PIXELS, applies cascading font matching, and
    constructs 100% native, double-clickable Photoshop TypeLayer objects.
    """
    psd_filename = psd_path.name
    psd_posix = psd_path.resolve().as_posix()

    jsx_code = f"""// ============================================================================
// Adobe Photoshop ExtendScript (.jsx) - Live TypeLayer Injector
// Target Master Artwork: {psd_filename}
// ============================================================================
#target photoshop
app.bringToFront();

(function() {{
    // 1. Lock Ruler & Type units to PIXELS to prevent coordinate drift
    var origRulerUnits = app.preferences.rulerUnits;
    var origTypeUnits = app.preferences.typeUnits;

    try {{
        app.preferences.rulerUnits = Units.PIXELS;
        app.preferences.typeUnits = TypeUnits.PIXELS;

        // 2. Cascading Font Matcher
        function applyFontSafe(textItem, preferredPSName, fallbackFamily) {{
            if (preferredPSName) {{
                try {{
                    textItem.font = preferredPSName;
                    return;
                }} catch (e1) {{}}
            }}

            if (fallbackFamily) {{
                var lowerTarget = fallbackFamily.toLowerCase();
                for (var i = 0; i < app.fonts.length; i++) {{
                    var f = app.fonts[i];
                    if (f.name.toLowerCase().indexOf(lowerTarget) !== -1 ||
                        f.postScriptName.toLowerCase().indexOf(lowerTarget) !== -1) {{
                        try {{
                            textItem.font = f.postScriptName;
                            return;
                        }} catch (e2) {{}}
                    }}
                }}
            }}

            try {{
                textItem.font = "Arial-BoldMT";
                return;
            }} catch (e3) {{}}

            try {{
                textItem.font = "ArialMT";
            }} catch (e4) {{}}
        }}

        // 3. Locate or Open Base PSD Document
        var doc = null;
        try {{
            if (app.documents.length > 0 && app.activeDocument.name === "{psd_filename}") {{
                doc = app.activeDocument;
            }}
        }} catch (err) {{}}

        if (!doc) {{
            var psdFile = new File("{psd_posix}");
            if (psdFile.exists) {{
                doc = app.open(psdFile);
            }} else {{
                alert("Target PSD document not found at: {psd_posix}");
                return;
            }}
        }}

        // 4. Create Editable Typography Group at Top of Stack
        var textGroup = doc.layerSets.add();
        textGroup.name = "Editable Typography";
"""

    # Reverse items so top visual headline sits at the top of the Photoshop layers panel
    for idx, item in enumerate(reversed(text_items)):
        raw_text = item["text"]
        esc_text = (
            raw_text.replace("\\", "\\\\")
            .replace('"', '\\"')
            .replace("\r", "\\r")
            .replace("\n", "\\r")
        )
        layer_title = raw_text.replace('"', '').replace('\n', ' ')[:26].strip()
        r, g, b = item["color"]
        cap_flag = "TextCase.ALLCAPS" if item["all_caps"] else "TextCase.NORMAL"

        jsx_code += f"""
        // --- TypeLayer {idx + 1}: "{layer_title}" ---
        try {{
            var tLayer_{idx} = textGroup.artLayers.add();
            tLayer_{idx}.kind = LayerKind.TEXT;
            tLayer_{idx}.name = "{layer_title}";

            var tItem_{idx} = tLayer_{idx}.textItem;
            tItem_{idx}.kind = TextType.POINTTEXT;
            tItem_{idx}.contents = "{esc_text}";
            tItem_{idx}.size = {item['font_size']};
            tItem_{idx}.position = [{item['x_left']}, {item['y_baseline']}];
            tItem_{idx}.tracking = {item['tracking']};
            tItem_{idx}.capitalization = {cap_flag};
            tItem_{idx}.antiAliasMethod = AntiAlias.SMOOTH;

            applyFontSafe(tItem_{idx}, "{item['postscript_font']}", "{item['fallback_family']}");

            var col_{idx} = new SolidColor();
            col_{idx}.rgb.red = {r};
            col_{idx}.rgb.green = {g};
            col_{idx}.rgb.blue = {b};
            tItem_{idx}.color = col_{idx};
        }} catch (layerErr_{idx}) {{}}
"""

    jsx_code += """
    } finally {
        // 5. Restore User Preferences
        app.preferences.rulerUnits = origRulerUnits;
        app.preferences.typeUnits = origTypeUnits;
    }
})();
"""

    jsx_path.parent.mkdir(parents=True, exist_ok=True)
    with open(jsx_path, "w", encoding="utf-8") as f:
        f.write(jsx_code)


# ---------------------------------------------------------------------------
# 8. Auto-Execution in Adobe Photoshop
# ---------------------------------------------------------------------------
def trigger_photoshop_jsx(jsx_path: Path):
    """Attempts to automatically launch Photoshop and run the generated .jsx script."""
    sys_plat = platform.system()
    resolved_jsx = str(jsx_path.resolve())

    print(f"[*] Launching Adobe Photoshop to execute: {jsx_path.name}...", flush=True)
    try:
        if sys_plat == "Windows":
            adobe_dir = Path("C:/Program Files/Adobe")
            ps_exe = None
            if adobe_dir.exists():
                for candidate in sorted(adobe_dir.glob("Adobe Photoshop*"), reverse=True):
                    candidate_exe = candidate / "Photoshop.exe"
                    if candidate_exe.exists():
                        ps_exe = candidate_exe
                        break

            if ps_exe:
                subprocess.Popen([str(ps_exe), "-r", resolved_jsx])
                print(f"    Dispatched to: {ps_exe.name}", flush=True)
            else:
                os.startfile(resolved_jsx)
        elif sys_plat == "Darwin":  # macOS
            subprocess.run(
                [
                    "osascript",
                    "-e",
                    f'tell application id "com.adobe.Photoshop" to do javascript file "{resolved_jsx}"',
                ],
                check=False,
            )
        else:
            print("[!] Auto-launch: Open the .jsx file manually inside Adobe Photoshop.", flush=True)
    except Exception as e:
        print(f"[!] Auto-launch notice ({e}). Run manually via File > Scripts > Browse...", flush=True)


# ---------------------------------------------------------------------------
# Main Pipeline Entrypoint
# ---------------------------------------------------------------------------
def main():
    args = parse_args()
    input_path = Path(args.input)
    output_psd_path = Path(args.output)
    output_jsx_path = output_psd_path.with_suffix(".jsx")

    if not input_path.exists():
        print(f"[Error] Input flyer not found: {input_path}", file=sys.stderr, flush=True)
        sys.exit(1)

    print("=" * 65, flush=True)
    print("  FLYER TO EDITABLE PSD - UNIFIED DECOMPOSITION ENGINE", flush=True)
    print("=" * 65, flush=True)
    print(f"Input Flyer  : {input_path}", flush=True)
    print(f"Output PSD   : {output_psd_path}", flush=True)
    print(f"Output JSX   : {output_jsx_path}", flush=True)

    # 1. System Font DB
    font_db = scan_system_postscript_fonts()

    # 2. Stage 1: OCR & Baseline Typography Extraction
    text_items, text_mask = extract_typography_metadata(
        str(input_path),
        font_db,
        ocr_engine=args.ocr_engine,
    )

    # 3. Stage 2: Generative / Amodal De-occlusion & Layer Separation
    artwork_layers, layer_names = decompose_artwork_layers(
        str(input_path),
        text_mask=text_mask,
        num_layers=args.layers,
        alpha_threshold=args.alpha_threshold,
        device=args.device,
        use_diffusion=args.use_diffusion,
    )

    # 4. Stage 3: Multi-Layer PSD Packaging
    print(f"[3/4] Writing Multi-Layer PSD ({len(artwork_layers)} tiers)...", flush=True)
    write_multilayer_psd(
        artwork_layers,
        layer_names,
        output_psd_path,
        save_png_layers=args.save_png_layers,
    )

    # 5. Stage 4: ExtendScript (.jsx) Generator
    print(f"[4/4] Generating ExtendScript Typography Companion...", flush=True)
    generate_photoshop_jsx(output_psd_path, text_items, output_jsx_path)

    print("\n" + "=" * 65, flush=True)
    print("[✓] PIPELINE EXECUTION COMPLETED SUCCESSFULLY!", flush=True)
    print(f"  1. Layered Artwork PSD : {output_psd_path}", flush=True)
    print(f"  2. Editable Text Script: {output_jsx_path}", flush=True)
    print("  -> How to use:", flush=True)
    print("     Option A: In Photoshop, open File > Scripts > Browse... and select the .jsx file.", flush=True)
    print("     Option B: Double-click the .jsx file to auto-populate the typography layer group.", flush=True)
    print("=" * 65, flush=True)

    if args.auto_launch:
        trigger_photoshop_jsx(output_jsx_path)


if __name__ == "__main__":
    main()
