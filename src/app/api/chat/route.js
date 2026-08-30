import { SYSTEM_PROMPT } from "@/prompt/recipePrompt";

export const POST = async (request) => {
    try {
        const body = await request.json();  // Messages JSON --> JavaScript Object conversion

        const { messages } = body;  // Destructuring from body

        // Empty array validation
        if (!messages || !Array.isArray(messages)) {
            return Response.json(
                {
                    error: "Messages are required."
                },
                {
                    status: 400,
                }
            );

        };

        // Fetch for OpenRouter AI, Select model & Send user messages
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
            },

            body: JSON.stringify({
                model: "openrouter/free",
                messages: [
                    {
                        role: "system",
                        content: SYSTEM_PROMPT
                    },
                    ...messages
                ]
            })
        });

        const data = await response.json();

        // Response error validation
        if (!response.ok) {
            return Response.json(
                {
                    error: data?.error?.message || "OpenRouter request failed."
                },
                {
                    status: response.status
                }
            );
        };

        return Response.json(data);

    } catch (error) {
        console.error("Chat API error:", error);
        return Response.json(
            { error: "Something went wrong" },
            { status: 500 }
        )
    };


};