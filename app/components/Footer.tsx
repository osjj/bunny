'use client';

const Footer = () => {
  return (
    <footer className="bg-[#0A0F1C] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">产品</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">主页</a></li>
              <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors">定价</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API 文档</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">资源</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">开发文档</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">使用教程</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">示例项目</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">支持</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">帮助中心</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">联系我们</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">状态</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">公司</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">关于我们</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">博客</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">加入我们</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 CopyCoder. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                隐私政策
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                服务条款
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 