import { AzureKeyCredential } from '@azure/core-auth';
import { OpenAIClient } from '@azure/openai';
import OpenAI from "openai";
import axios from 'axios';

export const getOnYourData = async (message: string): Promise<any[]> => {
  return new Promise(async (resolve, reject) => {
    const endpoint = process.env.AZURE_OPENAI_API_ENDPOINT!;
    const azureApiKey = process.env.AZURE_OPENAI_API_KEY!;
    const deploymentId = process.env.AZURE_OPENAI_API_DEPLOYMENT_ID!;

    // Azure 固有: API バージョンを必ずクエリに付与
    const apiVersion = "2024-02-15-preview";
    
    console.log('🚀 ~ On your data start ~ 🚀')

    const apiUrl = '';

    const requestData = {
      messages: [
        { role: 'user', content: message }
      ]
    }

    const res = await axios.post(apiUrl, requestData)
    console.log("🚀 ~ returnnewPromise ~ res:", res.data)

    const content = `# 質問\n${message}\n# 回答\n${res.data}\n`

    const messages: any[] = [
      {role: 'system', content: 'You are a helpful assistant'}, {role: 'user', content}
    ]
    // ===== 公式 SDK で Azure エンドポイントに接続 ===========
    const openai = new OpenAI({
      baseURL: `${endpoint}/openai/deployments/${deploymentId}`,
      apiKey: azureApiKey,
      defaultHeaders:  { "api-key": azureApiKey },   // Azure では Authorization ヘッダーではなく api-key
      defaultQuery:    { "api-version": apiVersion } // ?api-version=...
    });
    //const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));

    // ===== 5) Chat Completions =================================
    const result = await openai.chat.completions.create({
      model: deploymentId,      // Azure では model の代わりに「デプロイ名」を指定
      messages,
      stream: false
    });
    //const result = await client.getChatCompletions(deploymentId, messages);
    resolve(result.choices);

  })
}
