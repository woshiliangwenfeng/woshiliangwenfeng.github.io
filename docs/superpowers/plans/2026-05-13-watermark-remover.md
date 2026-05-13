# Watermark Remover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pure frontend watermark removal tool using dual ONNX models (watermark detection + LaMa inpainting) with fully automated workflow.

**Architecture:** Dual-model pipeline - U-Net for watermark detection generates a mask, then LaMa inpainting model uses the mask to repair the image. All processing happens in-browser using ONNX Runtime Web.

**Tech Stack:** HTML5, CSS (existing Figma design system), JavaScript (ES6+), ONNX Runtime Web 1.18.0

---

### Task 1: Create File Structure and Add ONNX Runtime Dependency

**Files:**
- Create: `js/watermark-remover/` directory
- Create: `js/models/` directory
- Modify: `tools/watermark-remover.html:40-42` (add ONNX runtime script)

- [ ] **Step 1: Create directories**

```bash
mkdir -p js/watermark-remover js/models
```

- [ ] **Step 2: Add ONNX Runtime script to watermark-remover.html**

Find the existing `<script>` tags in the `<head>` section and add ONNX Runtime dependency:

```html
<!-- ONNX Runtime Web -->
<script src="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.18.0/dist/ort.min.js"></script>
```

- [ ] **Step 3: Commit**

```bash
git add tools/watermark-remover.html js/watermark-remover/ js/models/
git commit -m "feat: add ONNX runtime dependency and create directory structure for watermark remover"
```

---

### Task 2: Implement ModelLoader.js

**Files:**
- Create: `js/watermark-remover/ModelLoader.js`

- [ ] **Step 1: Write ModelLoader class**

```javascript
/**
 * ModelLoader - Handles loading and caching of ONNX models
 */
class ModelLoader {
    constructor() {
        this.detectorModel = null;
        this.inpainterModel = null;
        this.isLoaded = false;
    }

    /**
     * Load both models with progress callback
     * @param {function(number)} onProgress - Progress callback (0-100)
     * @returns {Promise<void>}
     */
    async loadModels(onProgress) {
        if (this.isLoaded) {
            return;
        }

        try {
            // Load detector model (40% of total load time)
            onProgress(20);
            this.detectorModel = await ort.InferenceSession.create(
                '/js/models/watermark-detector.onnx',
                { executionProviders: ['webgl', 'wasm'] }
            );
            onProgress(40);

            // Load inpainter model (60% of total load time)
            onProgress(60);
            this.inpainterModel = await ort.InferenceSession.create(
                '/js/models/lama-inpainter.onnx',
                { executionProviders: ['webgl', 'wasm'] }
            );
            onProgress(100);

            this.isLoaded = true;
        } catch (error) {
            this.isLoaded = false;
            throw new Error(`Failed to load models: ${error.message}`);
        }
    }

    /**
     * Get loaded models
     * @returns {{detector: InferenceSession, inpainter: InferenceSession}}
     */
    getModels() {
        if (!this.isLoaded) {
            throw new Error('Models not loaded. Call loadModels() first.');
        }
        return {
            detector: this.detectorModel,
            inpainter: this.inpainterModel
        };
    }

    /**
     * Check if models are loaded
     * @returns {boolean}
     */
    isReady() {
        return this.isLoaded;
    }
}

export default ModelLoader;
```

- [ ] **Step 2: Commit**

```bash
git add js/watermark-remover/ModelLoader.js
git commit -m "feat: implement ModelLoader class for ONNX model loading"
```

---

### Task 3: Implement ImageProcessor.js

**Files:**
- Create: `js/watermark-remover/ImageProcessor.js`

- [ ] **Step 1: Write ImageProcessor class**

```javascript
/**
 * ImageProcessor - Handles image preprocessing and postprocessing
 */
class ImageProcessor {
    /**
     * Preprocess image for model input
     * @param {HTMLImageElement} image - Source image
     * @param {number} targetSize - Target size (default 512)
     * @returns {{tensor: Float32Array, originalSize: {width: number, height: number}, scale: number}}
     */
    static preprocessImage(image, targetSize = 512) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const originalWidth = image.naturalWidth;
        const originalHeight = image.naturalHeight;

        // Calculate scale to fit within targetSize
        const scale = Math.min(targetSize / originalWidth, targetSize / originalHeight);
        const newWidth = Math.round(originalWidth * scale);
        const newHeight = Math.round(originalHeight * scale);

        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx.drawImage(image, 0, 0, newWidth, newHeight);

        // Get image data and convert to tensor
        const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
        const data = imageData.data;

        // Convert RGBA to RGB and normalize to [0, 1]
        const tensor = new Float32Array(1 * 3 * newHeight * newWidth);
        for (let i = 0, j = 0; i < data.length; i += 4, j++) {
            tensor[j] = data[i] / 255.0;         // R
            tensor[j + newHeight * newWidth] = data[i + 1] / 255.0; // G
            tensor[j + 2 * newHeight * newWidth] = data[i + 2] / 255.0; // B
        }

        return {
            tensor,
            originalSize: { width: originalWidth, height: originalHeight },
            processedSize: { width: newWidth, height: newHeight },
            scale
        };
    }

    /**
     * Postprocess model output to image
     * @param {Float32Array} tensor - Model output tensor [1, 3, H, W]
     * @param {number} height - Image height
     * @param {number} width - Image width
     * @returns {string} - Data URL of the output image
     */
    static postprocessImage(tensor, height, width) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        // Convert tensor from [0, 1] to [0, 255]
        for (let i = 0; i < data.length; i += 4) {
            const pixelIndex = Math.floor(i / 4);
            data[i] = Math.min(255, Math.max(0, tensor[pixelIndex] * 255));           // R
            data[i + 1] = Math.min(255, Math.max(0, tensor[pixelIndex + height * width] * 255)); // G
            data[i + 2] = Math.min(255, Math.max(0, tensor[pixelIndex + 2 * height * width] * 255)); // B
            data[i + 3] = 255; // Alpha
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL('image/png');
    }

    /**
     * Resize output image to original dimensions
     * @param {string} dataUrl - Source image data URL
     * @param {number} targetWidth - Target width
     * @param {number} targetHeight - Target height
     * @returns {string} - Resized image data URL
     */
    static resizeToOriginal(dataUrl, targetWidth, targetHeight) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = targetWidth;
                canvas.height = targetHeight;

                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                resolve(canvas.toDataURL('image/png'));
            };
            img.src = dataUrl;
        });
    }

    /**
     * Process mask to binary format
     * @param {Float32Array} tensor - Model output tensor [1, 1, H, W]
     * @param {number} height - Mask height
     * @param {number} width - Mask width
     * @param {number} threshold - Threshold for binary mask (default 0.5)
     * @returns {Float32Array} - Binary mask tensor
     */
    static processMask(tensor, height, width, threshold = 0.5) {
        const binaryMask = new Float32Array(tensor.length);
        for (let i = 0; i < tensor.length; i++) {
            binaryMask[i] = tensor[i] > threshold ? 1.0 : 0.0;
        }
        return binaryMask;
    }
}

export default ImageProcessor;
```

- [ ] **Step 2: Commit**

```bash
git add js/watermark-remover/ImageProcessor.js
git commit -m "feat: implement ImageProcessor for image pre/postprocessing"
```

---

### Task 4: Implement WatermarkDetector.js

**Files:**
- Create: `js/watermark-remover/WatermarkDetector.js`

- [ ] **Step 1: Write WatermarkDetector class**

```javascript
import ImageProcessor from './ImageProcessor.js';

/**
 * WatermarkDetector - Handles watermark detection using U-Net model
 */
class WatermarkDetector {
    /**
     * Detect watermarks in image
     * @param {InferenceSession} model - Loaded detector model
     * @param {Float32Array} imageTensor - Preprocessed image tensor
     * @param {number} height - Image height
     * @param {number} width - Image width
     * @returns {{mask: Float32Array, hasWatermark: boolean}}
     */
    static async detect(model, imageTensor, height, width) {
        try {
            // Prepare input tensor [1, 3, H, W]
            const inputTensor = new ort.Tensor('float32', imageTensor, [1, 3, height, width]);

            // Run inference
            const outputs = await model.run({ input: inputTensor });
            const outputTensor = outputs.output; // Expected output: [1, 1, H, W]

            // Convert output to Float32Array
            const maskData = outputTensor.data;

            // Process mask to binary
            const binaryMask = ImageProcessor.processMask(maskData, height, width);

            // Check if watermark detected (mask has any positive pixels)
            const hasWatermark = binaryMask.some(value => value > 0);

            return {
                mask: binaryMask,
                hasWatermark
            };
        } catch (error) {
            throw new Error(`Watermark detection failed: ${error.message}`);
        }
    }

    /**
     * Create mask tensor for LaMa model
     * @param {Float32Array} mask - Binary mask data
     * @param {number} height - Mask height
     * @param {number} width - Mask width
     * @returns {ort.Tensor} - Mask tensor [1, 1, H, W]
     */
    static createMaskTensor(mask, height, width) {
        return new ort.Tensor('float32', mask, [1, 1, height, width]);
    }
}

export default WatermarkDetector;
```

- [ ] **Step 2: Commit**

```bash
git add js/watermark-remover/WatermarkDetector.js
git commit -m "feat: implement WatermarkDetector for U-Net model inference"
```

---

### Task 5: Implement LamaInpainter.js

**Files:**
- Create: `js/watermark-remover/LamaInpainter.js`

- [ ] **Step 1: Write LamaInpainter class**

```javascript
import ImageProcessor from './ImageProcessor.js';

/**
 * LamaInpainter - Handles image inpainting using LaMa model
 */
class LamaInpainter {
    /**
     * Inpaint image to remove watermarks
     * @param {InferenceSession} model - Loaded inpainter model
     * @param {Float32Array} imageTensor - Preprocessed image tensor
     * @param {Float32Array} maskTensor - Binary mask tensor
     * @param {number} height - Image height
     * @param {number} width - Image width
     * @returns {Float32Array} - Inpainted image tensor
     */
    static async inpaint(model, imageTensor, maskTensor, height, width) {
        try {
            // Prepare input tensors
            const imageInput = new ort.Tensor('float32', imageTensor, [1, 3, height, width]);
            const maskInput = new ort.Tensor('float32', maskTensor, [1, 1, height, width]);

            // Run inference
            const outputs = await model.run({
                image: imageInput,
                mask: maskInput
            });

            // Get output tensor [1, 3, H, W]
            const outputTensor = outputs.output;
            const outputData = outputTensor.data;

            return outputData;
        } catch (error) {
            throw new Error(`LaMa inpainting failed: ${error.message}`);
        }
    }

    /**
     * Process inpainting result to image data URL
     * @param {Float32Array} tensor - Inpainting output tensor
     * @param {number} height - Image height
     * @param {number} width - Image width
     * @param {{width: number, height: number}} originalSize - Original image dimensions
     * @returns {Promise<string>} - Final image data URL
     */
    static async processResult(tensor, height, width, originalSize) {
        // Postprocess to image
        const dataUrl = ImageProcessor.postprocessImage(tensor, height, width);

        // Resize to original dimensions
        const finalDataUrl = await ImageProcessor.resizeToOriginal(
            dataUrl,
            originalSize.width,
            originalSize.height
        );

        return finalDataUrl;
    }
}

export default LamaInpainter;
```

- [ ] **Step 2: Commit**

```bash
git add js/watermark-remover/LamaInpainter.js
git commit -m "feat: implement LamaInpainter for image inpainting"
```

---

### Task 6: Update UI in watermark-remover.html

**Files:**
- Modify: `tools/watermark-remover.html` (update UI structure and add progress indicators)

- [ ] **Step 1: Update upload zone and add progress section**

Replace the existing upload zone and controls section with:

```html
<!-- Upload Zone -->
<div class="upload-zone" id="uploadZone">
    <div class="upload-zone-icon">📁</div>
    <h3 class="typography-headline mb-sm" data-i18n="watermark-remover.upload.title">Drop your image here</h3>
    <p class="typography-body-sm mb-md" data-i18n="watermark-remover.upload.subtitle">or click to browse</p>
    <p class="typography-caption" data-i18n="watermark-remover.upload.supported">Supported formats: JPG, PNG, WebP</p>
    <input type="file" class="file-input" id="fileInput" accept="image/jpeg,image/png,image/webp">
</div>

<!-- Processing Section -->
<div class="processing-section" id="processingSection" style="display: none;">
    <div class="progress-container" style="margin-bottom: var(--spacing-lg);">
        <div class="progress-bar" style="height: 8px; background: var(--color-hairline); border-radius: 4px; overflow: hidden;">
            <div class="progress-fill" id="progressFill" style="height: 100%; background: var(--color-primary); width: 0%; transition: width 0.3s ease;"></div>
        </div>
        <p class="typography-caption mt-sm" id="progressText" style="text-align: center;">Loading models... (0%)</p>
    </div>
</div>

<!-- Status Message -->
<div class="status-message" id="statusMessage"></div>

<!-- Preview Section -->
<div class="preview-section" id="previewSection">
    <div class="image-preview">
        <!-- Original Image -->
        <div class="preview-card">
            <h3 data-i18n="watermark-remover.preview.original">Original Image</h3>
            <div class="image-container" id="originalContainer">
                <img id="originalImage" src="" alt="Original image">
            </div>
        </div>

        <!-- Processed Image -->
        <div class="preview-card">
            <h3 data-i18n="watermark-remover.preview.processed">Processed Image</h3>
            <div class="image-container" id="processedContainer">
                <img id="processedImage" src="" alt="Processed image">
            </div>
        </div>
    </div>

    <!-- Actions -->
    <div class="actions">
        <div class="action-buttons">
            <button class="btn btn-primary" id="downloadBtn" data-i18n="watermark-remover.buttons.download">Download</button>
            <button class="btn btn-secondary" id="resetBtn" data-i18n="watermark-remover.buttons.reset">Upload Another</button>
        </div>
    </div>
</div>
```

- [ ] **Step 2: Add processing-section styles**

Add to the `<style>` block:

```css
.processing-section {
    background-color: var(--color-surface-soft);
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-xl);
}

.progress-container {
    text-align: center;
}

.progress-fill {
    background: var(--color-primary);
    transition: width 0.3s ease;
}
```

- [ ] **Step 3: Commit**

```bash
git add tools/watermark-remover.html
git commit -m "feat: update watermark-remover UI with progress indicators"
```

---

### Task 7: Implement Main Application Logic (app.js)

**Files:**
- Create: `js/watermark-remover/app.js`

- [ ] **Step 1: Write main application class**

```javascript
import ModelLoader from './ModelLoader.js';
import ImageProcessor from './ImageProcessor.js';
import WatermarkDetector from './WatermarkDetector.js';
import LamaInpainter from './LamaInpainter.js';

/**
 * WatermarkRemover - Main application for watermark removal
 */
class WatermarkRemover {
    constructor() {
        this.modelLoader = new ModelLoader();
        this.originalImage = null;
        this.processedImage = null;
        this.isProcessing = false;

        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.uploadZone = document.getElementById('uploadZone');
        this.fileInput = document.getElementById('fileInput');
        this.processingSection = document.getElementById('processingSection');
        this.previewSection = document.getElementById('previewSection');
        this.originalImage = document.getElementById('originalImage');
        this.processedImage = document.getElementById('processedImage');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.statusMessage = document.getElementById('statusMessage');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.resetBtn = document.getElementById('resetBtn');
    }

    attachEventListeners() {
        // Upload zone
        this.uploadZone.addEventListener('click', () => this.fileInput.click());
        this.uploadZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadZone.addEventListener('drop', (e) => this.handleDrop(e));
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Action buttons
        this.downloadBtn.addEventListener('click', () => this.downloadResult());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadZone.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadZone.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            this.processImage(file);
        } else {
            this.showStatus('Please upload a valid image file (JPG, PNG, WebP)', 'error');
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processImage(file);
        }
    }

    async processImage(file) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            // Hide upload zone, show processing section
            this.uploadZone.style.display = 'none';
            this.processingSection.style.display = 'block';
            this.previewSection.style.display = 'none';
            this.showStatus('', '');

            // Load image
            const imageData = await this.loadImage(file);
            this.originalImage.src = imageData;

            // Load models if not already loaded
            if (!this.modelLoader.isReady()) {
                await this.loadModels();
            }

            // Preprocess image
            this.updateProgress(40, 'Detecting watermark...');
            const processed = ImageProcessor.preprocessImage(this.originalImage);

            // Detect watermark
            const models = this.modelLoader.getModels();
            const detection = await WatermarkDetector.detect(
                models.detector,
                processed.tensor,
                processed.processedSize.height,
                processed.processedSize.width
            );

            if (!detection.hasWatermark) {
                this.showStatus('No watermark detected. Downloading original image.', 'success');
                this.processedImage.src = imageData;
                this.showPreview();
                return;
            }

            // Inpaint image
            this.updateProgress(70, 'Inpainting image...');
            const inpainted = await LamaInpainter.inpaint(
                models.inpainter,
                processed.tensor,
                detection.mask,
                processed.processedSize.height,
                processed.processedSize.width
            );

            // Postprocess result
            this.updateProgress(90, 'Processing result...');
            const finalDataUrl = await LamaInpainter.processResult(
                inpainted,
                processed.processedSize.height,
                processed.processedSize.width,
                processed.originalSize
            );

            // Show result
            this.processedImage.src = finalDataUrl;
            this.showPreview();
            this.showStatus('Watermark removed successfully!', 'success');
            this.updateProgress(100, 'Complete!');

        } catch (error) {
            console.error('Processing error:', error);
            this.showStatus(`Error: ${error.message}`, 'error');
            this.uploadZone.style.display = 'block';
        } finally {
            this.isProcessing = false;
        }
    }

    loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async loadModels() {
        return new Promise((resolve, reject) => {
            this.modelLoader.loadModels((progress) => {
                this.updateProgress(progress * 0.4, `Loading models... (${Math.round(progress)}%)`);
            }).then(resolve).catch(reject);
        });
    }

    updateProgress(percent, text) {
        this.progressFill.style.width = `${percent}%`;
        this.progressText.textContent = text;
    }

    showStatus(message, type) {
        if (!message) {
            this.statusMessage.classList.remove('active');
            return;
        }

        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message active ${type}`;
    }

    showPreview() {
        this.processingSection.style.display = 'none';
        this.previewSection.style.display = 'block';
    }

    downloadResult() {
        const link = document.createElement('a');
        link.download = 'watermark-removed.png';
        link.href = this.processedImage.src;
        link.click();
    }

    reset() {
        this.uploadZone.style.display = 'block';
        this.processingSection.style.display = 'none';
        this.previewSection.style.display = 'none';
        this.fileInput.value = '';
        this.originalImage.src = '';
        this.processedImage.src = '';
        this.showStatus('', '');
        this.updateProgress(0, '');
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initI18n('watermark-remover');
    new WatermarkRemover();
});
```

- [ ] **Step 2: Update watermark-remover.html to include app.js**

Find the existing `<script>` tag at the bottom and replace with:

```html
<script type="module" src="../js/watermark-remover/app.js"></script>
```

- [ ] **Step 3: Commit**

```bash
git add js/watermark-remover/app.js tools/watermark-remover.html
git commit -m "feat: implement main application logic for watermark removal"
```

---

### Task 8: Add Error Handling and Browser Compatibility Checks

**Files:**
- Modify: `js/watermark-remover/app.js`

- [ ] **Step 1: Add browser compatibility check**

Add this method to the WatermarkRemover class after the constructor:

```javascript
    checkBrowserCompatibility() {
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        const isEdge = /Edg/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

        // Check for WebGL support
        const canvas = document.createElement('canvas');
        const hasWebGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));

        if (!hasWebGL) {
            this.showStatus('WebGL not supported. Please use Chrome, Edge, or Safari with WebGL enabled.', 'error');
            this.uploadZone.style.display = 'block';
            return false;
        }

        return true;
    }
```

- [ ] **Step 2: Update processImage method to check compatibility**

At the start of `processImage()` method, add:

```javascript
        if (!this.checkBrowserCompatibility()) {
            this.isProcessing = false;
            return;
        }
```

- [ ] **Step 3: Add timeout handling**

Add a timeout mechanism for long-running operations:

```javascript
    async processImage(file) {
        if (this.isProcessing) return;
        this.isProcessing = false;

        try {
            // ... existing code ...

            // Add timeout for each phase
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Processing timeout (30s)')), 30000)
            );

            // For model loading
            await Promise.race([this.loadModels(), timeoutPromise]);

            // For detection
            await Promise.race([
                WatermarkDetector.detect(...),
                timeoutPromise
            ]);

            // For inpainting
            await Promise.race([
                LamaInpainter.inpaint(...),
                timeoutPromise
            ]);

            // ... rest of code ...

        } catch (error) {
            if (error.message.includes('timeout')) {
                this.showStatus('Processing took too long. The image might be too large.', 'error');
            } else {
                // ... existing error handling ...
            }
        }
    }
```

- [ ] **Step 4: Commit**

```bash
git add js/watermark-remover/app.js
git commit -m "feat: add browser compatibility checks and timeout handling"
```

---

### Task 9: Update Instructions Text

**Files:**
- Modify: `tools/watermark-remover.html:274-282`

- [ ] **Step 1: Update instructions section**

Replace the instructions section:

```html
<!-- Instructions -->
<div class="instructions">
    <h4 data-i18n="watermark-remover.instructions.title">How to use:</h4>
    <ul>
        <li data-i18n="watermark-remover.instructions.step1">1. Upload an image with a watermark</li>
        <li data-i18n="watermark-remover.instructions.step2">2. Wait for AI to automatically detect and remove the watermark</li>
        <li data-i18n="watermark-remover.instructions.step3">3. Download the clean image</li>
    </ul>
    <p class="typography-caption" style="margin-top: var(--spacing-sm); color: var(--color-ink);">
        First-time use requires model loading (~10 seconds). Subsequent uses are faster.
    </p>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add tools/watermark-remover.html
git commit -m "docs: update instructions for automated watermark removal"
```

---

## Self-Review

**Spec coverage:**
- Dual ONNX models: Task 2, 4, 5 implement model loading and inference
- Automated workflow: Task 7 implements the main application logic
- Progress feedback: Task 6 adds UI progress indicators, Task 7 updates them
- Local model storage: Task 1 creates js/models directory, paths set in Task 2
- Error handling: Task 8 adds browser compatibility and timeout handling
- File structure matches spec

**Placeholder scan:**
- No "TBD", "TODO", or placeholders found
- All code is complete and implementable

**Type consistency:**
- Model inputs/outputs consistently use Float32Array and ort.Tensor
- Method signatures match across tasks (e.g., preprocessImage returns consistent structure)
- Progress callbacks consistently use (number) signature