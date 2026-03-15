import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import Header from "@/components/ui/header";
import AppShell from "@/components/ui/app-shell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          <AppShell>
            <Header />
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
