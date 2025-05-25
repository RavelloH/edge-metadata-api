# Edge Metadata API

一个基于 Vercel Edge Runtime 的网页元数据提取 API，可以快速获取任何网页的标题、描述、图标等信息。

## 项目演示

🌐 **在线演示**: [https://metadata.api.ravelloh.top/github.com](https://metadata.api.ravelloh.top/github.com)

## 功能特点

- ⚡ 基于 Vercel Edge Runtime，全球加速
- 🔍 自动提取网页标题、描述和图标
- 🛡️ 自动检测 Content-Type，避免非 HTML 内容
- 🌍 支持 UTF-8 编码
- 🚀 支持 CORS 跨域访问

## 一键部署
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRavelloH%2Fedge-metadata-api)

## API 使用方法

### 1. 标准 API 调用

```
GET /api/metadata?url=<目标网址>

简化路径调用:
GET /<目标网址>
```

**示例:**
```
https://metadata.api.ravelloh.top/api/metadata?url=https://github.com

简化路径调用:
https://metadata.api.ravelloh.top/github.com
```

### 2. 简化路径调用

根据 `vercel.json` 配置，支持以下简化路径：

#### HTTP/HTTPS 直接访问
```
https://metadata.api.ravelloh.top/https://github.com
https://metadata.api.ravelloh.top/http://example.com
```

#### 省略协议访问
```
https://metadata.api.ravelloh.top/github.com
https://metadata.api.ravelloh.top/example.com/
```

## 返回格式

### 成功响应

```json
{
  "url": "http://github.com",
  "title": "GitHub · Build and ship software on a single, collaborative platform · GitHub",
  "description": "GitHub is where people build software. More than 150 million people use GitHub to discover, fork, and contribute to over 420 million projects.",
  "icon": "https://github.githubassets.com/favicons/favicon"
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `url` | string | 请求的原始 URL |
| `title` | string | 网页标题 |
| `description` | string | 网页描述（meta description 或 og:description） |
| `icon` | string | 网站图标的完整 URL |

### 错误响应

#### 缺少 URL 参数
```json
{
  "error": "Missing URL parameter"
}
```

#### 非 HTML 内容
```json
{
  "error": "URL does not point to an HTML document",
  "contentType": "application/pdf"
}
```

#### 请求失败
```json
{
  "error": "Failed to fetch or parse the webpage",
  "detail": "Error details..."
}
```

## 使用示例

### JavaScript (Fetch API)

```javascript
async function getMetadata(url) {
  const apiUrl = `https://metadata.api.ravelloh.top/${encodeURIComponent(url)}`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (response.ok) {
      console.log('标题:', data.title);
      console.log('描述:', data.description);
      console.log('图标:', data.icon);
    } else {
      console.error('错误:', data.error);
    }
  } catch (error) {
    console.error('请求失败:', error);
  }
}

// 使用示例
getMetadata('https://github.com');
```

### Python (requests)

```python
import requests

def get_metadata(url):
    api_url = f"https://metadata.api.ravelloh.top/{url}"
    
    try:
        response = requests.get(api_url)
        data = response.json()
        
        if response.status_code == 200:
            print(f"标题: {data['title']}")
            print(f"描述: {data['description']}")
            print(f"图标: {data['icon']}")
        else:
            print(f"错误: {data['error']}")
    except Exception as e:
        print(f"请求失败: {e}")

# 使用示例
get_metadata("https://github.com")
```

### cURL

```bash
# 标准调用
curl "https://metadata.api.ravelloh.top/api/metadata?url=https://github.com"

# 简化路径调用
curl "https://metadata.api.ravelloh.top/github.com"
```

## 部署说明

本项目部署在 Vercel 平台，使用 Edge Runtime 确保全球访问速度。

### 本地开发

1. 克隆项目
```bash
git clone <repository-url>
cd edge-metadata-api
```

2. 安装依赖
```bash
npm install
```

3. 本地运行
```bash
vercel dev
```

### 部署到 Vercel

1. 连接 Vercel
```bash
vercel
```

2. 部署
```bash
vercel --prod
```

## 技术栈

- **Runtime**: Vercel Edge Runtime
- **Language**: JavaScript
- **Platform**: Vercel
- **Features**: 正则表达式解析、CORS 支持

## 限制说明

- 仅支持公开访问的网页
- 受目标网站的访问限制影响
- Edge Runtime 执行时间限制

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
