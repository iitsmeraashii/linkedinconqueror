import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  niche: string;
  targetPersona: string;
}

interface Source {
  name: string;
  url: string;
  description: string;
  type: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const geminiKey = Deno.env.get("GEMINI_API_KEY");

    if (!geminiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "GEMINI_API_KEY not configured"
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { niche, targetPersona }: RequestBody = await req.json();

    if (!niche || !targetPersona) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing niche or targetPersona"
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const prompt = `You are a content discovery assistant. Based on the niche "${niche}" and target persona "${targetPersona}", provide 12 highly relevant and popular content sources.

For each source, provide:
1. name - The exact name of the website, blog, YouTube channel, or creator
2. url - The full URL (must be a real, working URL)
3. description - A one-line description (max 100 characters)
4. type - One of: Website, Blog, YouTube, LinkedIn, Newsletter, Podcast

Provide sources that are:
- Actually popular and well-known in this niche
- Actively updated and relevant
- Trusted by the target persona
- Mix of different types (websites, blogs, YouTube channels, LinkedIn creators)

Respond ONLY with a valid JSON array in this exact format:
[
  {
    "name": "Example Blog",
    "url": "https://example.com",
    "description": "Leading insights on topic",
    "type": "Blog"
  }
]

Do not include any other text, just the JSON array.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Gemini API error",
          details: data
        }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    let sources: Source[] = [];
    try {
      const jsonMatch = generatedText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        sources = JSON.parse(jsonMatch[0]);
      } else {
        sources = JSON.parse(generatedText);
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", generatedText);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to parse AI response",
          rawResponse: generatedText
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        sources: sources
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Server error",
        message: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});