import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import { Request, Response } from "express";
import { deepseek } from "@ai-sdk/deepseek";
import { google } from "@ai-sdk/google";
import { generateText, streamText } from "ai";
// @ts-ignore
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { textExtractor } from "./text-extractor";
import { getAnalysisforLabel } from "../ai/prompts";

process.env.GOOGLE_APPLICATION_CREDENTIALS = "labelanalyzer-8467c8b95bcd.json";

interface MulterRequest extends Request {
  file?: Express.Multer.File; // Extend Request to include Multer file
}

async function detectText(image: string): Promise<string> {
  const client = new ImageAnnotatorClient();

  const [result] = await client.documentTextDetection({
    image: { content: image },
  });

  if (result.error?.message) {
    throw new Error(`
            ${result.error.message}
            For more info on error messages, check: 
            https://cloud.google.com/apis/design/errors
        `);
  }

  let ocrText: string = "";
  for (const text of result.textAnnotations || []) {
    console.log(text);
    ocrText += `${text.description}`;
  }
  console.log("-----------------------------------------------");
  console.log(ocrText);
  return ocrText;
}

export const submitController = async (
  req: MulterRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    const apiResponse = await textExtractor(base64Image, mimeType);

    const result = await streamText({
      model: google("gemini-1.5-flash"),
      system: "what is life? explain in markdown.",
      prompt: "",
    });
    result.pipeTextStreamToResponse(res);
    return;
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
