"use client";

import { NumberPicker } from "@/components/number-picker";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DimensionRating {
  rating: number | string | null;
  justification: string;
}

interface RatingsTableProps {
  ratings: Record<string, DimensionRating>;
  onRatingChange: (dimension: string, rating: number | string | null) => void;
  onJustificationChange: (dimension: string, justification: string) => void;
}

const dimensions = [
  { key: "Localization", values: [1, 2, 3], labels: ["1", "2", "3"] },
  { key: "Instruction Following", values: [1, 2, 3], labels: ["1", "2", "3"] },
  { key: "Truthfulness", values: [1, 2, 3], labels: ["1", "2", "3"] },
  { key: "Verbosity", values: [-2, -1, 0, 1, 2], labels: ["-2", "-1", "0", "1", "2"] },
  { key: "Style & Clarity", values: [1, 2, 3], labels: ["1", "2", "3"] },
  { key: "Harmlessness/Safety", values: [1, 2, 3], labels: ["1", "2", "3"] },
  { key: "Overall Quality", values: [1, 2, 3, 4, 5], labels: ["1", "2", "3", "4", "5"] },
];

export function RatingsTable({ ratings, onRatingChange, onJustificationChange }: RatingsTableProps) {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium">Dimension</th>
              <th className="text-left p-3 font-medium">Rating & Justification</th>
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dimension) => {
              const rating = ratings[dimension.key] || { rating: null, justification: "" };
              return (
                <tr key={dimension.key} className="border-t">
                  <td className="p-3 font-medium align-top">{dimension.key}</td>
                  <td className="p-3">
                    <div className="space-y-3">
                      <NumberPicker
                        values={dimension.values}
                        selected={rating.rating}
                        onSelect={(value) => onRatingChange(dimension.key, value)}
                        labels={dimension.labels}
                      />
                      <Textarea
                        placeholder="Enter justification..."
                        value={rating.justification}
                        onChange={(e) => onJustificationChange(dimension.key, e.target.value)}
                        className="min-h-[60px] text-sm"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

