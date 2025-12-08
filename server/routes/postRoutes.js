import express from 'express';
import { getPosts, createPost, getPostById, updatePost, deletePost } from '../controllers/postController.js';

const router = express.Router();

// 定义路径对应的处理函数
router.get('/', getPosts);    // GET /api/posts
router.post('/', createPost); // POST /api/posts
router.get('/:id', getPostById);  // POST /api/posts/:id
router.put('/:id', updatePost);    // PUT /api/posts/:id
router.delete('/:id', deletePost); // DELETE /api/posts/:id
export default router;