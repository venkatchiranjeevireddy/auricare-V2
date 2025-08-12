import { Helmet } from "react-helmet-async";
import { CheckCircle2, MessageSquare, CalendarClock, LineChart, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  { icon: MessageSquare, title: 'AI Chatbot — Auri', desc: 'Safe multi‑turn Q&A for caregivers and therapists with suggested prompts.' },
  { icon: LineChart, title: 'Therapy & Progress Tracker', desc: 'Add sessions, set goals, and visualize milestones per domain.' },
  { icon: CalendarClock, title: 'Daily Visual Scheduler', desc: 'Drag & drop routines with timers and printable cards.' },
  { icon: PlayCircle, title: 'Learning Hub', desc: 'Modules for social stories and interactive exercises with badges.' },
  { icon: CheckCircle2, title: 'Sensory Tools', desc: 'Breathing guides, calming audio, and focus visuals with intensity controls.' },
];

const Features = () => {
  const canonical = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>Features — AuriCare Autism Platform</title>
        <meta name="description" content="Explore AuriCare features: Auri chatbot, therapy tracking, visual scheduler, learning hub, sensory tools." />
        {canonical && <link rel="canonical" href={canonical} />}
      </Helmet>
      <h1 className="text-3xl font-heading font-semibold">Features</h1>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="hover-scale">
            <CardContent className="pt-6">
              <Icon className="size-6 text-primary" />
              <h2 className="mt-3 text-xl font-medium">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default Features;
