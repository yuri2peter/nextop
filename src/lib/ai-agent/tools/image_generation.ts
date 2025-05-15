import { saveFile } from "@/integrations/fileStorage";
import { shortId } from "@/lib/string";
import { createImageService } from "pollinationsai";
import { random } from "radashi";
import { z } from "zod";
import type { Tool } from "../types/tool";

const schema = z.object({
  description: z
    .string()
    .describe(
      "Description (in English) of the image to generate, consider the artistic dimensions: composition, color palette, artistic style, texture, lighting, mood, etc.",
    ),
  model: z
    .enum(["flux", "turbo"])
    .describe(
      "The model to use for image generation. Use 'turbo' for female, use 'flux' for general content.",
    ),
});

export const imageGenerationTool: Tool<typeof schema> = {
  name: "image_generation",
  description:
    "Generate an image from a description, return the URL of the image. Cannot accurately render specific text.",
  schema,
  execute: async (input) => {
    const { description, model } = input;
    const fileSaved = await generateImage(description, model);
    return { image_url: fileSaved.url };
  },
};

async function generateImage(
  description: string,
  model: "flux" | "turbo" = "flux",
) {
  const imageService = createImageService();
  // Generate image from prompt
  const imageBuffer = await imageService.generate(description, {
    model,
    // 16:9
    width: 1280,
    height: 720,
    private: true,
    safe: false,
    nologo: true,
    enhance: true,
    seed: random(0, 1000000),
  });
  const filename = `${shortId()}.jpg`;
  const file = new File([imageBuffer], filename, {
    type: "image/jpeg",
  });
  const fileSaved = await saveFile(file);
  return fileSaved;
}
