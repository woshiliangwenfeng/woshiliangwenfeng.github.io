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