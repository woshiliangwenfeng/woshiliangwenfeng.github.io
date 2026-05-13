/**
 * ModelLoader - Handles loading and caching of ONNX models
 */
class ModelLoader {
    constructor() {
        this.detectorModel = null;
        this.inpainterModel = null;
        this.isLoaded = false;
        this.isLoading = false;
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

        // Prevent concurrent loading
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;

        // Callback validation
        if (typeof onProgress !== 'function') {
            console.warn('onProgress is not a function, progress reporting disabled');
            onProgress = () => {};
        }

        try {
            onProgress(10);

            // Timeout handling
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Model loading timeout (30s)')), 30000)
            );

            // Load detector model
            this.detectorModel = await Promise.race([
                ort.InferenceSession.create(
                    '/js/models/watermark-detector.onnx',
                    { executionProviders: ['webgl', 'wasm'] }
                ),
                timeout
            ]);
            onProgress(50);

            // Load inpainter model
            this.inpainterModel = await Promise.race([
                ort.InferenceSession.create(
                    '/js/models/lama-inpainter.onnx',
                    { executionProviders: ['webgl', 'wasm'] }
                ),
                timeout
            ]);
            onProgress(100);

            this.isLoaded = true;
        } catch (error) {
            this.isLoaded = false;
            throw new Error(`Failed to load models: ${error.message}`);
        } finally {
            this.isLoading = false;
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