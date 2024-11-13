import { lazy } from "react";
import { createBrowserRouter, type RouteObject } from "react-router-dom";

const BaseLayout = lazy(() => import("@/layout/BaseLayout"));
const Home = lazy(() => import("@/views/Home"));
const NotFound = lazy(() => import("@/components/NotFound"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        path: "",
        element: <Home />,
        index: true,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default createBrowserRouter(routes, { basename: "/" });
