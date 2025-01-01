import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PlanConfig {
  price?: number;
  price_id?: string;
}

const PLANS: Record<string, PlanConfig> = {
  free: { price: 0 },
  pro: { price_id: 'price_1QbLQeIKDyoXLJh07mXzAdm4' },
  enterprise: { price_id: process.env.STRIPE_ENTERPRISE_PRICE_ID }
};

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json();
    
    // 从请求头获取认证信息
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: '请先登录' }),
        { status: 401 }
      );
    }

    // 验证会话
    const { data: { user }, error } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (error || !user) {
      return new Response(
        JSON.stringify({ error: '请先登录' }),
        { status: 401 }
      );
    }

    const plan = PLANS[planId];

    if (!plan) {
      return new Response(
        JSON.stringify({ error: '无效的订阅计划' }),
        { status: 400 }
      );
    }

    // 免费计划不需要支付
    if (planId === 'free') {
      return new Response(
        JSON.stringify({ url: '/dashboard' }),
        { status: 200 }
      );
    }

    if (!plan.price_id) {
      throw new Error('无效的价格配置');
    }

    // 创建 Stripe Checkout 会话
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: user.email,
      mode: 'subscription',
      line_items: [
        {
          price: plan.price_id,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      metadata: {
        userId: user.id,
        planId,
      },
    });

    return new Response(
      JSON.stringify({ url: checkoutSession.url }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Stripe API Error:', error);
    return new Response(
      JSON.stringify({ error: '创建支付会话失败' }),
      { status: 500 }
    );
  }
} 