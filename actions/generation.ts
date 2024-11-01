'use server';

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { supabaseClient } from "@/types/supabase-client";

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Initialize chat model
const chatModel = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    maxOutputTokens: 2048,
});

// Initialize embedding model
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

// Conversation history
const convHistory: { question: string; response: string }[] = [];

// Define prompt templates
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(`
    Given a question about economics, make it specific, clear, and provide any useful additional context.
    Question: {question}
    Detailed Question:
`);

const qaPrompt = PromptTemplate.fromTemplate(`
    You are an AI assistant named Cjay specifically dedicated to supporting members of the Economic Frontiers Students Association - Kenyatta University (EFSA-KU).
    
    Previous Conversation:
    {conversation}
    
    Current Context:
    {context}
    
    Question: {question}
    
    Instructions for response:
    1. First, evaluate if the question is EFSA-KU related.
    2. If not EFSA-related, provide the standard response: "I apologize, but I can only assist with questions directly related to EFSA-KU and economics studies at Kenyatta University."
    3. If EFSA-related, provide a detailed, helpful answer using the context.
    4. Ensure the response is friendly, insightful, and supportive of the student's learning and career development.
    5. If the student needs more info, refer them to Joshua Mogere at 0743651590 one of EFSA's executive members.
    
    Response:
`);

// Function to format conversation history
function formatConversationHistory(history: { question: string; response: string }[]): string {
    return history
        .map(entry => `User: ${entry.question}\nAI: ${entry.response}`)
        .join("\n\n");
}

// Function to query documents from Supabase
async function queryDocs(embeddings: number[]) {
    const { data, error } = await supabaseClient.rpc('match_docs', {
        query_embedding: embeddings,
        match_threshold: 0.7,
        match_count: 3,
    });

    if (error) {
        console.error("Error querying documents:", error);
        return [];
    }

    return data?.map((chunk: any) => chunk.content) || [];
}

// Chain for generating standalone question
const standaloneQuestionChain = RunnableSequence.from([
    {
        question: (input: string) => input,
    },
    standaloneQuestionPrompt,
    chatModel,
    new StringOutputParser(),
]);

// Create embeddings chain
const embeddingChain = async (input: string) => {
    const response = await embeddingModel.embedContent(input);
    return response.embedding.values;
};

// Final QA chain
const qaChain = RunnableSequence.from([
    {
        question: (input: { question: string; context: string; conversation: string }) => input.question,
        context: (input: { question: string; context: string; conversation: string }) => input.context,
        conversation: (input: { question: string; context: string; conversation: string }) => input.conversation,
    },
    qaPrompt,
    chatModel,
    new StringOutputParser(),
]);

// Main function to generate response with conversation history
async function generateResponse(userQuestion: string) {
    try {
        // 1. Generate standalone question
        const standaloneQuestion = await standaloneQuestionChain.invoke(userQuestion);

        // 2. Generate embeddings
        const embeddings = await embeddingChain(standaloneQuestion);

        // 3. Query relevant documents
        const contextDocs = await queryDocs(embeddings);
        const context = contextDocs.join("\n\n");

        // 4. Format conversation history
        const conversation = formatConversationHistory(convHistory);

        // 5. Generate final response
        const response = await qaChain.invoke({
            question: userQuestion,
            context: context,
            conversation: conversation,
        });

        // 6. Update conversation history
        convHistory.push({ question: userQuestion, response });

        return response;
    } catch (error) {
        console.error("Error generating response:", error);
        throw new Error("Failed to generate response");
    }
}

// Usage function to handle incoming questions
export async function handleQuestion(userQuestion: string) {
    try {
        const response = await generateResponse(userQuestion);
        console.log(response);
        return { success: true, response };
    } catch (error) {
        console.error("Error handling question:", error);
        return {
            success: false,
            error: "An error occurred while processing your question."
        };
    }
}
