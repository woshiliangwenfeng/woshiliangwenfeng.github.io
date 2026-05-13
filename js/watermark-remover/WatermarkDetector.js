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