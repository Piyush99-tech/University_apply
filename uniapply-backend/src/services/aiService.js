import fs from "fs";
import OpenAI from "openai";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Verify a document using AI.
 * @param {string} filePath - Path to the uploaded file.
 * @param {string} mimeType - MIME type of the file.
 * @param {string} docType - The expected document type (e.g., "TRANSCRIPT", "ID_PROOF").
 * @returns {Promise<{valid: boolean, confidence: number, reason: string}>}
 */
export async function verifyDocument(filePath, mimeType, docType) {
    try {
        let content = "";
        let isImage = false;

        if (mimeType === "application/pdf") {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            content = data.text.substring(0, 3000); // Limit context
        } else if (mimeType.startsWith("image/")) {
            isImage = true;
            const dataBuffer = fs.readFileSync(filePath);
            content = dataBuffer.toString("base64");
        } else {
            return { valid: false, reason: "Unsupported file type", confidence: 0 };
        }

        let response;

        if (isImage) {
            response = await openai.chat.completions.create({
                model: "gpt-4o-mini", // Cost-effective vision capable model
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: `Verify if this image is a valid document of type: ${docType}. Return JSON with keys: valid (boolean), confidence (0-1), reason (short string).` },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:${mimeType};base64,${content}`,
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 300,
            });
        } else {
            response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a document verification AI. Output strictly valid JSON." },
                    { role: "user", content: `Verify if the following text content represents a valid ${docType}.\n\nContent Preview:\n${content}\n\nReturn strictly JSON: { "valid": boolean, "confidence": number, "reason": "string" }` }
                ],
                response_format: { type: "json_object" },
            });
        }

        const resultText = response.choices[0].message.content;
        const result = JSON.parse(resultText);

        return {
            valid: result.valid,
            confidence: result.confidence,
            reason: result.reason,
        };

    } catch (error) {
        console.error("AI Verification Error:", error);
        // Fail safe: accept but flag error, or reject? Let's return inconclusive.
        return { valid: false, confidence: 0, reason: "AI Verification Failed: " + error.message };
    }
}
