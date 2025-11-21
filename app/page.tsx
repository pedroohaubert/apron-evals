import { readFile } from "fs/promises";
import { join } from "path";
import { PromptBuilder } from "@/components/prompt-builder";

export default async function Home() {
  const templatePath = join(process.cwd(), "prompt-format.md");
  const templateContent = await readFile(templatePath, "utf-8");

  return (
    <div className="min-h-screen bg-background py-8">
      <PromptBuilder templateContent={templateContent} />
    </div>
  );
}
