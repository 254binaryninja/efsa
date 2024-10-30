'use server'

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { readFileSync } from 'fs';
import {supabaseClient} from "@/types/supabase-client";
import {genAI} from "@/types/genAI";

const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

function readTextFileSync(filePath: string): string {
    try {
        return readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

async function saveToSupabase(embeddingData:any) {
    try {
        console.log('Saving embeddings to Supabase...');
        const { error } = await supabaseClient.from('handbook').insert(embeddingData);

        if (error) {
            console.error('Error saving to Supabase:', error);// Re-throw the error to handle it at a higher level
        } else {
            console.log('Embeddings saved successfully');
        }
    } catch (error) {
        console.error('Error saving to Supabase:', error);
    }
}


async function saveHandbook (filePath:string) {
    const text = readTextFileSync(filePath)
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize:400,
        chunkOverlap:50,
    })

    const output = await splitter.createDocuments([text])
    const embeddingData = []

    for(const chunk of output) {
      if(chunk && chunk.pageContent) {
          console.log("creating embedding for chunk ",chunk)
          // @ts-ignore
          const result = await model.embedContent([chunk.pageContent])
          embeddingData.push({content:chunk.pageContent,embedding:result.embedding.values})
      }
    }

    await saveToSupabase(embeddingData)
}

saveHandbook('handbook.txt')