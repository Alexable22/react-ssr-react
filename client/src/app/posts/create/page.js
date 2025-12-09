//“发布文章”页面
'use client'; // 这是一个客户端交互页面，必须标记 use client

import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Modal } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Next.js 的路由跳转钩子
const { TextArea } = Input;


// 服务端运行的获取文章列表
export default function CreatePostPage() {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false); // AI 生成中的 loading 状态
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制弹窗显示
  const [aiTopic, setAiTopic] = useState(''); // 存储用户输入的 AI 主题
  const router = useRouter();
  const [form] = Form.useForm();

  // 表单提交处理
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 发送请求给我们的 Express 后端
      await axios.post('http://localhost:5000/api/posts', values);
      
      message.success('发布成功！即将返回首页...');
      
      // 延迟 1 秒后跳转回首页
      setTimeout(() => {
        router.push('/'); 
        router.refresh(); // 强制刷新，确保首页获取最新数据
      }, 1000);
      
    } catch (error) {
      console.error(error);
      message.error('发布失败，请检查后端服务是否启动');
    } finally {
      setLoading(false);
    }
  };

  // 处理 AI 生成请求
  const handleAiGenerate = async () => {
      // 校验主题非空
      if (!aiTopic.trim()) return message.warning('请输入主题');

      setAiLoading(true);
      try {
          const res = await axios.post('http://localhost:5000/api/ai/generate', {
              topic: aiTopic
          });

          if (res.data.success) {
              const { title, summary, content } = res.data.data;
              
              // 可以自动填充表单
              form.setFieldsValue({
                  title,
                  summary,
                  content
              });
              
              message.success('AI 写作完成，你可以修改后发布～');
              setIsModalOpen(false); // 关闭弹窗
          }
      } catch (error) {
          message.error('AI 生成失败，请重试');
      } finally {
          setAiLoading(false);
      }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '0 20px' }}>
      <Card 
        title="✍️ 发布新文章" 
        variant={false} 
        // 在卡片右上角增加 AI 按钮
        extra={
            <Button 
                type="dashed" 
                icon={<RobotOutlined />} 
                onClick={() => setIsModalOpen(true)}
                style={{ color: '#1677ff', borderColor: '#1677ff' }}
            >
                AI 写作助手
            </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ content: '' }}
        >
          {/* ... Title, Summary, Content 的 Form.Item 代码保持不变 ... */}
           <Form.Item label="文章标题" name="title" rules={[{ required: true }]}>
            <Input placeholder="给文章起个好名字..." size="large" />
          </Form.Item>
          <Form.Item label="摘要 (可选)" name="summary">
            <Input placeholder="简短的介绍..." />
          </Form.Item>
          <Form.Item label="文章内容" name="content" rules={[{ required: true }]}>
            <TextArea rows={10} placeholder="正文..." showCount maxLength={10000} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              🚀 立即发布
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* AI 输入弹窗 */}
      <Modal 
        title="🤖 AI 文章生成器" 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        footer={null} // 自定义底部按钮
      >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15, padding: '20px 0' }}>
              <Input 
                placeholder="你想写什么？例如：100天速成大厨" 
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                onPressEnter={handleAiGenerate}
              />
              <Button 
                type="primary" 
                onClick={handleAiGenerate} 
                loading={aiLoading}
                icon={<RobotOutlined />}
              >
                开始生成初稿
              </Button>
              {aiLoading && <div style={{textAlign: 'center', color: '#999'}}>AI 正在思考中，这可能需要几秒钟...</div>}
          </div>
      </Modal>
    </div>
  );
}