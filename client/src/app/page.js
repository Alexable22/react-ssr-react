import Link from 'next/link';
import { Button, Card, Tag, Divider } from 'antd';
import { ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';

// 在服务端运行的异步函数，负责从后端获取文章列表数据
async function getData() {
  // cache: 'no-store' 禁用缓存，每次页面刷新 / 访问都会重新请求后端接口
  const res = await fetch('http://localhost:5000/api/posts', { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}


export default async function Home() {
  // 在服务端等待数据返回
  //把 data 字段重命名为 posts（假设后端返回格式是 { data: [文章1, 文章2...] }）
  const { data: posts } = await getData();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* 顶部导航区 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>📚 我的 SSR 博客</h1>
        <Link href="/posts/create">
          <Button type="primary" size="large">写文章</Button>
        </Link>
      </div>

      {/* 文章列表区 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', padding: '50px' }}>
            暂无文章，快去发布第一篇吧！
          </div>
        ) : (
          posts.map((post) => (
            <Card 
              key={post.id} 
              hoverable 
              style={{ width: '100%' }}
              title={<Link href={`/posts/${post.id}`} style={{ color: 'inherit', fontSize: '1.2rem' }}>{post.title}</Link>}
              extra={<Tag color={post.status === 1 ? 'green' : 'orange'}>{post.status === 1 ? '已发布' : '草稿'}</Tag>}
            >
              <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.6' }}>
                {post.summary || post.content.substring(0, 100) + '...'}
              </p>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#999', fontSize: '0.9rem' }}>
                <span><ClockCircleOutlined /> {new Date(post.created_at).toLocaleString()}</span>
                <span><EyeOutlined /> {post.view_count} 阅读</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}