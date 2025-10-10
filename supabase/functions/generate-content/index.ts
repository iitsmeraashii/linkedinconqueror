import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const FORMAT_INSTRUCTIONS: Record<string, string> = {
  'text': 'Create a compelling LinkedIn text post. Use short, punchy sentences. Include line breaks for readability. Add relevant emojis sparingly. Keep it conversational and authentic.',
  'image-text': 'Create text for an image post. Write a brief caption (2-3 sentences) that complements the visual. Include a clear call-to-action. Keep it concise and impactful.',
  'carousel': 'Create a carousel post with 5-7 slides. For each slide, provide a title and 2-3 bullet points. Structure it as: [Slide 1] Title | Point 1 | Point 2. Make each slide self-contained but part of a cohesive story.',
  'poll': 'Create a poll post. Write an engaging question, then provide 4 poll options. Add context explaining why this matters to your audience. Include what insights the poll will reveal.',
  'short-video': 'Write a 45-60 second video script. Include: Hook (first 3 seconds), Main points (3-4 key ideas), Call-to-action. Use conversational language. Mark visual cues in [brackets].',
  'long-video': 'Write a 2-3 minute video script. Structure: Strong hook, Problem statement, Solution/insights (3-5 points), Examples, Call-to-action. Include [visual cues] and timing markers.',
  'article': 'Write a LinkedIn article/newsletter format. Include: Compelling headline, Brief intro, 3-4 main sections with subheadings, Bullet points or numbered lists, Strong conclusion with takeaway.',
  'thread': 'Create a multi-post thread (5-7 posts). Number each post. Start with a hook post. Each subsequent post should expand on one key idea. End with a summary and CTA. Keep each post under 200 characters.',
  'quote': 'Create a quote card post. Write a powerful, original quote (1-2 sentences max) that encapsulates the main idea. Add a brief context paragraph explaining the quote\'s significance.',
  'case-study': 'Write a case study snapshot. Structure: Problem, Approach, Key actions (2-3), Result/outcome, Lesson learned. Use specific details. Keep it scannable with clear sections.',
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { hook, why_it_works, format, niche, targetPersona } = await req.json();

    if (!hook || !why_it_works || !format || !niche || !targetPersona) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

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

    const formatInstruction = FORMAT_INSTRUCTIONS[format] || FORMAT_INSTRUCTIONS['text'];

    const prompt = `You are a LinkedIn content creator for ${niche} professionals targeting ${targetPersona}.

Content Idea Hook: ${hook}
Why It Works: ${why_it_works}

Format: ${format}
${formatInstruction}

Create engaging, human-like content based on this idea. Use short sentences. Be conversational. Sound authentic, not robotic. Make it practical and actionable for ${targetPersona}.

Write the complete ${format} content now:`;

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
            temperature: 0.8,
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
    const generatedContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!generatedContent) {
      return new Response(
        JSON.stringify({ error: "No content generated" }),
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
        content: generatedContent,
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