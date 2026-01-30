"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      className="w-9 px-0"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <SunIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Enable Light Theme</p>
          <TooltipArrow width={11} height={5} />
        </TooltipContent>
      </Tooltip>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <MoonIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Enable Dark Theme</p>
          <TooltipArrow width={11} height={5} />
        </TooltipContent>
      </Tooltip>
    </Button>
  );
}
