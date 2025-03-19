import { z } from "zod";
import { defineDAINService, ToolConfig } from "@dainprotocol/service-sdk";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize the Google Generative AI client
if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not set in the environment variables");
}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

interface AIResponse {
  scenario: "classroom" | "corridor";
  obstacles: string[];
}

const analyzeImageConfig: ToolConfig = {
  id: "analyze-image",
  name: "Analyze Indoor Image",
  description: "Analyzes an indoor image to identify the scenario and obstacles for blind navigation",
  input: z.object({
    imageUrl: z.string().describe("URL of the image to analyze")
  }),
  output: z.object({
    scenario: z.enum(["classroom", "corridor"]),
    obstacles: z.array(z.string())
  }),
  pricing: { pricePerUse: 0, currency: "USD" },
  handler: async ({ imageUrl }, agentInfo) => {

    console.log(`Analyzing image for ${agentInfo.id}`);

    // Download the image
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data, 'binary');

    // Prepare the prompt
    const prompt = `You are a blind navigation system helping a blind person navigate in an indoor system. 
    With the help of this system, you are tasked with helping a person identify the scenario from the given image.
    If the scenario is a corridor, try to identify all the obstacles and if there are none, just put out none. 
    If it is a classroom, try to find out all the obstacles and identify what kind of seating is present here, does it have individual seating or group seating. 
    If the image is a floor map try to memorize the ladmarks present in it with the directions. Mention all the landmarks to the right as right and to the left as left.
    You must follow the following JSON output format: 
    {
        "scenario": <classroom, corridor>,
        "obstacles": [obstacle1, obstacle2, .....]
    }`;

    // Use Google's Generative AI model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBuffer.toString("base64")
        }
      },
      prompt
    ]);

    const response = await result.response;
    const aiResponse: AIResponse = JSON.parse(response.text());

    return {
      text: `Analyzed image: ${aiResponse.scenario} with ${aiResponse.obstacles.length} obstacles`,
      data: aiResponse,
      ui: {
        type: "card",
        uiData: JSON.stringify({
          title: "Image Analysis Result",
          content: `Scenario: ${aiResponse.scenario}\nObstacles: ${aiResponse.obstacles.join(", ")}`
        })
      }
    };
  }
};

const dainService = defineDAINService({
  metadata: {
    title: "Indoor Navigation Assistant",
    description: "A DAIN service for analyzing indoor images to assist blind navigation",
    version: "1.0.0",
    author: "Your Name",
    tags: ["vision", "navigation", "accessibility"],
  },
  identity: {
    apiKey: process.env.DAIN_API_KEY,
  },
  tools: [analyzeImageConfig],
});

dainService.startNode({ port: 2022 }).then(() => {
  console.log("DAIN Service is running on version 1.0.0");
  console.log("Indoor Navigation Assistant is running on port 2022");
});


