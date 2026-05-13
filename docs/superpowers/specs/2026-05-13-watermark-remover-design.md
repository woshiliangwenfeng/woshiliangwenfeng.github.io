# Watermark Remover Design Spec

**Date:** 2026-05-13
**Author:** Claude Code
**Status:** Design Approved

## Overview

Pure frontend watermark removal tool using dual ONNX models (watermark detection + LaMa inpainting). Designed for single-image processing with fully automated workflow.

## Requirements

- **Target:** Single-image processing, simplicity first
- **Workflow:** Upload → Wait → Download (fully automated)
- **Priority:** Accuracy over speed (5-10 seconds acceptable)
- **Model Storage:** Local `/js/models/` during development, Cloudflare CDN later

## Architecture

```
User Upload
    ↓
[Frontend UI]
    ↓
Check Model Cache
    ↓
Load ONNX Models (Detector + LaMa)
    ↓
Preprocess Image (scale to 512x512)
    ↓
Watermark Detection Inference
    ↓
Generate Mask
    ↓
LaMa Inpainting Inference
    ↓
Postprocess Image (restore original resolution)
    ↓
Download Watermark-Free Image
```

## Core Components

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| **ModelLoader** | Load and cache ONNX models | onnxruntime-web with progress display |
| **ImagePreprocessor** | Image preprocessing | Canvas scaling, normalize to 0-1 |
| **WatermarkDetector** | Watermark detection and Mask generation | U-Net model inference, threshold filtering |
| **LamaInpainter** | Image inpainting | LaMa model inference, fill chunks |
| **Postprocessor** | Image postprocessing | Canvas restore resolution, format conversion |
| **UIController** | UI and progress feedback | Progress bar, status messages, error handling |

## Data Flow

### Input
- Original image (any size, JPG/PNG/WebP)

### Preprocessing
- Save original dimensions
- Scale to 512x512 (model input)
- RGB normalize to [0, 1]
- Convert to Float32Array

### Detection Phase
- Input: [1, 3, 512, 512] tensor
- Model: U-Net watermark segmentation
- Output: [1, 1, 512, 512] Mask
- Postprocess: threshold 0.5, binarize

### Inpainting Phase
- Input: original [1, 3, 512, 512] + Mask [1, 1, 512, 512]
- Model: LaMa inpainting
- Output: [1, 3, 512, 512] inpainted image
- Postprocess: denormalize [0, 255], convert to Uint8Array

### Output
- Watermark-free image (original resolution, PNG format)

## User Interface

### State Machine
```
[Idle] → Upload Image → [Model Loading] → [Detecting] → [Inpainting] → [Complete]
                                 ↓
                              [Error] → Retry Available
```

### UI Elements
- Drag-drop upload area (shows file info)
- Progress bar (stages: model load 40% + detect 30% + inpaint 30%)
- Real-time status text:
  - "Loading models... (XX%)"
  - "Detecting watermark..."
  - "Inpainting image..."
  - "Processing complete!"
- Before/after preview (side by side)
- Download button
- Retry button

### Error Handling
- Browser doesn't support WebGPU/WASM → prompt to use Chrome/Edge
- Model load failed → provide retry button
- Unsupported image format → prompt to upload JPG/PNG
- Processing timeout (30s) → prompt image too large or network issue

## Technical Details

### Dependencies
```html
<script src="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.18.0/dist/ort.min.js"></script>
```

### Model Paths (Development)
- Watermark Detector: `/js/models/watermark-detector.onnx` (~8MB)
- LaMa Inpainter: `/js/models/lama-inpainter.onnx` (~50MB)

### Model Paths (Production)
- Watermark Detector: `https://your-cdn.com/models/watermark-detector.onnx`
- LaMa Inpainter: `https://your-cdn.com/models/lama-inpainter.onnx`

### Memory Management
- Model caching (localStorage or Service Worker Cache)
- Release intermediate tensors to avoid memory leaks
- Auto-limit max dimension to 2048px for large images

### Performance Optimization
- First-time load: prompt user to be patient
- Use WebGPU (priority) or WASM (compatibility) backend
- Background thread processing (Web Worker) to avoid blocking UI

## File Structure

```
tools/
├── watermark-remover.html          # Main page (update existing)
js/
├── models/
│   ├── watermark-detector.onnx     # Watermark detection model (~8MB)
│   └── lama-inpainter.onnx         # LaMa inpainting model (~50MB)
├── watermark-remover/
│   ├── ModelLoader.js              # Model loading and caching
│   ├── WatermarkDetector.js        # Watermark detection
│   ├── LamaInpainter.js            # LaMa inpainting
│   ├── ImageProcessor.js           # Image pre/post processing
│   └── app.js                      # Main application logic
```

## Implementation Tasks

1. **Setup File Structure** - Create directories and base files
2. **Implement ModelLoader** - Load ONNX models with progress feedback
3. **Implement ImageProcessor** - Handle image preprocessing and postprocessing
4. **Implement WatermarkDetector** - U-Net model inference and mask generation
5. **Implement LamaInpainter** - LaMa model inference for image repair
6. **Update UI** - Create progress bar, status messages, before/after preview
7. **Error Handling** - Add comprehensive error handling and user feedback
8. **Testing** - Test with various watermark types and image sizes

## Next Steps

After this spec is approved:
1. Create implementation plan using writing-plans skill
2. Implement components in order
3. Test and debug locally
4. Deploy models to Cloudflare CDN
5. Update model paths for production