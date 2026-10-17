import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json(
        {
          error:
            'GEMINI_API_KEY is not configured on the server. To enable real-time Gemini assistance, configure GEMINI_API_KEY in your Vercel Project Environment Variables or .env.local.',
          configured: false,
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { message, language = 'en', category = 'general', earningsContext } = body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    // Limit prompt length to prevent token abuse
    const sanitizedMessage = message.trim().slice(0, 2500);

    const systemInstruction = `
You are KaamSaathi (काम साथी), a supportive, respectful, and strictly honest AI companion designed for gig workers in India (food/grocery delivery partners like Zomato/Swiggy/Zepto/Blinkit, cab/auto drivers like Uber/Ola/Rapido, and daily-wage/construction workers).

Selected Language: ${language} (en = English, hi = Pure Hindi in Devanagari, hinglish = Conversational everyday Hindi in Latin/English script).
Always reply in the selected language. Use clear, accessible, respectful language that any worker can easily understand. Avoid bureaucratic jargon.

CRITICAL TRUTHFULNESS & ANTI-HALLUCINATION RULES:
1. ALWAYS distinguish general practical advice from verified official facts.
2. NEVER invent or hallucinate scheme names, cash grant amounts, eligibility rules, enrollment deadlines, legal guarantees, or official citations.
3. If asked about worker rights or welfare schemes (such as e-Shram, PM-SYM, BOCW cess boards, or Ayushman Bharat PM-JAY):
   - Provide accurate known frameworks, but clearly disclose uncertainty regarding state-specific rules.
   - Always tell the worker to verify details directly via official government portals (e.g. eshram.gov.in, labour.gov.in, or nearest Common Service Centre / CSC Jan Seva Kendra).
4. For accidents, severe threats, or road emergencies:
   - Provide immediate practical safety steps (pulling over, documenting vehicle numbers, seeking medical attention).
   - Firmly emphasize calling official emergency services (Dial 112 National Emergency, 108 Ambulance, 100 Police). KaamSaathi is never a substitute for emergency services.
5. Authoritative Earnings:
   - Remind the user that authoritative earnings and hourly rates are computed deterministically by the KaamSaathi Earnings Tracker. Do not attempt to calculate fake financial audits.
6. When analyzing documents pasted by the worker:
   - Analyze ONLY what the user actually provided.
   - Break down tricky clauses (like unfair cancellation penalties or payout deductions) into plain terms and provide an actionable next-step checklist.
`.trim();

    let userPrompt = sanitizedMessage;
    if (earningsContext && typeof earningsContext === 'object') {
      userPrompt += `\n\n[Context: The worker's current verified tracker summary shows: Total Gross ₹${earningsContext.totalGross || 0}, Total Expenses ₹${earningsContext.totalExpenses || 0}, Net ₹${earningsContext.netEarnings || 0}, Total Hours: ${earningsContext.totalHours || 0} hrs. Please refer to these user-entered facts accurately without recalculating.]`;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Use supported fast and reliable Gemini model
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemInstruction}\n\nUser Question:\n${userPrompt}` }
          ]
        }
      ]
    });

    const reply = response.text || 'Unable to generate response from Gemini API. Please try again.';

    return NextResponse.json({
      reply,
      configured: true,
      model: 'gemini-3.8-flash',
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Gemini API request failed.';
    return NextResponse.json(
      {
        error: `Gemini API Error: ${errorMsg}. Please check that your GEMINI_API_KEY is valid and has active quota.`,
        configured: true,
      },
      { status: 502 }
    );
  }
}
