"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NumberPickerProps {
  values: (number | string)[];
  selected: number | string | null;
  onSelect: (value: number | string) => void;
  labels?: string[];
}

export function NumberPicker({ values, selected, onSelect, labels }: NumberPickerProps) {
  return (
    <div className="flex gap-2">
      {values.map((value, index) => {
        const isSelected = selected === value;
        return (
          <Button
            key={value}
            type="button"
            variant={isSelected ? "default" : "outline"}
            onClick={() => onSelect(value)}
            className={cn(
              "min-w-[40px] h-9 px-3",
              isSelected && "bg-primary text-primary-foreground"
            )}
          >
            {labels?.[index] ?? value}
          </Button>
        );
      })}
    </div>
  );
}

