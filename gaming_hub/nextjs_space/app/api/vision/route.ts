import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function POST(req: NextRequest) {
  try {
    const { systemInstruction, prompt, base64Data, mimeType } = await req.json()
    if (!base64Data || !prompt) {
      return NextResponse.json({ error: 'Missing image or prompt.' }, { status: 400 })
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'AI service is not configured on the server.' }, { status: 500 })
    }

    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gemini-3.8-flash',
        messages: [
          ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
          {
            role: 'user',
            content: [
              { type: 'text', text: `${prompt}\n\nRespond with raw JSON only. Do not include code blocks or markdown.` },
              { type: 'image_url', image_url: { url: `data:${mimeType || 'image/jpeg'};base64,${base64Data}` } },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 4000,
      }),
    })

    if (!res.ok) {
      const detail = await res.text()
      console.error('Vision AI request failed:', res.status, detail)
      if (res.status === 503) {
        return NextResponse.json({ code: 'AI_SERVICE_UNAVAILABLE', error: `AI service is temporarily unavailable. Please try again later.` }, { status: 503 })
      }
      if (res.status === 429 && detail.includes('RESOURCE_EXHAUSTED')) {
        return NextResponse.json({ code: 'AI_CREDITS_EXHAUSTED', error: `AI credits are exhausted. Please try again later.` }, { status: 429 })
      }
      return NextResponse.json({ error: `AI vision request failed (status ${res.status}).` }, { status: 502 })
    }

    const data = await res.json()
    let text: string = data?.choices?.[0]?.message?.content || ''
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim()
    if (!text) {
      return NextResponse.json({ error: 'AI returned an empty response.' }, { status: 502 })
    }
    try {
      return NextResponse.json({ result: JSON.parse(text) })
    } catch {
      console.error('Vision AI returned non-JSON:', text.slice(0, 500))
      return NextResponse.json({ error: 'AI response could not be parsed as JSON.' }, { status: 502 })
    }
  } catch (err) {
    console.error('Vision route error:', err)
    return NextResponse.json({ error: 'Unexpected server error during vision audit.' }, { status: 500 })
  }
}
