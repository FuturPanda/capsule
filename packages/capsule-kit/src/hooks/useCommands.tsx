import { useTheme } from "@/_utils/providers/ThemeProvider.tsx";

export interface Command {
  name: string;
  onActivate: (...args: any[]) => void;
}

export const useCommands = () => {
  const { setTheme, theme } = useTheme();

  const commands: Command[] = [
    {
      name: `Toggle ${theme === "dark" ? "Light" : "Dark"} mode`,
      onActivate: () => setTheme(theme === "dark" ? "light" : "dark"),
    },
  ];

  return commands;
};
