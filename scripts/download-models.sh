#!/bin/bash
# 下载 ONNX 模型脚本

echo "📥 开始下载 ONNX 模型..."

# 创建 models 目录
mkdir -p js/models

# 检查模型是否已存在
if [ -f "js/models/watermark-detector.onnx" ] && [ -f "js/models/lama-inpainter.onnx" ]; then
    echo "✅ 模型文件已存在"
    exit 0
fi

echo "⚠️  需要手动下载以下模型文件："
echo ""
echo "1. 水印检测模型 (watermark-detector.onnx):"
echo "   - 从 Hugging Face 转换 SAM 模型"
echo "   - 或从开源项目下载"
echo ""
echo "2. LaMa 修复模型 (lama-inpainter.onnx):"
echo "   - 从 lama-cleaner 项目下载"
echo "   - GitHub: https://github.com/Sanster/lama-cleaner"
echo ""
echo "📚 获取模型的详细步骤："
echo ""
echo "=== 方法一：使用 Python 转换 ==="
echo ""
echo "# 1. 安装依赖"
echo "pip install torch torchvision onnx onnxruntime transformers"
echo ""
echo "# 2. 下载并转换 LaMa 模型"
echo "python scripts/download_models.py"
echo ""
echo "=== 方法二：直接下载预转换的模型 ==="
echo ""
echo "# 查找以下资源："
echo "- Hugging Face: 搜索 'lama-inpainting onnx'"
echo "- ModelScope: 搜索 'lama onnx'"
echo "- GitHub Releases: lama-cleaner 项目"
echo ""
echo "📂 下载后将文件放到 js/models/ 目录即可"