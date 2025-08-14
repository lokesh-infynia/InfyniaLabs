"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Loader2, User } from "lucide-react";
import { handleChat } from "@/app/actions";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const InfinityLogo = () => (
    <svg className="w-5 h-5 text-white" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25,50 C25,30 45,20 60,20 C80,20 100,40 100,50 C100,60 120,80 140,80 C160,80 175,65 175,50 C175,35 160,20 140,20 C120,20 100,40 100,50 C100,60 80,80 60,80 C40,80 25,70 25,50 Z" stroke="url(#g)" strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
        <linearGradient id="g" x1="25" y1="50" x2="175" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="hsl(var(--primary))"/>
            <stop offset="100%" stopColor="hsl(var(--accent))"/>
        </linearGradient>
        </defs>
    </svg>
)

export default function SmartContact() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if(viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await handleChat({ query: input });
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I'm having trouble connecting. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          id="contact-trigger"
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg bg-gradient-to-r from-primary to-accent text-accent-foreground hover:opacity-90 focus:ring-accent"
          aria-label="Open smart contact chat"
        >
          <MessageSquare className="h-8 w-8" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col p-0 bg-background border-border">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="font-headline text-2xl text-foreground">Contact Us</SheetTitle>
          <SheetDescription className="text-white/70">
            Have a question? Our AI assistant is here to help you 24/7.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow p-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : ""
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 border-2 border-primary/50 bg-primary/20 flex items-center justify-center">
                    <AvatarFallback className="bg-transparent">
                      <InfinityLogo />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-xs rounded-lg p-3 text-sm",
                    message.role === "user"
                      ? "bg-gradient-to-r from-primary to-accent text-white"
                      : "bg-white/10 text-white/90"
                  )}
                >
                  {message.content}
                </div>
                 {message.role === "user" && (
                  <Avatar className="h-8 w-8 bg-white/10">
                     <AvatarFallback className="bg-transparent text-white/70">
                      <User className="h-5 w-5"/>
                     </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                 <Avatar className="h-8 w-8 border-2 border-primary/50 bg-primary/20 flex items-center justify-center">
                    <AvatarFallback className="bg-transparent">
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    </AvatarFallback>
                  </Avatar>
                <div className="bg-white/10 p-3 rounded-lg">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-border bg-background">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our products..."
              className="flex-grow bg-white/5 border-white/10 placeholder-white/50"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-gradient-to-r from-primary to-accent">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
