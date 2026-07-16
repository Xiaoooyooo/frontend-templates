import { Suspense } from "react";
import { Outlet } from "react-router";
import NavigationProgress from "@/components/NavigationProgress";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function BaseLayout() {
  return (
    <>
      <header>This is Head</header>
      <main>
        <ErrorBoundary>
          <Suspense fallback={<NavigationProgress />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <footer>This is footer</footer>
    </>
  );
}
