---
name: flyer-to-psd
description: Converts flat raster flyers, posters, and banners (JPG, PNG, WebP) into layered Photoshop (.psd) files with amodal background inpainting, foreground subject & graphic badge segmentation, and a companion ExtendScript (.jsx) that injects coordinate-calibrated, font-matched editable Photoshop TypeLayers.
---

# Flyer to Editable PSD Skill

## Objective
Decompose any flat graphic or promotional flyer into a production-ready Adobe Photoshop project featuring:
1. **Base Layered PSD (`.psd`):** Inpainted clean background (with zero baked-in ghost text) + isolated hero foreground subjects (speakers, pastors, models, products) with clean alpha masks.
2. **Typography Injector (`.jsx`):** A self-executing Adobe ExtendScript file that automatically targets or opens the PSD in Photoshop, locks ruler and type units to pixels, and constructs native, double-clickable, editable `TypeLayer` objects aligned to the original layout.

---

## Environment Dependencies
Ensure the Python environment has the required packages installed before running:
```bash
pip install torch torchvision psd-tools pillow numpy rapidocr-onnxruntime easyocr fonttools ultralytics pytoshop opencv-python
```

---

## Execution Command

Run the unified decomposition pipeline from the workspace root or via python:

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
| `--layers`, `-l` | int | `4` | Number of visual artwork tiers to decompose. |
| `--alpha-threshold` | int | `25` | Alpha cutoff threshold (0–255) to strip diffusion halos and segmentation fringe. |
| `--ocr-engine` | string | `auto` | OCR engine to use: `auto`, `rapidocr` (high-speed ONNX), or `easyocr`. |
| `--device` | string | `auto` | Compute device (`auto`, `cuda`, `cpu`). |
| `--use-diffusion` | flag | `false` | Force dispatch to `Qwen-Image-Layered` diffusion pipeline when running on a CUDA GPU. |
| `--save-png-layers` | flag | `false` | Export each decomposed artwork tier as a standalone transparent PNG in `<output>_layers/`. |
| `--auto-launch` | flag | `false` | Automatically launch Adobe Photoshop and execute the `.jsx` script to inject live `TypeLayer`s. |

---

## Engineering Pipeline & Architecture

### 1. Stage 1: Vision & Typography Analysis
- **Coordinate Calibration:** Computer vision models return top-left coordinates $[x_{\min}, y_{\min}]$, but Photoshop's `textItem.position` sets text on its **typographic baseline** (excluding descenders like *g, j, p, q, y*):
  $$H_{\text{box}} = y_{\max} - y_{\min}$$
  $$Y_{\text{baseline}} = y_{\min} + \lfloor 0.80 \times H_{\text{box}} \rfloor$$
  $$\text{FontSize}_{\text{px}} = \max(10, \lfloor 0.72 \times H_{\text{box}} \rfloor)$$
- **Foreground Color Extraction:** Uses Otsu binarization and perimeter background sampling to extract median RGB glyph color, preventing background gradient or texture contamination.
- **Font Classification & PostScript Matching:** Evaluates aspect ratio and stroke density to classify typography into style buckets (`display-condensed`, `sans-black`, `sans-bold`, `sans-regular`, `serif`, `script`) and matches against installed OS fonts (`C:\Windows\Fonts`, etc.) via `fontTools`.

### 2. Stage 2: Amodal Background Inpainting & Semantic Layer Separation
- **Amodal Background Inpainting:** Creates an inpainting mask dilated across all detected text regions and executes `cv2.inpaint` with `INPAINT_TELEA`. This completely erases baked-in text from `Layer 0 - Clean Inpainted Background`, ensuring moving or editing text layers never leaves ghost letters.
- **Hero Foreground Subject Isolation:** Employs YOLO segmentation (`yolo11n-seg.pt`) to detect persons, speakers, portraits, or key objects, isolating them onto `Layer 1 - Hero Foreground Subject` with clean alpha transparency and Gaussian edge smoothing.
- **Diffusion Support:** Can seamlessly leverage `Qwen-Image-Layered` on CUDA GPUs when `--use-diffusion` is specified.

### 3. Stage 3: Multi-Layer PSD Packaging
- Utilizes `pytoshop` with raw compression and explicit uint8 alpha channels (fully avoiding NumPy 2.x unsigned int overflow bugs).
- Standardized Layer Structure:
  - `Layer 0 - Clean Inpainted Background` (pristine background)
  - `Layer 1 - Hero Foreground Subject` (isolated subject with alpha)
  - (Optional) `Layer 2 - Graphic Accents & Badges`
- Verified and validated with `psd-tools`.

### 4. Stage 4: ExtendScript (.jsx) Generator & Photoshop Execution
- Creates a companion `.jsx` script that:
  - Enforces `app.preferences.rulerUnits = Units.PIXELS` and `app.preferences.typeUnits = TypeUnits.PIXELS`.
  - Opens the target `.psd` file automatically.
  - Generates the top-level folder `"Editable Typography"`.
  - Injects native `TypeLayer` objects with exact PointText coordinates, tracking, capitalization, anti-aliasing, and color.
  - Implements cascading font resolution (`preferredPSName` $\to$ `app.fonts` family search $\to$ `Arial-BoldMT` / `ArialMT`).
  - Restores Photoshop user preferences safely in a `finally` block.

---

## Operational Guardrails
- Always preserve both the `.psd` and `.jsx` output files in the same directory.
- Do not flatten layers or strip alpha channels on layers above index `0`.
- In Photoshop, run the `.jsx` file via **File > Scripts > Browse...** or by double-clicking it on Windows/macOS.
