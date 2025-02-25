import { useTheme } from "@/_utils/providers/ThemeProvider.tsx";
import { useMemo } from "react";

export interface Command {
  name: string;
  onActivate: () => void;
}

export const useCommands = () => {
  const { setTheme, theme } = useTheme();

  const commands: Command[] = useMemo(
    () => [
      {
        name: `Toggle ${theme === "dark" ? "Light" : "Dark"} mode`,
        onActivate: () => setTheme(theme === "dark" ? "light" : "dark"),
      },
    ],
    [setTheme, theme],
  );

  return commands;
};
