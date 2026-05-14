#!/bin/bash
# 快速下载 ONNX 模型的脚本

set -e

echo "🚀 快速下载 ONNX 模型"
echo "========================"

# 创建模型目录
mkdir -p js/models

# 返回到项目根目录
cd /Users/liangwf/PycharmProjects/woshiliangwenfeng.github.io/js/models

echo ""
echo "📥 下载 LaMa 修复模型..."

# 方案 1: 从 Hugging Face 下载
# 注意: 需要先查看可用的模型版本
echo "💡 方案 1: 从 Hugging Face 下载"
echo "   访问: https://huggingface.co/models?search=lama+inpainting+onnx"
echo "   下载后重命名为: lama-inpainter.onnx"
echo ""

# 方案 2: 从 GitHub Releases 下载
echo "💡 方案 2: 从 GitHub 下载 lama-cleaner 的 ONNX 模型"
echo "   访问: https://github.com/Sanster/lama-cleaner/releases"
echo "   查找包含 ONNX 模型的版本"
echo ""

# 方案 3: 使用 wget 下载（如果有直接链接）
echo "💡 方案 3: 使用预构建的模型"
echo "   这些是从开源项目收集的预转换模型链接:"
echo ""
echo "   # LaMa 修复模型（小型版本用于测试）"
echo "   wget https://huggingface.co/runwayml/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.safetensors"
echo "   # 注意: 这不是 ONNX 格式，需要转换"
echo ""

# 实际可行的方案
echo "🎯 实际可行的方案:"
echo ""
echo "由于 ONNX 模型转换过程复杂，建议使用以下方法:"
echo ""
echo "1. 使用 lama-cleaner 项目 (推荐)"
echo "   git clone https://github.com/Sanster/lama-cleaner.git"
echo "   cd lama-cleaner"
echo "   # 运行服务器时会自动下载模型"
echo "   python main.py"
echo ""
echo "2. 使用 WebUI 工具下载"
echo "   访问: https://huggingface.co/spaces/Sanster/lama-cleaner"
echo "   查看模型路径后复制到项目"
echo ""
echo "3. 从 ModelScope 下载"
echo "   访问: https://modelscope.cn/models"
echo "   搜索: lama inpainting"
echo ""

echo "📝 临时方案: 创建占位符模型"
echo ""
echo "如果暂时没有模型，可以创建占位符文件用于测试 UI:"

# 创建占位符文件（仅用于测试 UI）
dd if=/dev/zero of=watermark-detector.onnx bs=1M count=1 2>/dev/null || echo "" > watermark-detector.onnx
dd if=/dev/zero of=lama-inpainter.onnx bs=1M count=1 2>/dev/null || echo "" > lama-inpainter.onnx

echo "✅ 已创建占位符模型文件 (仅用于 UI 测试)"
echo "⚠️  注意: 这些不是真实的模型，无法实际执行水印去除"
echo ""
echo "要使用真实功能，请下载实际的 ONNX 模型并替换这些文件"

cd -