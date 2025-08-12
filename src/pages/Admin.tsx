import { Helmet } from "react-helmet-async";

const Admin = () => {
  const canonical = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>Admin Dashboard — AuriCare</title>
        <meta name="description" content="Admin overview: user stats, moderation queue, chatbot usage metrics (wireframe)." />
        {canonical && <link rel="canonical" href={canonical} />}
      </Helmet>
      <h1 className="text-3xl font-heading font-semibold">Admin Dashboard (Wireframe)</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-6 bg-card">
          <h2 className="font-medium">User stats</h2>
          <p className="text-sm text-muted-foreground">Total users, active families, therapists</p>
        </div>
        <div className="rounded-lg border p-6 bg-card">
          <h2 className="font-medium">Moderation queue</h2>
          <p className="text-sm text-muted-foreground">Flagged community posts</p>
        </div>
        <div className="rounded-lg border p-6 bg-card">
          <h2 className="font-medium">Chatbot usage</h2>
          <p className="text-sm text-muted-foreground">Sessions, top intents</p>
        </div>
      </div>
    </main>
  );
};

export default Admin;
