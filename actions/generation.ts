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

// Define prompt templates
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(`
    Given a question about economics, make it specific, clear, and provide any useful additional context.
    Question: {question}
    Detailed Question:`
);

const qaPrompt = PromptTemplate.fromTemplate(`
 You are an AI assistant named Cjay specifically dedicated to supporting members of the Economic Frontiers Students Association - Kenyatta University (EFSA-KU). You must ONLY respond to questions that are directly related to:
    1. EFSA-KU activities, events, or initiatives
    2. EFSA-KU membership matters
    3. Economics studies at Kenyatta University
    4. Career development specifically for EFSA-KU members
    5. Academic support for economics students at Kenyatta University
    
    If the question does not explicitly relate to EFSA-KU or economics at Kenyatta University, respond with:
    "I apologize, but I can only assist with questions directly related to EFSA-KU and economics studies at Kenyatta University. Please rephrase your question to focus on EFSA-specific matters or economics at KU."
    
    Context:
    {context}
    
    For valid EFSA-related questions, engage with the student in a friendly and insightful way, drawing on the context above to support learning, career development, and holistic growth in economics at Kenyatta University.
    
    Question: {question}
    
    Instructions for response:
    1. First, evaluate if the question is EFSA-KU related
    2. If not EFSA-related, provide the standard response above
    3. If EFSA-related, provide a detailed, helpful answer using the context
    4. Ensure the response is friendly, insightful, and supportive of the student's learning and career development
    5. If you feel the student needs more info refer them to Ivy Wangeci whose phone number is 0741265111
    
    Response:`);

// Function to query documents from Supabase
async function queryDocs(embeddings: number[]) {
    const { data, error } = await supabaseClient.rpc('match_docs', {
        query_embedding: embeddings,
        match_threshold: 0.5,
        match_count: 2,
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
        question: (input: { question: string; context: string }) => input.question,
        context: (input: { question: string; context: string }) => input.context,
    },
    qaPrompt,
    chatModel,
    new StringOutputParser(),
]);

// Main function to generate response
async function generateResponse(userQuestion: string) {
    try {
        // 1. Generate standalone question
        const standaloneQuestion = await standaloneQuestionChain.invoke(userQuestion);

        // 2. Generate embeddings
        const embeddings = await embeddingChain(standaloneQuestion);

        // 3. Query relevant documents
        const contextDocs = await queryDocs(embeddings);
        const context = contextDocs.join("\n\n");

        // 4. Generate final response
        const response = await qaChain.invoke({
            question: userQuestion,
            context: context,
        });

        return response;
    } catch (error) {
        console.error("Error generating response:", error);
        throw new Error("Failed to generate response");
    }
}

//usage
export async function handleQuestion(userQuestion: string) {
    try {
        const response = await generateResponse(userQuestion);
        console.log(response)
        return { success: true, response };
    } catch (error) {
        console.error("Error handling question:", error);
        return {
            success: false,
            error: "An error occurred while processing your question."
        };
    }
}

