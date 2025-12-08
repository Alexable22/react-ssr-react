import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';
import postRoutes from './routes/postRoutes.js'; // 导入博客相关路由
import aiRoutes from './routes/aiRoutes.js'; // 导入ai路由

// 读取 .env 配置
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件配置
app.use(cors()); // 允许跨域
app.use(express.json()); // 解析 JSON 请求体

// 挂载文章相关路由，统一前缀为 /api/posts
app.use('/api/posts', postRoutes);

// 挂载ai路由，统一前缀为 /api/ai
app.use('/api/ai', aiRoutes);

// 监听端口（必须匹配前端请求的端口 5000）
app.listen(PORT, () => {
  console.log(`后端服务启动，监听端口 ${PORT} → http://localhost:${PORT}`);
});

// 测试数据库连接并启动服务
const startServer = async () => {
    try {
        await db.query('SELECT 1');
        console.log('✅ 数据库连接池已就绪');

        app.listen(PORT, () => {
            console.log(`🚀 后端服务已启动: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ 数据库连接失败:', error.message);
    }
};



startServer();