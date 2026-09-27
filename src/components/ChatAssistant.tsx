'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import { MessageCircle, SendHorizontal, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const markdownClass =
    '[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1 first:[&_p]:mt-0 last:[&_p]:mb-0 [&_strong]:font-semibold [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-0.5 [&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold';

export default function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat() as any;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div data-print="hide" className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
            {isOpen && (
                <div
                    role="dialog"
                    aria-label="Khanra Travel AI assistant"
                    className="flex h-[min(34rem,calc(100dvh-7rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl ring-1 ring-gold/20 animate-in fade-in-0 slide-in-from-bottom-4 sm:w-96"
                >
                    <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-primary via-primary to-maroon px-4 py-3 text-primary-foreground">
                        <div className="flex items-center gap-2.5">
                            <span className="grid size-8 place-items-center rounded-full bg-white/20">
                                <Sparkles className="size-4" />
                            </span>
                            <div className="leading-tight">
                                <h3 className="font-heading text-base font-semibold">Khanra Travel AI</h3>
                                <p className="text-xs opacity-85">Your Tirth Yatra guide</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Close chat"
                            className="text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="size-5" />
                        </Button>
                    </div>

                    <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-background/60 p-4 text-sm leading-relaxed">
                        {messages.length === 0 && (
                            <div className={cn('max-w-[85%] self-start rounded-2xl rounded-bl-sm border bg-card px-3.5 py-2.5', markdownClass)}>
                                <ReactMarkdown>
                                    {`Jai Jagannath! 🙏 I'm your Khanra Travel Assistant. I can help you plan your Tirth Yatra. Try asking "Plan a 5-day round trip from Bangalore", "Which temples can I visit in West Bengal?" or "Does sravanbelgola have dharmshala / bhojanshala?"`}
                                </ReactMarkdown>
                            </div>
                        )}
                        {messages.map((m: any) => (
                            <div
                                key={m.id}
                                className={cn(
                                    'max-w-[85%] rounded-2xl px-3.5 py-2.5 break-words',
                                    m.role === 'user'
                                        ? 'self-end rounded-br-sm bg-primary text-primary-foreground'
                                        : cn('self-start rounded-bl-sm border bg-card', markdownClass)
                                )}
                            >
                                {m.role === 'user' ? (
                                    m.content
                                ) : (
                                    <ReactMarkdown>{m.content}</ReactMarkdown>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-center gap-2 self-start text-xs text-muted-foreground">
                                <span className="flex gap-1">
                                    <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                                    <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                                    <span className="size-1.5 animate-bounce rounded-full bg-primary" />
                                </span>
                                AI is thinking...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t bg-card p-3">
                        <Input
                            className="h-10 flex-1 rounded-full px-4"
                            value={input}
                            placeholder="Ask about Tirths or routes..."
                            onChange={handleInputChange}
                            aria-label="Message"
                        />
                        <Button
                            type="submit"
                            size="icon-lg"
                            className="size-10 rounded-full"
                            aria-label="Send message"
                            disabled={isLoading || !(input || '').trim()}
                        >
                            <SendHorizontal className="size-4" />
                        </Button>
                    </form>
                </div>
            )}

            <button
                type="button"
                aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-primary to-maroon text-primary-foreground shadow-lg ring-4 ring-gold/25 transition hover:scale-105 hover:shadow-xl focus-visible:ring-ring/60 focus-visible:outline-none"
            >
                {isOpen ? <X className="size-6" /> : <MessageCircle className="size-6" />}
            </button>
        </div>
    );
}
