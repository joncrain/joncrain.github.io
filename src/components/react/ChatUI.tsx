import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

const SUGGESTED_QUESTIONS = [
	"What does Jon do at Unity?",
	"What technologies does Jon work with?",
	"Tell me about Jon's open source work",
	"What conferences has Jon spoken at?",
];

export default function ChatUI() {
	const { messages, sendMessage, status, error, stop } = useChat({
		transport: new DefaultChatTransport({ api: "/api/chat" }),
	});
	const [input, setInput] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const isLoading = status === "submitted" || status === "streaming";

	const scrollToBottom = () => {
		scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll on any message change
	useEffect(scrollToBottom, [messages]);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleSubmit = (text: string) => {
		const trimmed = text.trim();
		if (!trimmed || isLoading) return;
		sendMessage({ text: trimmed });
		setInput("");
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(input);
		}
	};

	return (
		<div className="flex flex-col h-[80vh] max-w-3xl mx-auto w-full">
			<div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
				{messages.length === 0 ? (
					<EmptyState onSelect={handleSubmit} />
				) : (
					<div className="flex flex-col gap-6">
						{messages.map((message) => (
							<MessageBubble key={message.id} message={message} />
						))}
						{status === "submitted" && (
							<div className="flex gap-3">
								<Avatar variant="assistant" />
								<div className="flex items-center gap-1.5 pt-1">
									<span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
									<span
										className="w-2 h-2 rounded-full bg-accent animate-pulse"
										style={{ animationDelay: "0.2s" }}
									/>
									<span
										className="w-2 h-2 rounded-full bg-accent animate-pulse"
										style={{ animationDelay: "0.4s" }}
									/>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{error && (
				<div className="mx-4 mb-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
					Something went wrong. Please try again.
				</div>
			)}

			<div className="border-t border-border px-4 py-4">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmit(input);
					}}
					className="relative flex items-end gap-2 rounded-xl bg-muted border border-border focus-within:border-accent/50 transition-colors"
				>
					<textarea
						ref={inputRef}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						disabled={status !== "ready" && status !== "error"}
						placeholder="Ask about Jon's career..."
						rows={1}
						className="flex-1 resize-none bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none text-sm max-h-32 overflow-y-auto"
						style={{ minHeight: "44px" }}
						onInput={(e) => {
							const target = e.target as HTMLTextAreaElement;
							target.style.height = "auto";
							target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
						}}
					/>
					{isLoading ? (
						<button
							type="button"
							onClick={() => stop()}
							className="m-1.5 p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
							aria-label="Stop generating"
						>
							<StopIcon />
						</button>
					) : (
						<button
							type="submit"
							disabled={!input.trim()}
							className="m-1.5 p-2 rounded-lg bg-accent text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent/80 transition-colors"
							aria-label="Send message"
						>
							<SendIcon />
						</button>
					)}
				</form>
				<p className="text-center text-xs text-muted-foreground mt-2">
					Powered by Google Gemini. Only answers questions about Jon's
					professional career.
				</p>
			</div>
		</div>
	);
}

function EmptyState({ onSelect }: { onSelect: (text: string) => void }) {
	return (
		<div className="flex flex-col items-center justify-center h-full gap-8">
			<div className="text-center">
				<div className="text-4xl mb-4">&#128172;</div>
				<h2 className="text-2xl font-bold text-accent-light mb-2">
					joncr<span className="text-foreground">ai</span>n
				</h2>
				<p className="text-muted-foreground max-w-md">
					I can answer questions about Jon's professional experience, technical
					skills, projects, and career history.
				</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
				{SUGGESTED_QUESTIONS.map((q) => (
					<button
						key={q}
						type="button"
						onClick={() => onSelect(q)}
						className="text-left px-4 py-3 rounded-xl border border-border bg-card hover:border-accent/50 hover:bg-muted transition-all text-sm text-muted-foreground hover:text-foreground"
					>
						{q}
					</button>
				))}
			</div>
		</div>
	);
}

function MessageBubble({
	message,
}: { message: { id: string; role: string; parts: Array<{ type: string; text?: string }> } }) {
	const isUser = message.role === "user";

	return (
		<div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
			<Avatar variant={message.role} />
			<div
				className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
					isUser
						? "bg-accent text-white rounded-br-md"
						: "bg-card border border-border text-card-foreground rounded-bl-md"
				}`}
			>
			{message.parts.map((part) =>
				part.type === "text" ? (
					<span key={part.text} className="whitespace-pre-wrap">
						{part.text}
					</span>
				) : null,
			)}
			</div>
		</div>
	);
}

function Avatar({ variant }: { variant: string }) {
	const isUser = variant === "user";
	return (
		<div
			className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
				isUser
					? "bg-accent/20 text-accent"
					: "bg-accent-light/20 text-accent-light"
			}`}
		>
			{isUser ? "You" : "AI"}
		</div>
	);
}

function SendIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<title>Send</title>
			<path d="M22 2L11 13" />
			<path d="M22 2L15 22L11 13L2 9L22 2Z" />
		</svg>
	);
}

function StopIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
		>
			<title>Stop</title>
			<rect x="6" y="6" width="12" height="12" rx="2" />
		</svg>
	);
}
