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
     * @returns {string} - Data URL of output image
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
