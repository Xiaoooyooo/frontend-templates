import {
  createContext,
  use,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

type IThemeContext = {
  theme: "light" | "dark" | "system";
  setTheme: (theme: IThemeContext["theme"]) => void;
};

const ThemeContext = createContext({} as IThemeContext);

export function useThemeContext() {
  return use(ThemeContext);
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<IThemeContext["theme"]>("system");

  useEffect(() => {
    if (theme === "system") return;
    document.documentElement.classList.add(`theme-${theme}`);
    return () => {
      document.documentElement.classList.remove(`theme-${theme}`);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
