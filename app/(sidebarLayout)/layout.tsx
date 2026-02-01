import Footer from "@/app/common/components/footer";
import Header from "@/app/common/components/header";
import Sidebar from "@/app/common/components/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TooltipProvider>
        <Sidebar />
      </TooltipProvider>
      <main className="flex flex-col flex-1 bg-primary-foreground ">
        <Header />
        <div className="flex-1 w-full min-h-[calc(100vh-24rem)]">
          {children}
        </div>
        <Footer />
      </main>
    </>
  );
}
