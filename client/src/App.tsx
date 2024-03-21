import { Route, Routes } from "react-router-dom";
import Header from "./components/header";
import Home from "./pages/home";
import Compiler from "./pages/compiler";
import NotFound from "./pages/notFound";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <Toaster position="bottom-right" theme="dark" />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compiler" element={<Compiler />} />
          <Route path="/compiler/:urlId" element={<Compiler />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}
