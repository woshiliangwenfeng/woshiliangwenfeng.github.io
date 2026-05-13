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
