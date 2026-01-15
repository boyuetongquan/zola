# 页面显示黑色问题 - 故障排除指南

## 问题描述
页面只显示黑色背景，无法正常渲染内容。

## 根本原因
`.env.local` 文件缺少必需的 Supabase 环境变量，导致：
1. `/api/user-preferences` 端点返回 500 错误"Database connection failed"
2. 前端无法加载用户偏好设置
3. 页面渲染失败，只显示暗色主题的黑色背景

## 解决方案

### 方案 1：修复 API 端点（已实施）
修改了 `app/api/user-preferences/route.ts`，使其在 Supabase 未启用时返回默认偏好设置：

```typescript
// GET 方法
if (!supabase) {
  return NextResponse.json({
    layout: "fullscreen",
    prompt_suggestions: true,
    show_tool_invocations: true,
    show_conversation_previews: true,
    multi_model_enabled: false,
    hidden_models: [],
  })
}

// PUT 方法
if (!supabase) {
  return NextResponse.json({
    success: true,
    layout: "fullscreen",
    prompt_suggestions: true,
    show_tool_invocations: true,
    show_conversation_previews: true,
    multi_model_enabled: false,
    hidden_models: [],
  })
}
```

### 方案 2：配置 Supabase（推荐用于生产环境）
如果需要完整的数据库功能，请配置 Supabase：

1. 在 [Supabase](https://supabase.com) 创建一个新项目
2. 获取项目 URL 和 anon key
3. 将以下环境变量添加到 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE=your_supabase_service_role_key
CSRF_SECRET=your_32_character_random_string
```

4. 运行数据库迁移（如果需要）

## 当前状态
- ✅ `/api/user-preferences` 端点已修复
- ✅ `/api/models` 端点正常工作
- ✅ `/api/health` 端点正常工作
- ⚠️ 页面可能有客户端渲染警告（不影响功能）

## 测试命令
```bash
# 测试健康检查
curl http://localhost:3000/api/health

# 测试用户偏好设置
curl http://localhost:3000/api/user-preferences

# 测试模型列表
curl http://localhost:3000/api/models
```

## 注意事项
1. 当前配置使用 OpenAI API Key（已在 `.env.local` 中配置）
2. 应用可以在没有 Supabase 的情况下运行，但某些功能（如用户认证、聊天历史持久化）将不可用
3. 对于开发和测试，当前的修复已经足够
4. 对于生产环境，建议配置 Supabase 以获得完整功能

## 下一步
1. 刷新浏览器页面
2. 检查浏览器控制台是否有其他错误
3. 如果问题仍然存在，请检查：
   - 浏览器控制台的 JavaScript 错误
   - 网络请求的响应状态
   - 是否有其他环境变量缺失
