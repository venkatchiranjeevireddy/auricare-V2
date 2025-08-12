import { Helmet } from "react-helmet-async";

const Appointments = () => {
  const canonical = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>Appointments & Teletherapy — AuriCare</title>
        <meta name="description" content="Book sessions, manage calendar, and prepare for secure video calls." />
        {canonical && <link rel="canonical" href={canonical} />}
      </Helmet>
      <h1 className="text-3xl font-heading font-semibold">Appointments & Teletherapy</h1>
      <p className="mt-3 text-muted-foreground max-w-3xl">Connect with therapists, manage schedules, and share notes. Video calling integration and reminders coming soon.</p>
      <div className="mt-6 rounded-lg border p-6 bg-card">
        <p className="text-sm text-muted-foreground">Calendar integration and video calling will appear here. For now, use the Contact page to reach us or schedule manually.</p>
      </div>
    </main>
  );
};

export default Appointments;
