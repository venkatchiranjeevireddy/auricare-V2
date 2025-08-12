import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type Msg = { role: 'user' | 'assistant'; content: string };

const suggestions = [
  'Behavior strategy for transitions',
  'Create a morning routine',
  'Emergency steps for meltdowns',
];

const Chatbot = () => {
  const canonical = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Hi, I’m Auri. How can I help you today? I can suggest routines, behavior strategies, or calming steps.' }
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Msg = { role: 'user', content: input.trim() };
    const reply: Msg = { role: 'assistant', content: 'Here is a gentle, evidence‑informed suggestion. For safety‑critical issues, contact a therapist or emergency services.' };
    setMessages((m) => [...m, userMsg, reply]);
    setInput('');
  };

  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>Ask Auri — Chatbot Demo</title>
        <meta name="description" content="Try Auri — accessible autism support chatbot for caregivers and therapists." />
        {canonical && <link rel="canonical" href={canonical} />}
      </Helmet>
      <h1 className="text-3xl font-heading font-semibold">Auri — Support Chatbot (Demo)</h1>
      <p className="mt-2 text-sm text-muted-foreground">Demo only. Not medical advice. Escalate to human support for emergencies.</p>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
            {messages.map((m, i) => (
              <div key={i} className={`rounded-lg px-4 py-3 border ${m.role === 'assistant' ? 'bg-secondary' : 'bg-card'} animate-fade-in`}>
                <p className="text-sm">{m.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about routines, behavior strategies, or calming steps…"
              onKeyDown={(e) => e.key === 'Enter' && send()}
              aria-label="Chat input"
            />
            <Button onClick={send} variant="glow">Send</Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => setInput(s)} className="text-xs rounded-full border px-3 py-1 text-muted-foreground hover:text-foreground">
                {s}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Chatbot;
