"use client";

import { Children, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


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
                <section className="chat-scrollbar flex-1 space-y-4 overflow-y-auto p-5 pb-24 md:pb-5">
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


                                {isUser ? (
                                    <p className="whitespace-pre-wrap text-sm leading-6 text-white">
                                        {message.content}
                                    </p>
                                ) : (
                                    <div className="text-sm leading-6 text-gray-800 dark:text-gray-200">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({ children }) => (
                                                    <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                                                        {children}
                                                    </h1>
                                                ),

                                                h2: ({ children }) => (
                                                    <h2 className="mb-3 mt-5 text-xl font-bold text-gray-900 first:mt-0 dark:text-white">
                                                        {children}
                                                    </h2>
                                                ),

                                                h3: ({ children }) => (
                                                    <h3 className="mb-2 mt-4 text-lg font-semibold text-gray-900 first:mt-0 dark:text-white">
                                                        {children}
                                                    </h3>
                                                ),

                                                p: ({ children }) => (
                                                    <p className="mb-3 last:mb-0">
                                                        {children}
                                                    </p>
                                                ),

                                                ul: ({ children }) => (
                                                    <ul className="mb-3 ml-5 list-disc space-y-1 last:mb-0">
                                                        {children}
                                                    </ul>
                                                ),

                                                ol: ({ children }) => (
                                                    <ol className="mb-3 ml-5 list-decimal space-y-1 last:mb-0">
                                                        {children}
                                                    </ol>
                                                ),

                                                li: ({ children }) => (
                                                    <li className="pl-1">
                                                        {children}
                                                    </li>
                                                ),

                                                strong: ({ children }) => (
                                                    <strong className="font-semibold text-gray-900 dark:text-white">
                                                        {children}
                                                    </strong>
                                                ),

                                                em: ({ children }) => (
                                                    <em className="italic">
                                                        {children}
                                                    </em>
                                                ),

                                                blockquote: ({ children }) => (
                                                    <blockquote className="my-4 border-l-4 border-green-500 pl-4 italic text-gray-600 dark:text-gray-400">
                                                        {children}
                                                    </blockquote>
                                                ),

                                                hr: () => (
                                                    <hr className="my-5 border-gray-200 dark:border-gray-700" />
                                                ),

                                                a: ({ href, children }) => (
                                                    <a
                                                        href={href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-medium text-green-600 underline decoration-green-500/40 underline-offset-2 transition hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                                    >
                                                        {children}
                                                    </a>
                                                ),

                                                table: ({ children }) => (
                                                    <div className="my-4 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
                                                        <table className="w-full min-w-max border-collapse text-left text-sm">
                                                            {children}
                                                        </table>
                                                    </div>
                                                ),

                                                thead: ({ children }) => (
                                                    <thead className="bg-gray-100 dark:bg-gray-700/20">
                                                        {children}
                                                    </thead>
                                                ),

                                                tbody: ({ children }) => (
                                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600/70">
                                                        {children}
                                                    </tbody>
                                                ),

                                                tr: ({ children }) => (
                                                    <tr>
                                                        {children}
                                                    </tr>
                                                ),

                                                th: ({ children }) => (
                                                    <th className="whitespace-nowrap border-b border-r border-gray-200 px-4 py-3 font-semibold text-gray-900 dark:border-gray-700 dark:text-white">
                                                        {children}
                                                    </th>
                                                ),

                                                td: ({ children }) => (
                                                    <td className="border-b border-r border-gray-100 px-4 py-3 text-gray-700 dark:border-gray-600/70 dark:text-gray-300">
                                                        {children}
                                                    </td>
                                                ),

                                                del: ({ children }) => (
                                                    <del className="text-gray-500 dark:text-gray-500">
                                                        {children}
                                                    </del>
                                                ),
                                            }}
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {isLoading && (
                        <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-gray-100 px-4 py-3 dark:bg-gray-800">
                            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
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