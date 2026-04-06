import type { Metadata } from "next";
import StyledComponentsRegistry from "@/app/providers/StyledComponentsRegistry";
import QueryProvider from "@/app/providers/QueryProvider";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { AppProvider } from "@/app/providers/AppProvider";
import { AppShell } from "@/widgets/app-shell";

export const metadata: Metadata = {
  title: "GameFit — Personalized Game Analysis",
  description: "AI-powered game recommendation engine based on your personal taste",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          <QueryProvider>
            <AuthProvider>
              <AppProvider>
                <AppShell>{children}</AppShell>
              </AppProvider>
            </AuthProvider>
          </QueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
