import type React from "react";
import type { ReactNode } from "react";

import "../styles/globals.css";
import { Inter } from "next/font/google";

import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html suppressHydrationWarning className={inter.className} lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default Layout;
