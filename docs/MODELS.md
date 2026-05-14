# 获取 ONNX 模型指南

## 当前状态

✅ 占位符模型文件已创建（仅用于 UI 测试）
⚠️ 需要替换为真实的 ONNX 模型才能执行水印去除功能

## 占位符文件

- `js/models/watermark-detector.onnx` (1MB) - 占位符
- `js/models/lama-inpainter.onnx` (1MB) - 占位符

---

## 获取真实 ONNX 模型的方法

### 方法一：使用 lama-cleaner 项目（推荐）

#### 下载 LaMa 修复模型

```bash
# 1. 克隆项目
git clone https://github.com/Sanster/lama-cleaner.git
cd lama-cleaner

# 2. 安装依赖
pip install -r requirements.txt

# 3. 运行服务器（会自动下载模型）
python main.py --host 127.0.0.1 --port 8080

# 4. 找到下载的模型文件
ls models/
```

#### 转换为 ONNX

lama-cleaner 项目已经提供了 ONNX 导出功能：

```bash
# 使用项目内置的导出脚本
python lama/models/lama_cleaner/bin/export_to_onnx.py \n  --model-path models/lama_cleaner.pth \n  --output js/models/lama-inpainter.onnx
```

---

### 方法二：从 Hugging Face 下载

#### 预转换的 LaMa 模型

访问 Hugging Face 搜索：
- https://huggingface.co/models?search=lama+inpainting+onnx
- https://huggingface.co/models?search=inpainting+onnx

推荐模型：
- `stabilityai/stable-diffusion-2-inpainting` (需要转换)
- `microsoft/sam-vit-base` (用于检测，需要转换)

#### 使用 Python 下载并转换

```bash
pip install torch torchvision onnx onnxruntime transformers

# 下载 SAM 模型并转换为 ONNX
python <<'EOF'
import torch
from transformers import SamModel, SamProcessor

# 下载 SAM 模型
model = SamModel.from_pretrained("facebook/sam-vit-base")
processor = SamProcessor.from_pretrained("facebook/sam-vit-base")

# 创建虚拟输入并导出为 ONNX
dummy_input = torch.randn(1, 3, 512, 512)
torch.onnx.export(
    model,
    dummy_input,
    "js/models/watermark-detector.onnx",
    input_names=["input"],
    output_names=["output"],
    dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}},
    opset_version=14
)
print("✅ watermark-detector.onnx 转换完成")
EOF
```

---

### 方法三：从 ModelScope 下载（中国用户推荐）

ModelScope 是阿里达摩院的开源模型社区：

```bash
# 安装 modelscope
pip install modelscope

# 下载模型
python <<'EOF'
from modelscope import snapshot_download

# 下载 LaMa 模型
model_dir = snapshot_download('damo/cv_depth-inpainting_lama')

# 下载语义分割模型
seg_model_dir = snapshot_download('damo/cv_vitb-seg_segformer')

print(f"LaMa 模型位置: {model_dir}")
print(f"分割模型位置: {seg_model_dir}")
EOF
```

---

### 方法四：手动下载并转换

#### 步骤 1: 下载原始模型

**LaMa 模型:**
```
GitHub: https://github.com/Sanster/lama-cleaner/releases
下载: models-lama-cleaner-v0.2.0.zip
```

**分割模型:**
```
Hugging Face: https://huggingface.co/facebook/sam-vit-base
GitHub: https://github.com/facebookresearch/segment-anything
```

#### 步骤 2: 转换为 ONNX

创建转换脚本 `scripts/convert_to_onnx.py`:

```python
import torch
import onnx

# 导出为 ONNX
def export_to_onnx(model, output_path, input_shape=(1, 3, 512, 512)):
    model.eval()
    dummy_input = torch.randn(input_shape)

    torch.onnx.export(
        model,
        dummy_input,
        output_path,
        input_names=["input"],
        output_names=["output"],
        dynamic_axes={
            "input": {0: "batch_size", 2: "height", 3: "width"},
            "output": {0: "batch_size", 2: "height", 3: "width"}
        },
        opset_version=14,
        do_constant_folding=True
    )

    # 验证 ONNX 文件
    onnx_model = onnx.load(output_path)
    onnx.checker.check_model(onnx_model)

    print(f"✅ 已导出到: {output_path}")
```

---

## 替换占位符文件

获取真实模型后：

```bash
# 1. 备份占位符文件
mv js/models/watermark-detector.onnx js/models/watermark-detector.onnx.backup
mv js/models/lama-inpainter.onnx js/models/lama-inpainter.onnx.backup

# 2. 复制真实模型
cp /path/to/real/watermark-detector.onnx js/models/
cp /path/to/real/lama-inpainter.onnx js/models/

# 3. 验证文件
ls -lh js/models/

# 4. 提交到 Git
git add js/models/
git commit -m "feat: add real ONNX models"
```

---

## 模型文件大小参考

| 模型 | 预期大小 | 说明 |
|------|----------|------|
| watermark-detector.onnx | ~50-200MB | U-Net 或 SAM 模型 |
| lama-inpainter.onnx | ~100-300MB | LaMa 修复模型 |

如果文件小于 50MB，可能是占位符或压缩版本。

---

## 测试模型

获取真实模型后，测试功能：

```bash
# 启动本地服务器
python -m http.server 8000

# 访问 http://localhost:8000/tools/watermark-remover.html
# 上传图片测试水印去除功能
```

---

## 故障排除

### 问题: 模型加载失败

**症状**: "Failed to load models"

**解决方案**:
1. 检查文件是否存在: `ls js/models/`
2. 检查文件大小: 应该大于 50MB
3. 检查浏览器控制台错误信息
4. 验证 WebGL 支持

### 问题: 推理速度慢

**原因**: 模型太大或浏览器性能不足

**解决方案**:
1. 使用量化的模型
2. 限制图片大小（添加图像预处理）
3. 使用 Chrome 或 Edge 浏览器

### 问题: 内存不足

**原因**: 大模型占用过多内存

**解决方案**:
1. 使用较小的模型
2. 添加图片尺寸限制
3. 分批处理

---

## 资源链接

- **Hugging Face**: https://huggingface.co/
- **ModelScope**: https://modelscope.cn/
- **lama-cleaner**: https://github.com/Sanster/lama-cleaner
- **Segment Anything**: https://github.com/facebookresearch/segment-anything
- **ONNX Runtime**: https://onnxruntime.ai/

---

## 社区支持

如果遇到问题：
1. 查看 GitHub Issues
2. 搜索 Stack Overflow
3. 在相关项目社区提问