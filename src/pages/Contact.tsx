import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const canonical = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>Contact & Emergency — AuriCare</title>
        <meta name="description" content="Reach AuriCare support or access emergency resources with one-tap help." />
        {canonical && <link rel="canonical" href={canonical} />}
      </Helmet>
      <h1 className="text-3xl font-heading font-semibold">Contact & Emergency</h1>
      <p className="mt-2 text-muted-foreground">For emergencies, call your local emergency number immediately.</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a className="underline story-link" href="mailto:support@auricare.example">support@auricare.example</a>
        <Button variant="destructive" onClick={() => toast({ title: 'Emergency', description: 'If you are in danger, call your local emergency number now.' })}>Emergency Help</Button>
      </div>
    </main>
  );
};

export default Contact;
