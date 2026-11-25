import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "طبقات | منصة أصحاب الحلويات والكيك ديزاين",
    template: "%s | طبقات",
  },
  description:
    "طبقات منصة جزائرية تمنح أصحاب الكيك ديزاين والحلويات التقليدية متجراً إلكترونياً احترافياً، مع قائمة منتجات، معرض أعمال، ونظام طلبات.",
  metadataBase: new URL("https://tabaqat.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
