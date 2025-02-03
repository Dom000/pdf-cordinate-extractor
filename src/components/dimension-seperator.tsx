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
        " text-gray-600 w-full flex flex-col justify-center items-center",
        className
      )}
    >
      {orientation == "vertical" && (
        <div className=" flex flex-col space-y-4 items-center justify-center  -rotate-90">
          <p>{topText}</p> <p>{bottomText}</p>
        </div>
      )}
      {orientation !== "vertical" && <p>{topText}</p>}{" "}
      <Separator
        className={cn(
          "my-2 ",
          seperatorClassName,
          orientation === "vertical" ? "-rotate-90" : ""
        )}
      />
      {orientation !== "vertical" && <p>{bottomText}</p>}
    </div>
  );
}

export default DimensionSeperator;
