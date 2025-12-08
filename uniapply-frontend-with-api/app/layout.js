import "./globals.css";

export const metadata = {
  title: "UniApply",
  description: "Unified University Application Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="min-h-screen bg-slate-100">
        {children}
      </body>
    </html>
  );
}
