import { RouterProvider } from "react-router/dom";
import router from "@/router";
import MediaContextProvider from "./components/Providers/MediaContextProvider";

export default function App() {
  return (
    <MediaContextProvider>
      <RouterProvider router={router}></RouterProvider>
    </MediaContextProvider>
  );
}
