import React, { ReactNode } from "react";
import "../styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html className={inter.className} lang="en">
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
};

export default Layout;
