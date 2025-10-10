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
  relevanceReason: string;
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

    const prompt = `You are a content discovery assistant. Given the niche "${niche}" and target persona "${targetPersona}", identify and rank the top 10-12 most relevant content sources for content inspiration.

Your task:
1. Find highly relevant, popular, and actively updated content sources
2. Rank them by relevance to the specific niche and target persona
3. For each source, explain in one short line (max 80 characters) why it's useful for content inspiration

For each source, provide:
- name: The exact name of the website, blog, YouTube channel, or creator
- url: The full URL (must be a real, working URL)
- description: A one-line description showing what they cover
- type: One of: Website, Blog, YouTube, LinkedIn, Newsletter, Podcast
- relevanceReason: One short line explaining why this source is valuable for content inspiration (max 80 characters)

Criteria for ranking:
- Direct relevance to the niche and target persona (highest priority)
- Quality and trustworthiness of content
- Popularity and influence in the space
- Active content production
- Diversity of content types

Respond ONLY with a valid JSON array, ranked from most relevant to least relevant, in this exact format:
[
  {
    "name": "Example Blog",
    "url": "https://example.com",
    "description": "Leading insights on topic",
    "type": "Blog",
    "relevanceReason": "Top authority in the space with daily actionable content"
  }
]

Do not include any other text, just the JSON array with 10-12 sources ranked by relevance.`;

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
            maxOutputTokens: 3072,
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

      sources = sources.slice(0, 15);
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