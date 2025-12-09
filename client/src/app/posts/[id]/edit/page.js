'use client'; // 必须标记为客户端组件

import React, { useEffect, useState, use } from 'react';
import { Form, Input, Button, message, Card, Spin } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const { TextArea } = Input;

// 动态路由页面
export default function EditPostPage({ params }) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // 初始加载数据的状态
  const router = useRouter();
  const [form] = Form.useForm();
  const [postId, setPostId] = useState(''); // 存储文章ID

  // Next.js 15+ 中 params 是 Promise，使用 React.use() 解析
  const { id } = use(params);

  // 正确解析路由参数 + 捕获错误
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error('文章ID不存在');
        }
        setPostId(id);
        await fetchPostData(id); // 调用获取文章数据的函数
      } catch (error) {
        message.error('加载编辑页失败：' + error.message);
        // 跳回首页（避免停留在错误页面）
        router.push('/');
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id]); // 依赖 id（路由参数变化时重新加载）


  // 获取旧数据并回填表单
  const fetchPostData = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
      if (res.data.success) {
        const { title, summary, content } = res.data.data;
        form.setFieldsValue({ title, summary, content }); // 回填表单
      } else {
        throw new Error(res.data.message || '获取文章失败');
      }
    } catch (error) {
      message.error('获取文章详情失败：' + error.message);
    }
  };


  // 提交更新
  const onFinish = async (values) => {
    if (!postId) {
      return message.warning('文章ID无效');
    }
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/posts/${postId}`, values);
      message.success('修改成功！');
      router.push(`/posts/${postId}`); // 跳转到文章详情页
      router.refresh();
    } catch (error) {
      console.error(error);
      message.error('修改失败：' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };


  // 加载中显示 Spin
  if (fetching) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" tip="加载原文中...">
          <div style={{ height: 80 }}></div> {/* 占位容器，让 Spin 有内容可包裹 */}
        </Spin>
      </div>
    );
  }


  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '0 20px' }}>
      <Card title="✏️ 编辑文章" variant={false} shadow="hover">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item label="文章标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item label="摘要" name="summary">
            <Input />
          </Form.Item>

          <Form.Item label="文章内容" name="content" rules={[{ required: true, message: '请输入内容' }]}>
            <TextArea rows={10} showCount maxLength={10000} />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button type="primary" htmlType="submit" loading={loading} block size="large">
                保存修改
              </Button>
              <Button block size="large" onClick={() => router.back()}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}