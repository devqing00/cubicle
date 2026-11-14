---
name: flyer-to-psd
description: Converts flat raster flyers, posters, and banners (JPG, PNG, WebP) into layered Photoshop (.psd) files with amodal background inpainting, foreground subject & graphic badge segmentation, and a companion ExtendScript (.jsx) that injects coordinate-calibrated, font-matched editable Photoshop TypeLayers.
---

# Flyer to Editable PSD Skill (Canva-Grade Edition)

## Objective
Decompose any flat raster graphic, flyer, poster, or banner into a production-ready Adobe Photoshop project featuring:
1. **Pristine Master Background Layer (`.psd`):** 100% full-resolution, razor-sharp artwork background where **only the thin text glyph strokes are inpainted** (via Navier-Stokes or Telea), completely eliminating blurry smudges, rectangular cutouts, or destroyed background textures.
2. **Coordinate-Calibrated Live Typography Companion (`.jsx`):** Self-executing Adobe ExtendScript file that constructs native, double-clickable, editable `TypeLayer` objects inside an `"Editable Typography"` group with exact font sizes, horizontal justification (Center, Left, Right), baselines, and Otsu-sampled RGB colors.
3. **Optional Subject Isolation (`--separate-subjects`):** Opt-in YOLO foreground segmentation to isolate speakers, pastors, products, or badges onto independent alpha layers.

---

## Environment Dependencies
Ensure the Python environment has the required packages installed:
```bash
pip install torch torchvision psd-tools pillow numpy rapidocr-onnxruntime easyocr fonttools ultralytics pytoshop opencv-python
```

---

## Execution Command

Run the pipeline from the workspace root or via Python:

```bash
python .agents/skills/flyer-to-psd/scripts/decompose_to_psd.py \
    --input <PATH_TO_INPUT_IMAGE> \
    --output <PATH_TO_OUTPUT_PSD>
```

### Full Example
```bash
python .agents/skills/flyer-to-psd/scripts/decompose_to_psd.py \
    --input "C:\Users\QING\Downloads\Church Conference Flyer Design.jpg" \
    --output "output/church_flyer.psd" \
    --save-png-layers
```

---

## Command-Line Arguments & Flags

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--input`, `-i` | string | *required* | Path to the flat input flyer image (`.jpg`, `.png`, `.webp`). |
| `--output`, `-o` | string | *required* | Target path for the output `.psd` file. The companion `.jsx` is automatically created with the same basename. |
| `--separate-subjects` | flag | `false` | Optional: Isolate hero foreground subjects (persons/speakers/products) into separate layers via YOLO. Default is `false` (Canva style: clean canvas + text layers). |
| `--alpha-threshold` | int | `25` | Alpha cutoff threshold (0–255) to strip segmentation fringe when separating subjects. |
| `--ocr-engine` | string | `auto` | OCR engine to use: `auto`, `rapidocr` (high-speed ONNX with English model), or `easyocr`. |
| `--inpaint-method` | string | `ns` | Inpainting algorithm: `ns` (Navier-Stokes, default) or `telea`. |
| `--min-confidence` | float | `0.40` | Minimum OCR confidence score to extract text layer (default: 0.40). |
| `--save-png-layers` | flag | `false` | Export each decomposed artwork tier as a standalone transparent PNG in `<output>_layers/`. |
| `--auto-launch` | flag | `false` | Automatically launch Adobe Photoshop and execute the `.jsx` script to inject live `TypeLayer`s. |

---

## Technical Architecture & Core Innovations

### 1. Glyph-Stroke Amodal Inpainting (Zero Blurry Rectangles)
- **Problem Solved:** Traditional bounding-box inpainting wipes out entire rectangular areas, turning background gradients, stage lights, curtains, and photos into blurry smudges.
- **Canva Standard:** The pipeline crops each detected text region, applies Otsu binarization to extract the **exact binary glyph strokes of the characters**, dilates them by only **2 to 3 pixels** (just enough to cover antialiasing), and inpaints with Navier-Stokes (`cv2.INPAINT_NS`).
- **Result:** Over 80–90% of the flyer background remains 100% bit-for-bit identical to the original image, razor-sharp and unblurred.

### 2. English Space Restoration & Word Segmentation
- High-speed recognition uses `en_PP-OCRv3_rec_infer.onnx` with embedded English vocabulary.
- An integrated dynamic programming word segmenter backed by a frequency lexicon automatically restores spaces in joined uppercase strings (e.g., `GENERALSECRETARY` $\to$ `GENERAL SECRETARY`, `UNITEDKINGDOM` $\to$ `UNITED KINGDOM`, `FASTING&PRAYER` $\to$ `FASTING & PRAYER`) while safely preserving proper nouns and single words (`ODEYEMI`, `CONGRATULATIONS`).

### 3. Exact Typography Size, Alignment & Baseline Calibration
- **Font Size Calibration:** In digital typography, the em-square is larger than the visible capital letter height ($H_{\text{cap}} \approx 72\%$ of em-box). Setting font size to $H_{\text{box}}$ makes text 30–40% too small. The pipeline sets:
  $$\text{FontSize}_{\text{px}} = \max\left(10, \left\lfloor \frac{H_{\text{box}}}{0.72} \right\rfloor\right)$$
- **Baseline Alignment:**
  - For all-caps headlines (no descenders): $Y_{\text{baseline}} = y_{\max} - \lfloor 0.04 \times H_{\text{box}} \rfloor$
  - For text with descenders (*g, j, p, q, y*): $Y_{\text{baseline}} = y_{\min} + \lfloor 0.82 \times H_{\text{box}} \rfloor$
- **Intelligent Justification:** Detects whether text is horizontally centered on the flyer:
  - Centered: `tItem.justification = Justification.CENTER`, `position = [center_x, baseline_y]`
  - Left-aligned: `tItem.justification = Justification.LEFT`, `position = [x_min, baseline_y]`
  - Right-aligned: `tItem.justification = Justification.RIGHT`, `position = [x_max, baseline_y]`
- **Anti-Aliasing:** Enforces `tItem.antiAliasMethod = AntiAlias.CRISP` for crisp text rendering on any display.

### 4. Native Photoshop ExtendScript (.jsx) Execution
- Locks `rulerUnits` and `typeUnits` to `PIXELS`.
- Groups all generated layers into a clean `"Editable Typography"` folder.
- Applies cascading font resolution: preferred PostScript name $\to$ local system font search $\to$ `Arial-BoldMT` / `ArialMT`.
- Restores original Photoshop preferences in a `finally` block.

---

## Operational Guardrails
- Always preserve both the `.psd` and `.jsx` output files in the same directory.
- In Photoshop, run the `.jsx` file via **File > Scripts > Browse...** or by double-clicking it on Windows/macOS.
