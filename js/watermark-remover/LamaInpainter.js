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
