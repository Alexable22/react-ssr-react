import Link from 'next/link';
import { Button, Tag, Divider } from 'antd';
import { ArrowLeftOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import PostActions from './PostActions';

// 服务端运行的获取单篇文章数据
async function getPost(id) {
  // cache: 'no-store' 禁用缓存，每次页面刷新 / 访问都会重新请求后端接口
  const res = await fetch(`http://localhost:5000/api/posts/${id}`, { cache: 'no-store' });
  
  if (!res.ok) {
    return null;
  }
  
  return res.json();
}

// 动态路由页面组件
// Next.js 会自动把 URL 里的 id 传给 params
export default async function PostDetailPage({ params }) {
  // 注意：在 Next.js 15 中 params 是 Promise，需要 await params
  // 如果你是 Next.js 14 及以下，直接用 const { id } = params;
  const { id } = await params; 

  const result = await getPost(id);

  if (!result || !result.success) {
    return <div style={{ textAlign: 'center', marginTop: 100 }}>文章不存在或已被删除</div>;
  }

  const post = result.data;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      {/* 返回按钮 */}
      <Link href="/">
        <Button type="text" icon={<ArrowLeftOutlined />} style={{ marginBottom: 20 }}>
          返回列表
        </Button>
        {/* 插入操作按钮组件，把id传进去 */}
        <PostActions postId={post.id}/>
      </Link>

      {/* 文章头部 */}
      <article>
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '15px' }}>
            {post.title}
          </h1>
          
          <div style={{ color: '#888', display: 'flex', gap: '20px', fontSize: '0.9rem' }}>
            <span><ClockCircleOutlined /> {new Date(post.created_at).toLocaleString()}</span>
            <span><EyeOutlined /> {post.view_count} 阅读</span>
            <Tag color="blue">{post.status === 1 ? '正式发布' : '草稿'}</Tag>
          </div>
        </header>

        {/* 分割线 */}
        <Divider />

        {/* 文章正文 */}
        {/* dangerouslySetInnerHTML 用于渲染 HTML 内容，如果是 Markdown 需要转换 */}
        <div 
          style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333' }}
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} 
        />
        
        {/* 简单的换行处理，实际项目中推荐用 react-markdown */}
      </article>
    </div>
  );
}