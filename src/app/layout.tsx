import type { Metadata, Viewport } from "next";
import StyledComponentsRegistry from "@/app/providers/StyledComponentsRegistry";
import QueryProvider from "@/app/providers/QueryProvider";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { AppProvider } from "@/app/providers/AppProvider";
import { NavigationProvider } from "@/app/providers/NavigationProvider";
import { ServiceWorkerRegistration } from "@/app/providers/ServiceWorkerRegistration";
import { AppShell } from "@/widgets/app-shell";

export const metadata: Metadata = {
  title: "GameOrWait — Personalized Game Analysis",
  description:
    "Predict whether you'll actually enjoy a game and at what price point, based on your taste",
  manifest: "/manifest.json",
  openGraph: {
    title: "GameOrWait — Personalized Game Analysis",
    description:
      "Predict whether you'll actually enjoy a game and at what price point, based on your taste",
    url: "https://gameorwait.com",
    siteName: "GameOrWait",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GameOrWait logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GameOrWait — Personalized Game Analysis",
    description:
      "Predict whether you'll actually enjoy a game and at what price point, based on your taste",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GameOrWait",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#08080e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/pwa-icon-192.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ServiceWorkerRegistration />
        <StyledComponentsRegistry>
          <QueryProvider>
            <AuthProvider>
              <AppProvider>
                <NavigationProvider>
                  <AppShell>{children}</AppShell>
                </NavigationProvider>
              </AppProvider>
            </AuthProvider>
          </QueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
