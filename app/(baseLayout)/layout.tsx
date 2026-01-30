export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="h-[100dvh] w-[100dvw] m-auto">{children}</main>;
}
