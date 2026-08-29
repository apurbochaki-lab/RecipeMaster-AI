"use client";

import { useEffect, useRef, useState } from "react";

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
    const chatEndRef = useRef(null);

    // নতুন মেসেজ আসলে নিচে স্ক্রল করার জন্য
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

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
        setIsLoading(true);  // Thinking...

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

    // মেসেঞ্জার ব্রাউজারে ইনপুট ফোকাস হলে কিবোর্ডের উপরে ভিউ আনার জন্য
    const handleInputFocus = (e) => {
        setTimeout(() => {
            e.target.scrollIntoView({ block: "end", behavior: "smooth" });
            scrollToBottom();
        }, 300);
    };

    return (
        <main className="min-h-[100dvh] bg-gray-100 transition-colors dark:bg-gray-950 md:p-4">
            <div className="mx-auto flex h-[100dvh] max-w-3xl flex-col bg-white shadow-lg dark:bg-gray-900 md:h-[90dvh] md:rounded-2xl md:overflow-hidden">

                {/* Header - Fixed/Sticky Top */}
                <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 px-5 py-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        🤖 RecipeMaster AI
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Your personal food recipe assistant
                    </p>
                </header>

                {/* Chat Area - Flexible Scroll Container */}
                <section className="flex-1 space-y-4 overflow-y-auto p-5 pb-24 md:pb-5">
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
                                {!isUser && message?.model && (
                                    <p className="pb-3 font-semibold text-amber-300/50">
                                        {message?.model}
                                        <span className="mx-1.5 text-white/50">|</span>
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

                    {isLoading && (
                        <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-gray-100 px-4 py-3 dark:bg-gray-800">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Thinking...
                            </p>
                        </div>
                    )}

                    {/* অটো স্ক্রল এর জন্য ডামি রেফারেন্স */}
                    <div ref={chatEndRef} />
                </section>

                {/* Input Area - Sticky Bottom for In-App Browsers */}
                <footer className="sticky bottom-0 z-20 border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={handleInputFocus}
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