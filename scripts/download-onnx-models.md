# 手动下载 ONNX 模型指南

## 方法一：从 Hugging Face 下载（最简单）

### 1. 访问 Hugging Face 模型库

打开浏览器访问：https://huggingface.co/models

### 2. 搜索预转换的模型

搜索以下关键词：
- `lama onnx`
- `inpainting onnx`
- `semantic segmentation onnx`

### 3. 下载推荐模型

#### LaMa 修复模型
- 访问：https://huggingface.co/models?search=lama+inpainting+onnx
- 下载任何标注为 ONNX 格式的 LaMa 模型
- 重命名为：`lama-inpainter.onnx`

#### 水印检测模型
- 访问：https://huggingface.co/models?search=segmentation+onnx
- 下载语义分割模型（用于检测水印）
- 重命名为：`watermark-detector.onnx`

### 4. 放置文件

```bash
# 复制下载的模型文件
cp /path/to/downloaded/lama-inpainter.onnx js/models/lama-inpainter.onnx
cp /path/to/downloaded/segmentation.onnx js/models/watermark-detector.onnx
```

---

## 方法二：使用命令行下载（推荐）

### 安装 huggingface-hub

```bash
# 如果可以安装 pip
pip3 install huggingface-hub --break-system-packages
```

### 使用 Python 下载

```python
from huggingface_hub import hf_hub_download

# 下载模型
model_path = hf_hub_download(
    repo_id="username/model-name",
    filename="model.onnx",
    repo_type="model"
)

print(f"模型已下载到: {model_path}")
```

---

## 方法三：使用 ModelScope（中国用户推荐）

### 安装 ModelScope

```bash
pip3 install modelscope --break-system-packages
```

### 下载模型

```python
from modelscope import snapshot_download

# 下载 LaMa 模型
model_dir = snapshot_download(
    'damo/cv_depth-inpainting_lama',
    cache_dir='./models'
)

print(f"模型位置: {model_dir}")
```

---

## 方法四：使用开源转换工具

### 使用 lama-cleaner

```bash
# 克隆项目
git clone https://github.com/Sanster/lama-cleaner.git
cd lama-cleaner

# 按照项目 README 的说明安装依赖
pip install -r requirements.txt

# 运行时会自动下载模型
python main.py

# 模型下载后，可以在 models/ 目录找到
# 然后使用项目自带的转换脚本导出为 ONNX
```

---

## 当前状态

✅ 占位符模型已创建（1MB）
⚠️ 需要替换为真实模型（50-300MB）

### 占位符文件位置

```bash
js/models/watermark-detector.onnx  # 1MB 占位符
js/models/lama-inpainter.onnx      # 1MB 占位符
```

### 替换步骤

1. 下载真实的 ONNX 模型
2. 备份占位符文件：
   ```bash
   mv js/models/watermark-detector.onnx js/models/watermark-detector.onnx.backup
   mv js/models/lama-inpainter.onnx js/models/lama-inpainter.onnx.backup
   ```

3. 复制真实模型：
   ```bash
   cp /path/to/real/detector.onnx js/models/watermark-detector.onnx
   cp /path/to/real/inpainter.onnx js/models/lama-inpainter.onnx
   ```

4. 验证文件：
   ```bash
   ls -lh js/models/
   ```

5. 提交到 Git：
   ```bash
   git add js/models/
   git commit -m "feat: add real ONNX models"
   ```

---

## 推荐的预转换模型资源

### Hugging Face

- [Llama-Cleaner Models](https://huggingface.co/models?search=lama-cleaner)
- [ONNX Runtime Models](https://huggingface.co/models?search=onnx)
- [Inpainting Models](https://huggingface.co/models?search=inpainting+onnx)

### ModelScope

- [LaMa Inpainting](https://modelscope.cn/models?page=1&tasks=image-inpainting)
- [Semantic Segmentation](https://modelscope.cn/models?page=1&tasks=semantic-segmentation)

### GitHub

- [lama-cleaner](https://github.com/Sanster/lama-cleaner)
- [SAM (Segment Anything)](https://github.com/facebookresearch/segment-anything)

---

## 验证模型

下载后，验证模型文件：

```bash
# 检查文件大小（应该 > 50MB）
ls -lh js/models/*.onnx

# 检查是否为 ONNX 格式
file js/models/*.onnx
```

---

## 测试

使用真实模型测试功能：

```bash
# 启动本地服务器
python3 -m http.server 8000

# 访问 http://localhost:8000/tools/watermark-remover.html
# 上传图片测试
```

---

## 故障排除

### 问题：模型加载失败

**原因**：模型文件损坏或格式不正确

**解决方案**：
1. 重新下载模型
2. 验证文件完整性
3. 检查浏览器控制台错误

### 问题：推理速度慢

**原因**：模型太大或浏览器性能不足

**解决方案**：
1. 使用量化的模型（INT8）
2. 限制图片大小
3. 使用高性能浏览器

### 问题：内存不足

**原因**：大模型占用过多内存

**解决方案**：
1. 使用较小的模型
2. 添加图片尺寸限制
3. 分批处理

---

## 联系支持

如果遇到问题：
1. 查看 GitHub Issues
2. 在 Hugging Face 社区提问
3. 联系模型发布者