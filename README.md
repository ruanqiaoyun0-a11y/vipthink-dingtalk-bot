# VIPthink台湾市场课程顾问培训系统

一个专为VIPthink台湾市场课程顾问打造的在线学习平台，通过闯关练习的形式帮助学员学习销售话术知识点，并进行考核评估。

## 功能特性

### 学习模块
- DAY1-DAY4知识点学习
- 闯关练习模式
- 考核测试系统
- 学习进度追踪

### 用户模块
- 账号密码登录
- 学习记录管理
- 成绩统计

### 钉钉集成
- 机器人消息推送
- 每日21:30学习播报（仅管理群）

### 管理后台
- 学员管理
- 知识点管理
- 题目管理
- 数据统计

## 技术栈

### 前端
- React 18 + TypeScript
- TailwindCSS 3
- React Router 6
- Axios

### 后端
- Node.js + Express
- MongoDB + Mongoose
- JWT认证
- node-schedule（定时任务）

## 快速开始

### 环境要求
- Node.js >= 18.x
- MongoDB >= 6.0

### 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
# 数据库配置
MONGODB_URI=mongodb://localhost:27017/vipthink

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# 钉钉机器人配置（可选）
DINGTALK_WEBHOOK=https://oapi.dingtalk.com/robot/send?access_token=xxx
DINGTALK_SECRET=xxx
```

### 启动开发服务器

```bash
# 启动后端服务
cd backend
npm run dev

# 启动前端服务（新终端）
cd frontend
npm run dev
```

### 使用Docker部署

```bash
# 构建并启动所有服务
docker-compose up -d

# 停止服务
docker-compose down
```

## 项目结构

```
vipthink-training/
├── frontend/                    # 前端代码
│   ├── src/
│   │   ├── components/         # 公共组件
│   │   ├── pages/              # 页面组件
│   │   ├── services/           # API服务
│   │   ├── types/              # 类型定义
│   │   ├── context/            # 上下文状态
│   │   └── App.tsx             # 主应用入口
│   ├── public/                 # 静态资源
│   └── package.json
├── backend/                    # 后端代码
│   ├── src/
│   │   ├── controllers/        # 控制器
│   │   ├── models/             # 数据模型
│   │   ├── routes/             # 路由定义
│   │   ├── services/           # 业务服务
│   │   ├── middleware/         # 中间件
│   │   ├── utils/              # 工具函数
│   │   ├── cron/               # 定时任务
│   │   └── app.ts              # 应用入口
│   └── package.json
├── .env                        # 环境变量
├── docker-compose.yml          # Docker配置
└── README.md
```

## API接口

### 用户接口
- `POST /api/users/login` - 用户登录
- `GET /api/users/me` - 获取当前用户信息
- `GET /api/users` - 获取学员列表（管理员）
- `POST /api/users` - 创建用户（管理员）

### 学习接口
- `GET /api/learning/day/:day` - 获取当天知识点
- `POST /api/learning` - 创建知识点（管理员）

### 题目接口
- `GET /api/questions/:day/:type` - 获取题目
- `POST /api/questions` - 创建题目（管理员）

### 练习接口
- `POST /api/practice` - 提交练习

### 考核接口
- `POST /api/exam` - 提交考核

### 记录接口
- `GET /api/records` - 获取学习记录
- `GET /api/records/all` - 获取所有记录（管理员）
- `GET /api/records/stats/daily` - 获取每日统计（管理员）

## 数据模型

### User（用户）
- name: 用户名
- phone: 手机号
- password: 加密密码
- role: 角色（student/admin）

### KnowledgePoint（知识点）
- day: 天数
- title: 标题
- content: 内容
- order: 排序

### Question（题目）
- day: 天数
- type: 类型（practice/exam）
- question: 题目内容
- options: 选项
- answer: 正确答案
- explanation: 解析

### LearningRecord（学习记录）
- userId: 用户ID
- day: 天数
- practiceCount: 练习次数
- examScore: 考核成绩
- completed: 是否完成

## 钉钉机器人配置

1. 打开钉钉群 → 群设置 → 智能群助手 → 添加机器人 → 自定义机器人
2. 输入机器人名称，复制Webhook地址
3. 配置安全设置：IP白名单或自定义关键词
4. 将Webhook和Secret配置到.env文件

## 注意事项

- 首次使用需要创建管理员账号
- 管理员可以添加学员、知识点和题目
- 每日21:30自动向管理群发送学习播报
- 考核成绩60分及格

## License

MIT
