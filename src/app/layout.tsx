import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import Header from "@/components/ui/header";
import AppShell from "@/components/ui/app-shell";
import Footer from "@/components/ui/footer";

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
            <Footer />
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
