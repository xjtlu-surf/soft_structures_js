# MQTT Patient Topic 订阅功能

## 功能概述

本项目已集成MQTT客户端，可以订阅 `patient` 主题并处理JSON格式的消息。

## 连接配置

- **MQTT Broker**: `ws://8.133.250.249:8083/mqtt`
- **用户名**: `surf_user1`
- **密码**: `dojxop-5Domzu-farreb`
- **订阅主题**: `patient`

## 功能特性

### 1. 自动订阅
- 应用启动时自动连接到MQTT服务器
- 自动订阅 `patient` 主题
- 实时接收和处理JSON消息

### 2. 消息处理
- 自动解析JSON格式的消息
- 根据消息类型进行分类处理
- 支持的消息类型：
  - `status_update`: 状态更新
  - `alert`: 警报消息
  - `data`: 数据消息
  - `command`: 命令消息

### 3. 测试界面
- 访问 `/mqtt-test` 路由可以打开MQTT测试界面
- 可以发送测试消息到 `patient` 主题
- 实时显示接收到的消息

## 使用方法

### 1. 启动应用
```bash
npm run dev
```

### 2. 访问测试界面
在浏览器中访问：`http://localhost:5173/mqtt-test`

### 3. 发送测试消息
1. 选择消息类型
2. 输入消息内容
3. 点击"Send Message"按钮

### 4. 查看接收消息
- 测试界面会实时显示接收到的消息
- 控制台也会输出详细的日志信息

## 消息格式示例

### 发送消息格式
```json
{
  "type": "status_update",
  "data": "Patient is feeling better",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "sender": "test-client"
}
```

### 接收消息处理
应用会自动解析接收到的JSON消息，并根据 `type` 字段进行分类处理。

## 代码位置

- **主应用MQTT**: `src/App.tsx` 中的 `App` 组件
- **绘画界面MQTT**: `src/App.tsx` 中的 `PatientStart` 组件
- **测试界面**: `src/MqttTest.tsx`

## 注意事项

1. 确保MQTT服务器地址和凭据正确
2. 网络连接正常
3. 消息必须是有效的JSON格式
4. 建议在生产环境中使用更安全的连接方式

## 故障排除

### 连接失败
- 检查网络连接
- 验证服务器地址和端口
- 确认用户名和密码正确

### 消息接收失败
- 检查消息格式是否为有效JSON
- 查看浏览器控制台的错误信息
- 确认主题名称正确

### 测试界面无法访问
- 确认应用已启动
- 检查路由配置
- 查看控制台错误信息
