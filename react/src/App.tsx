import { RouterProvider } from "react-router/dom";
import router from "@/router";
import { ThemeProvider } from "@/context/ThemeContext";
import { MediaContextProvider } from "@/context/MediaContext";

export default function App() {
  return (
    <MediaContextProvider>
      <ThemeProvider>
        <RouterProvider router={router}></RouterProvider>
      </ThemeProvider>
    </MediaContextProvider>
  );
}
