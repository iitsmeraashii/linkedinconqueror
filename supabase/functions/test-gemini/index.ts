import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
    const geminiKey = Deno.env.get("GEMINI_API_KEY");

    if (!geminiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "GEMINI_API_KEY not found in environment variables",
          message: "Please add the GEMINI_API_KEY secret to your Supabase project"
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

    const testPrompt = "Say hello in exactly 5 words.";
    
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
              text: testPrompt
            }]
          }]
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Gemini API error",
          details: data,
          statusCode: response.status
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

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return new Response(
      JSON.stringify({
        success: true,
        message: "Gemini API integration is working!",
        testPrompt,
        response: generatedText,
        model: "gemini-2.0-flash-exp"
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