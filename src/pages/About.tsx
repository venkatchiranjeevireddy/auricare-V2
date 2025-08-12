import { Helmet } from "react-helmet-async";

const About = () => {
  const canonical = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>About AuriCare — Mission & Privacy</title>
        <meta name="description" content="Learn about AuriCare's mission, values, and commitment to privacy and accessibility." />
        {canonical && <link rel="canonical" href={canonical} />}
      </Helmet>
      <h1 className="text-3xl font-heading font-semibold">Our Mission</h1>
      <p className="mt-3 text-muted-foreground max-w-3xl">AuriCare is a calm, trustworthy platform designed with clinicians and families to make autism support accessible, data‑driven, and compassionate. We prioritize accessibility (WCAG 2.1 AA), privacy, and inclusive design.</p>
      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <article className="p-6 rounded-lg border bg-card">
          <h2 className="font-medium text-xl">Values</h2>
          <ul className="mt-3 list-disc pl-5 text-muted-foreground space-y-1">
            <li>Empathy & respect</li>
            <li>Evidence‑based tools</li>
            <li>Accessibility by default</li>
            <li>Privacy and data minimization</li>
          </ul>
        </article>
        <article className="p-6 rounded-lg border bg-card">
          <h2 className="font-medium text-xl">Data Privacy</h2>
          <p className="mt-2 text-muted-foreground">We are building toward HIPAA/GDPR readiness with role‑based permissions, clear consent flows, and secure storage. Sensitive features remain gated by roles.</p>
        </article>
      </section>
    </main>
  );
};

export default About;
