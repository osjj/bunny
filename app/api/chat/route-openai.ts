import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 调试函数
const debug = (data: any, label: string = '') => {
  console.log('\n====================');
  console.log(`🔍 DEBUG ${label}:`, data);
  console.log('====================\n');
};

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: "ff7ce380-ce30-47c1-a863-cae39f2cfecc",
});

export async function POST(request: NextRequest) {
  try {
    // 调试请求头
    debug(Object.fromEntries(request.headers), 'Request Headers');

    const body = await request.json();
    debug(body, 'Request Body');
    
    const { prompt, images, options } = body;

    // 验证输入
    debug({ prompt, imagesCount: images?.length, options }, 'Validated Input');

    if (!images || !Array.isArray(images) || images.length === 0) {
      debug('验证失败：没有图片', 'Validation Error');
      return NextResponse.json(
        { error: '请提供至少一张图片' },
        { status: 400 }
      );
    }

    // 准备图片消息
    const imageMessages = images.map((base64Image, index) => {
      const message = {
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${base64Image}`,
        },
      };
      debug(message, `Image Message ${index + 1}`);
      return message;
    });

    // 创建完整的消息数组
    const messages = [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt || '分析这些图片的设计和布局，并提供详细的前端实现建议' },
          ...imageMessages,
        ],
      },
    ];
    debug(messages, 'Final Messages Array');

    // 调用 OpenAI API
    debug({
     model: 'ep-20241225133507-l76bb',
      maxTokens: options?.maxTokens || 1024,
      temperature: options?.temperature || 0.7,
    }, 'OpenAI API Parameters');

    const completion = await openai.chat.completions.create({
        model: 'ep-20241225133507-l76bb',
      messages: messages
    });

    debug(completion, 'OpenAI API Response');

    // 获取响应文本
    const responseMessage = completion.choices[0]?.message?.content;

    if (!responseMessage) {
      debug('No response message received', 'Error');
      throw new Error('未能获取有效的分析结果');
    }

    debug(responseMessage, 'Final Response Message');

    // 返回分析结果
    return NextResponse.json({
      message: responseMessage,
    });

  } catch (error) {
    debug(error, 'Error Details');
    console.error('API Error:', error);
    
    // 处理不同类型的错误
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: '调用 AI 服务时出错: ' + error.message },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 处理其他 HTTP 方法
export async function GET() {
  debug('收到 GET 请求', 'Unsupported Method');
  return NextResponse.json(
    { error: '不支持的请求方法' },
    { status: 405 }
  );
} 