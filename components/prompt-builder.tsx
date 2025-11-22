"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { RatingsTable } from "@/components/ratings-table";
import { NumberPicker } from "@/components/number-picker";

interface PromptBuilderProps {
  templateContent: string;
  title?: string;
  description?: string;
}

interface DimensionRating {
  rating: number | string | null;
  justification: string;
}

const dimensions = [
  "Localization",
  "Instruction Following",
  "Truthfulness",
  "Verbosity",
  "Style & Clarity",
  "Harmlessness/Safety",
  "Overall Quality",
];

function formatRatingsTable(ratings: Record<string, DimensionRating>): string {
  const rows = dimensions.map((dim) => {
    const rating = ratings[dim] || { rating: null, justification: "" };
    const ratingStr = rating.rating !== null ? String(rating.rating) : "[leave blank]";
    const justificationStr = rating.justification || "[...]";
    return `| ${dim} | ${ratingStr} | ${justificationStr} |`;
  });

  return [
    "",
    "| Dimension                     | Rating                       | Justification |",
    "| ----------------------------- | ---------------------------- | ------------- |",
    ...rows,
  ].join("\n");
}

export function PromptBuilder({ templateContent, title, description }: PromptBuilderProps) {
  const [formData, setFormData] = useState({
    taskConfig: "",
    systemPrompt: "",
    conversationHistory: "",
    prompt: "",
    response1: "",
    response2: "",
    response1Ratings: {} as Record<string, DimensionRating>,
    response2Ratings: {} as Record<string, DimensionRating>,
    likertRating: null as number | null,
    likertJustification: "",
  });

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleRatingChange = (responseNum: 1 | 2, dimension: string, rating: number | string | null) => {
    setFormData((prev) => {
      const ratingsKey = responseNum === 1 ? "response1Ratings" : "response2Ratings";
      const ratings = { ...prev[ratingsKey] };
      ratings[dimension] = {
        ...ratings[dimension],
        rating,
      };
      return { ...prev, [ratingsKey]: ratings };
    });
  };

  const handleJustificationChange = (responseNum: 1 | 2, dimension: string, justification: string) => {
    setFormData((prev) => {
      const ratingsKey = responseNum === 1 ? "response1Ratings" : "response2Ratings";
      const ratings = { ...prev[ratingsKey] };
      ratings[dimension] = {
        ...ratings[dimension],
        justification,
      };
      return { ...prev, [ratingsKey]: ratings };
    });
  };

  const generatePrompt = () => {
    let finalPrompt = templateContent;

    const replaceSection = (tag: string, content: string) => {
      const regex = new RegExp(`(<${tag}>)[\\s\\S]*?(<\\/${tag}>)`, "g");
      finalPrompt = finalPrompt.replace(regex, (match, startTag, endTag) => {
        return `${startTag}\n${content}\n${endTag}`;
      });
    };

    replaceSection("TASKCONFIG", formData.taskConfig);
    replaceSection("SYSTEM_PROMPT", formData.systemPrompt);
    replaceSection("CONVERSATION_HISTORY", formData.conversationHistory);
    replaceSection("PROMPT", formData.prompt);
    replaceSection("RESPONSE1", formData.response1);
    replaceSection("RESPONSE2", formData.response2);
    
    const response1RatingsTable = formatRatingsTable(formData.response1Ratings);
    const response2RatingsTable = formatRatingsTable(formData.response2Ratings);
    
    replaceSection("RESPONSE1_ORIGINAL_RATINGS", response1RatingsTable);
    replaceSection("RESPONSE2_ORIGINAL_RATINGS", response2RatingsTable);
    
    const likertStr = formData.likertRating !== null 
      ? `Likert: ${formData.likertRating}\nJustification: ${formData.likertJustification || "[...]"}` 
      : "Likert: [1..7 or leave blank]\nJustification: [...]";
    replaceSection("ORIGINAL_LIKERT_AND_JUSTIFICATION", likertStr);

    return finalPrompt;
  };

  const copyToClipboard = async () => {
    const text = generatePrompt();
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Prompt copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{title ?? "Apron Evals Prompt Builder"}</CardTitle>
          <CardDescription>
            {description ?? "Fill in the fields below to generate the full prompt."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="taskConfig">Task Config (Optional)</Label>
            <Textarea 
              id="taskConfig" 
              placeholder="Paste task metadata or category info here..." 
              value={formData.taskConfig}
              onChange={handleChange("taskConfig")}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System Prompt (Optional)</Label>
            <Textarea 
              id="systemPrompt" 
              placeholder="Paste system prompt here..." 
              value={formData.systemPrompt}
              onChange={handleChange("systemPrompt")}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="conversationHistory">Conversation History (Optional)</Label>
            <Textarea 
              id="conversationHistory" 
              placeholder="Paste relevant conversation history..." 
              value={formData.conversationHistory}
              onChange={handleChange("conversationHistory")}
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">User Prompt (Required)</Label>
            <Textarea 
              id="prompt" 
              placeholder="Paste the final user prompt here..." 
              value={formData.prompt}
              onChange={handleChange("prompt")}
              className="min-h-[150px] font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="response1">Response 1 (Required)</Label>
              <Textarea 
                id="response1" 
                placeholder="Paste Response 1 verbatim..." 
                value={formData.response1}
                onChange={handleChange("response1")}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="response2">Response 2 (Required)</Label>
              <Textarea 
                id="response2" 
                placeholder="Paste Response 2 verbatim..." 
                value={formData.response2}
                onChange={handleChange("response2")}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Response 1 Original Ratings (Optional)</Label>
            <RatingsTable
              ratings={formData.response1Ratings}
              onRatingChange={(dim, rating) => handleRatingChange(1, dim, rating)}
              onJustificationChange={(dim, justification) => handleJustificationChange(1, dim, justification)}
            />
          </div>

          <div className="space-y-4">
            <Label>Response 2 Original Ratings (Optional)</Label>
            <RatingsTable
              ratings={formData.response2Ratings}
              onRatingChange={(dim, rating) => handleRatingChange(2, dim, rating)}
              onJustificationChange={(dim, justification) => handleJustificationChange(2, dim, justification)}
            />
          </div>

          <div className="space-y-4">
            <Label>Original Likert & Justification (Optional)</Label>
            <div className="space-y-3">
              <div>
                <Label className="text-sm mb-2 block">Likert Score</Label>
                <NumberPicker
                  values={[1, 2, 3, 4, 5, 6, 7]}
                  selected={formData.likertRating}
                  onSelect={(value) => setFormData((prev) => ({ ...prev, likertRating: value as number }))}
                  labels={["1", "2", "3", "4", "5", "6", "7"]}
                />
              </div>
              <div>
                <Label htmlFor="likertJustification" className="text-sm mb-2 block">Justification</Label>
                <Textarea
                  id="likertJustification"
                  placeholder="Enter justification..."
                  value={formData.likertJustification}
                  onChange={(e) => setFormData((prev) => ({ ...prev, likertJustification: e.target.value }))}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 sticky bottom-4">
            <Button onClick={copyToClipboard} className="w-full shadow-lg" size="lg">
              <Copy className="mr-2 h-4 w-4" />
              Copy Full Prompt to Clipboard
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
