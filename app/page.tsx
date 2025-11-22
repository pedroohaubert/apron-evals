import { readFile } from "fs/promises";
import { join } from "path";
import { PromptBuilder } from "@/components/prompt-builder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Home() {
  const basePath = process.cwd();
  const [apronTemplate, cypherTemplate] = await Promise.all([
    readFile(join(basePath, "prompt-format.md"), "utf-8"),
    readFile(join(basePath, "prompt-format-cypher.md"), "utf-8"),
  ]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="apron" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="apron">Apron Evals</TabsTrigger>
            <TabsTrigger value="cypher">Cypher Evals</TabsTrigger>
          </TabsList>

          <TabsContent value="apron" className="pt-6">
            <PromptBuilder
              key="apron"
              templateContent={apronTemplate}
              title="Apron Evals Prompt Builder"
              description="Fill in the fields below to generate the full Apron prompt."
            />
          </TabsContent>

          <TabsContent value="cypher" className="pt-6">
            <PromptBuilder
              key="cypher"
              templateContent={cypherTemplate}
              title="Cypher Evals Prompt Builder"
              description="Fill in the fields below to generate the full Cypher prompt."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
