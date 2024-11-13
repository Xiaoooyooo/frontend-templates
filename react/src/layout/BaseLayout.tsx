import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export default function BaseLayout() {
  return (
    <>
      <header>This is Head</header>
      <main>
        <Suspense fallback={<div>loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
      <footer>This is footer</footer>
    </>
  );
}
