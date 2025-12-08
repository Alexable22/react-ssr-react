import db from '../db.js';
import redisClient from '../redisClient.js';

// 获取文章列表
export const getPosts = async (req, res) => {
    try {
        //按创建时间倒序查询
        const [rows] = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
};

// 新增文章
export const createPost = async (req, res) => {
    const { title, summary = '', content } = req.body;

    // 2参数校验（更严谨，且返回前端能识别的错误信息）
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '标题不能为空', // 细化提示，前端能直接展示
        data: null
      });
    }
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '文章内容不能为空',
        data: null
      });
    }

    try {
        const sql = 'INSERT INTO posts (title, summary, content, status) VALUES (?, ?, ?, 1)';
        const [result] = await db.query(sql, [title, summary, content]);
        
        res.status(201).json({ 
            success: true, 
            message: '发布成功', 
            data: { id: result.insertId } 
        });
        console.log("文章发布成功");
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '发布失败' });
    }
};

// 根据 ID 获取文章详情
export const getPostById = async (req, res) => {
    const { id } = req.params; // 从 URL 中获取 ID
    const cacheKey = `post:${id}`;//redis中的键
   try {
        // 查 Redis 缓存
        const cachedData = await redisClient.get(cacheKey);
        
        if (cachedData) {
            console.log(`⚡️ 命中缓存: ${cacheKey}`);
            // 注意：缓存里存的是字符串，取出时要 JSON.parse
            return res.json({ success: true, data: JSON.parse(cachedData) });
        }

        // 缓存没有，查数据库
        console.log(`🐢 未命中缓存，查询数据库: ${id}`);
        const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: '文章不存在' });
        }

        const post = rows[0];

        // 写入 Redis 缓存有效期 1小时
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(post));

        // 增加阅读量 (写入数据库)
        await db.query('UPDATE posts SET view_count = view_count + 1 WHERE id = ?', [id]);

        res.json({ success: true, data: post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
};

// 1修改文章
export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, summary, content, status } = req.body;

    try {
        // 更新 MySQL
        const [result] = await db.query(
            'UPDATE posts SET title = ?, summary = ?, content = ?, status = ? WHERE id = ?',
            [title, summary, content, status || 1, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: '文章不存在' });
        }

        // 清除 Redis 缓存
        const cacheKey = `post:${id}`;
        await redisClient.del(cacheKey);
        console.log(`🧹 已清除缓存: ${cacheKey}`);

        res.json({ success: true, message: '更新成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '更新失败' });
    }
};

// 删除文章
export const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM posts WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: '文章不存在' });
        }

        // 清除缓存
        const cacheKey = `post:${id}`;
        await redisClient.del(cacheKey);
        console.log(`🗑️ 已删除文章并清除缓存: ${cacheKey}`);

        res.json({ success: true, message: '删除成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '删除失败' });
    }
};