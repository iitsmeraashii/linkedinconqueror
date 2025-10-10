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
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

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

    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
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

    const cleanContent = scrapedContent
      .replace(/\[\[.*?\]\]/g, '')
      .replace(/^(#{1,6}\s.*|---.*|\*\*.*\*\*|Menu|Navigation|Footer|Subscribe|Cookie|Privacy Policy)$/gim, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const scrapedExcerpt = cleanContent.substring(0, 2000);

    const prompt = `Given this content, generate EXACTLY 5 LinkedIn-ready ideas for the ${niche} that resonate with ${targetPersona}. For each, output a 'hook' and a one-line 'why_it_works' tied to the audience's pains/desires. Keep it concise, practical, and non-generic.

Source URL: ${url}
Scraped Excerpt:
${scrapedExcerpt}

Format your response as a JSON array with this exact structure:
[
  {
    "hook": "compelling 1-line LinkedIn hook",
    "why_it_works": "1 sentence explaining why this idea fits the niche and persona"
  }
]

Make sure each idea is specifically tailored to ${niche} professionals and addresses the real needs and desires of ${targetPersona}.`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
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
      let errorMessage = "It looks like the AI Gods are not on your side right now, please try after some time.";

      if (geminiResponse.status === 429 || (error.error && error.error.message && error.error.message.includes("quota"))) {
        errorMessage = "Oops, it seems you've exhausted the number of requests you can make for the day. You can try generating amazing content after sometime.";
      }

      return new Response(
        JSON.stringify({ error: errorMessage, isGeminiError: true }),
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
        error: "We are currently experiencing some issues on our end, we hope to fix them soon.",
        isGeminiError: false
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