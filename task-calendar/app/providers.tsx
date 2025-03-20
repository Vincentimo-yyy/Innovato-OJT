"use client";

import type { ThemeProviderProps } from "next-themes";
import type * as React from "react";

import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  const defaultThemeProps: ThemeProviderProps = {
    attribute: "class",
    defaultTheme: "light",
    enableSystem: true,
    ...themeProps,
  };

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...defaultThemeProps}>{children}</NextThemesProvider>
    </HeroUIProvider>
  );
}
