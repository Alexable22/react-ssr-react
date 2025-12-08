import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// 初始化 OpenAI 客户端
const openai = process.env.AI_ENABLED === 'true' ? new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: process.env.AI_BASE_URL || 'https://api.openai.com'
}) : null;

export const generateContent = async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ success: false, message: '请输入主题' });
    }

    try {
        // --- 模式 A: 模拟模式 (没有 Key 时使用) ---
        if (!openai) {
            console.log('⚠️ 未检测到 AI Key，使用模拟数据响应...');
            // 模拟 1.5秒 延迟
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            return res.json({
                success: true,
                data: {
                    title: `[AI 模拟] 关于 "${topic}" 的模拟标题`,
                    summary: `这是一篇关于 ${topic} 的模拟摘要。`,
                    content: `## ${topic} 的核心概念\n\n这里是模拟生成的正文内容。\n\n1. 第一点\n2. 第二点\n\n**注意**：你当前处于模拟模式，请在后端 .env 文件中配置真实的 API_KEY 以启用真正的 AI 功能。`
                }
            });
        }

        // --- 模式 B: 真实 AI 调用 ---
        console.log(`🤖 正在请求 AI 生成: ${topic}`);
        
        const completion = await openai.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "你是一个专业的博客写作助手。请根据用户提供的主题，生成一篇技术博客。返回格式必须是 JSON，包含三个字段：title(标题), summary(摘要), content(正文，使用Markdown格式)。" 
                },
                { 
                    role: "user", 
                    content: `请写一篇关于 "${topic}" 的文章。` 
                }
            ],
            model: "deepseek-chat",
            response_format: { type: "json_object" }, // 强制让 AI 返回 JSON
        });

        const result = JSON.parse(completion.choices[0].message.content);

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('AI 生成失败:', error);
        res.status(500).json({ success: false, message: 'AI 服务暂时不可用' });
    }
};