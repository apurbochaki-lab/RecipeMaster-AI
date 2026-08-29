"use client";

import { useState } from "react";

export default function Home() {
    const [input, setInput] = useState("");

    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "assistant",
            content: "👋 Hello! Tell me what ingredients you have.",
        },
    ]);

    // Thinking... fallback
    const [isLoading, setIsLoading] = useState(false);

    // When user click send button
    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            role: "user",
            content: input.trim(),
        };

        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true); // Thinking...

        try {
            // Fetch API for send full conversation to AI
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: updatedMessages,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || "Something went wrong.");
            }

            const aiMessage = {
                id: Date.now() + 1,
                role: "assistant",
                content: data.choices[0].message.content,

                // For developing purpose
                model: data.model,
                provider: data.provider,
            };

            setMessages((prevMessages) => [...prevMessages, aiMessage]);
        } catch (error) {
            console.error("Chat error:", error);

            const errorMessage = {
                id: Date.now() + 1,
                role: "assistant",
                content: "Sorry, something went wrong. Please try again.",
            };

            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 p-4 transition-colors dark:bg-gray-950">
            {/* Changed min-h-[90vh] to h-[90vh] for proper chat layout scrolling */}
            <div className="mx-auto flex h-[90vh] max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-900">

                {/* Header - Made Sticky */}
                <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 py-4 dark:bg-gray-900 dark:border-gray-800">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        🤖 RecipeMaster AI
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Your personal food recipe assistant
                    </p>
                </header>

                {/* Chat Area */}
                <section className="flex-1 space-y-4 overflow-y-auto p-5">
                    {messages.map((message) => {
                        const isUser = message.role === "user";

                        return (
                            <div
                                key={message.id}
                                className={`max-w-[85%] rounded-2xl px-4 py-3 ${isUser
                                        ? "ml-auto rounded-tr-md bg-green-500 text-white"
                                        : "rounded-tl-md bg-gray-100 dark:bg-gray-800"
                                    }`}
                            >
                                {/* TODO : Remove this in production */}
                                {!isUser && message?.model && (
                                    <p className="text-amber-300/50 font-semibold pb-3">
                                        {message?.model}
                                        <span className="text-white/50 mx-1.5">|</span>
                                        <span className="text-emerald-400/50">
                                            {message?.provider}
                                        </span>
                                    </p>
                                )}

                                <p
                                    className={`whitespace-pre-wrap text-sm leading-6 ${isUser ? "text-white" : "text-gray-800 dark:text-gray-200"
                                        }`}
                                >
                                    {message.content}
                                </p>
                            </div>
                        );
                    })}

                    {/* Loading */}
                    {isLoading && (
                        <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-gray-100 px-4 py-3 dark:bg-gray-800">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Thinking...
                            </p>
                        </div>
                    )}
                </section>

                {/* Input Area */}
                <footer className="border-t border-gray-200 p-4 dark:border-gray-800">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            placeholder="Ask a recipe..."
                            className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                        />

                        <button
                            type="button"
                            onClick={handleSendMessage}
                            disabled={isLoading}
                            className="shrink-0 rounded-xl bg-green-500 px-5 py-3 text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? "..." : "➤"}
                        </button>
                    </div>
                </footer>
            </div>
        </main>
    );
}