export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-4 transition-colors dark:bg-gray-950">
      <div className="mx-auto flex min-h-[90vh] max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-900">

        {/* Header */}
        <header className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            🤖 RecipeMaster AI
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your personal food recipe assistant
          </p>
        </header>

        {/* Chat Area */}
        <section className="flex-1 space-y-4 overflow-y-auto p-5">

          {/* AI Message */}
          <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-gray-100 px-4 py-3 dark:bg-gray-800">
            <p className="text-sm leading-6 text-gray-800 dark:text-gray-200">
              👋 Hello! Tell me what ingredients you have.
            </p>
          </div>

          {/* User Message */}
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-green-500 px-4 py-3 text-white">
            <p className="text-sm leading-6">
              Amar kache dim, alu ar chal ache.
            </p>
          </div>

          {/* AI Message */}
          <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-gray-100 px-4 py-3 dark:bg-gray-800">
            <p className="text-sm leading-6 text-gray-800 dark:text-gray-200">
              You can make a delicious khichuri!
            </p>
          </div>

        </section>

        {/* Input Area */}
        <footer className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="flex gap-2">

            <input
              type="text"
              placeholder="Ask a recipe..."
              className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />

            <button
              type="button"
              className="shrink-0 rounded-xl bg-green-500 px-5 py-3 text-white transition hover:bg-green-600"
            >
              ➤
            </button>

          </div>
        </footer>

      </div>
    </main>
  );
}