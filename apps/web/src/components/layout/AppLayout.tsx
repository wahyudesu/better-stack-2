import { Outlet } from "react-router-dom";
import BottomMenu from "@/components/bottom-menu";
import { AppHeader } from "./AppHeader";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-[1024px] flex-1 overflow-auto px-5 pb-24 pt-4">
        <Outlet />
      </main>
      <BottomMenu />
    </div>
  );
}
