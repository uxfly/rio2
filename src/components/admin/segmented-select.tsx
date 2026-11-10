"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const options = ["1", "2", "3", "4", "5+"];

export function SegmentedSelect({
  defaultValue = "",
  name,
}: {
  defaultValue?: string;
  name: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.form?.dispatchEvent(new CustomEvent("property-fields-change"));
  }, [value]);

  return (
    <div className="flex flex-wrap gap-2">
      <input name={name} ref={inputRef} type="hidden" value={value} />
      {options.map((option) => (
        <button
          aria-pressed={value === option}
          className={cn(
            "flex size-10 items-center justify-center rounded-full border text-sm font-medium transition-colors",
            value === option
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-input/20 text-muted-foreground hover:border-primary/60 hover:text-foreground",
          )}
          key={option}
          onClick={() => setValue((current) => current === option ? "" : option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
