'use client';

import { Button, message } from 'antd';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';

// 初始化 Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PricingPage = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubscribe = async (planId: string) => {
    try {
      setLoading(planId);

      // 获取当前会话
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        messageApi.error('请先登录');
        return;
      }
      
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '支付初始化失败');
      }

      // 如果是免费计划，直接跳转
      if (planId === 'free') {
        window.location.href = data.url;
        return;
      }

      // 重定向到 Stripe Checkout
      window.location.href = data.url;

    } catch (error) {
      console.error('订阅错误:', error);
      messageApi.error(error instanceof Error ? error.message : '订阅失败，请重试');
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '0',
      features: [
        '每月 20 次图片分析',
        '基础 AI 分析功能',
        '社区支持',
      ],
      buttonText: '开始使用',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '99',
      features: [
        '每月 200 次图片分析',
        '高级 AI 分析功能',
        '优先客服支持',
        '自定义分析模型',
        'API 访问'
      ],
      buttonText: '升级到 Pro',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '联系我们',
      features: [
        '无限次图片分析',
        '专属 AI 模型定制',
        '24/7 专属支持',
        '团队协作功能',
        'API 高级访问',
        'SLA 保障'
      ],
      buttonText: '联系销售',
      popular: false
    }
  ];

  return (
    <>
      {contextHolder}
      <div className="bg-[#0A0F1C] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-4">
              选择适合您的计划
            </h1>
            <p className="text-gray-400 text-lg">
              灵活的定价方案，满足不同规模团队的需求
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-[#1A1F2E] rounded-2xl p-8 border-2 ${
                  plan.popular ? 'border-blue-500' : 'border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                      最受欢迎
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">{plan.name}</h3>
                  <div className="text-gray-300">
                    <span className="text-3xl font-bold">
                      {typeof plan.price === 'string' ? plan.price : `¥${plan.price}`}
                    </span>
                    {typeof plan.price === 'number' && <span className="text-gray-500">/月</span>}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-300">
                      <svg
                        className="w-5 h-5 text-blue-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  type={plan.popular ? 'primary' : 'default'}
                  className={`w-full h-12 text-base font-semibold ${
                    plan.popular ? 'bg-blue-500 hover:bg-blue-600' : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => handleSubscribe(plan.id)}
                  loading={loading === plan.id}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              需要更多信息？
            </h2>
            <p className="text-gray-400 mb-8">
              我们的团队随时为您提供帮助，解答您的任何问题
            </p>
            <Button size="large" className="border-gray-600 hover:border-gray-500">
              联系我们
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage; 