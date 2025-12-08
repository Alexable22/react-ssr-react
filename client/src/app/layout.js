import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry'; // 引入 AntD 样式注册
import StoreProvider from "./StoreProvider"; // 引入我们刚才写的 Redux Provider

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "React SSR Blog",
  description: "全栈博客系统",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AntdRegistry>
            <StoreProvider>
                {/* 这里是页面主体内容 */}
                {children} 
            </StoreProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}