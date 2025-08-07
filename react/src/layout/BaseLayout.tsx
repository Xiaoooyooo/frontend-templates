import { Suspense } from "react";
import { Outlet } from "react-router";
import NavigationProgress from "@/components/NavigationProgress";

export default function BaseLayout() {
  return (
    <>
      <header>This is Head</header>
      <main>
        <Suspense fallback={<NavigationProgress />}>
          <Outlet />
        </Suspense>
      </main>
      <footer>This is footer</footer>
    </>
  );
}
