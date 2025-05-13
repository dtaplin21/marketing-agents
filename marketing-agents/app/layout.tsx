import '../styles/main.css';
import '../styles/components.css';
import '../styles/order-aggregation.css';
import '../styles/platform-modal.css';

export const metadata = {
  title: 'Marketing Agents',
  description: 'AI-powered marketing agents interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
