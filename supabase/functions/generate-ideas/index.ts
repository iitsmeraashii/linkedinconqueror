import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { url, niche, targetPersona } = await req.json();

    if (!url || !niche || !targetPersona) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: url, niche, targetPersona" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");
    const googleApiKey = Deno.env.get("GOOGLE_API_KEY");

    if (!firecrawlApiKey) {
      return new Response(
        JSON.stringify({ error: "FIRECRAWL_API_KEY not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!googleApiKey) {
      return new Response(
        JSON.stringify({ error: "GOOGLE_API_KEY not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const firecrawlResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${firecrawlApiKey}`,
      },
      body: JSON.stringify({
        url: url,
        formats: ["markdown"],
      }),
    });

    if (!firecrawlResponse.ok) {
      const error = await firecrawlResponse.json();
      return new Response(
        JSON.stringify({ error: "Failed to scrape URL", details: error }),
        {
          status: firecrawlResponse.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const firecrawlData = await firecrawlResponse.json();
    const scrapedContent = firecrawlData.data?.markdown || "";

    if (!scrapedContent) {
      return new Response(
        JSON.stringify({ error: "No content found from URL" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const truncatedContent = scrapedContent.substring(0, 15000);

    const prompt = `You are a LinkedIn content strategist. Based on the following article content, generate 5 unique LinkedIn post ideas tailored for:

Niche: ${niche}
Target Persona: ${targetPersona}

Article Content:
${truncatedContent}

For each idea, provide:
1. A catchy hook (first line)
2. Main concept (2-3 sentences)
3. Key takeaway

Format your response as a JSON array with this structure:
[
  {
    "hook": "...",
    "concept": "...",
    "takeaway": "..."
  }
]

Make sure the ideas are specifically relevant to ${niche} professionals and resonate with ${targetPersona}.`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt,
            }],
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const error = await geminiResponse.json();
      return new Response(
        JSON.stringify({ error: "Failed to generate ideas", details: error }),
        {
          status: geminiResponse.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const geminiData = await geminiResponse.json();
    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let ideas = [];
    try {
      const jsonMatch = generatedText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        ideas = JSON.parse(jsonMatch[0]);
      } else {
        ideas = JSON.parse(generatedText);
      }
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Failed to parse generated ideas", rawResponse: generatedText }),
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
        ideas: ideas,
        sourceUrl: url,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
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