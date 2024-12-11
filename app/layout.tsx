import Footer from "./components/Footer";
import Header from "./components/Header";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

// Metadata usando Next
export const metadata: Metadata = {
  title: "Albaranes",
  description: "Alvaro Carmona",
};

// Configurar la fuente de Google con Next
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`antialiased ${roboto.className} grid grid-rows-[auto_1fr_auto] min-h-screen`}>
        <Header />
        <main className="p-4 flex justify-center items-center">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
