import { Helmet } from "react-helmet-async";

const Privacy = () => {
  const canonical = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>Privacy & Compliance — AuriCare</title>
        <meta name="description" content="HIPAA/GDPR notes, consent flows, and role-based access practices at AuriCare." />
        {canonical && <link rel="canonical" href={canonical} />}
      </Helmet>
      <h1 className="text-3xl font-heading font-semibold">Privacy & Compliance</h1>
      <p className="mt-3 text-muted-foreground max-w-3xl">We value your privacy. Our platform is being built with HIPAA/GDPR in mind: role‑based permissions, explicit consent, data minimization, and encryption. We will publish detailed policies as we expand features.</p>
    </main>
  );
};

export default Privacy;
