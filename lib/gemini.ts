import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

if (!GEMINI_API_KEY) {
    throw new Error('Please define the GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateLeadReport(leadsData: any[]): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a business intelligence analyst. Analyze the following CRM leads data and provide comprehensive insights:

Leads Data:
${JSON.stringify(leadsData, null, 2)}

Please provide:
1. Executive Summary
2. Lead Status Distribution Analysis
3. Revenue Potential Analysis
4. Lead Source Performance
5. Conversion Insights
6. Recommendations for Sales Team

Format the response in a clear, professional manner suitable for a business report.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}
