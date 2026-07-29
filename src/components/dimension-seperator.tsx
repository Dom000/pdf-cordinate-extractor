import { cn } from "@/lib/utils";
import React from "react";
import { Separator } from "./ui/separator";

interface DimensionSeperatorProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  topText?: string;
  bottomText?: string;
  seperatorClassName?: string;
}

function DimensionSeperator({
  className,
  orientation,
  bottomText,
  topText,
  seperatorClassName,
}: DimensionSeperatorProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center font-data text-ink/60",
        className
      )}
    >
      {orientation == "vertical" && (
        <div className="flex -rotate-90 flex-col items-center justify-center space-y-4">
          <p className="font-display font-semibold text-coral">{topText}</p>{" "}
          <p>{bottomText}</p>
        </div>
      )}
      {orientation !== "vertical" && (
        <p className="font-display font-semibold text-coral">{topText}</p>
      )}{" "}
      <Separator
        className={cn(
          "my-2 bg-ink/20",
          seperatorClassName,
          orientation === "vertical" ? "-rotate-90" : ""
        )}
      />
      {orientation !== "vertical" && <p>{bottomText}</p>}
    </div>
  );
}

export default DimensionSeperator;
