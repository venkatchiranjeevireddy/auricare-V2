import { Helmet } from "react-helmet-async";

const Community = () => {
  const canonical = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>Community & Forums — AuriCare</title>
        <meta name="description" content="Join moderated groups and discuss caregiving, therapies, and tools with peers." />
        {canonical && <link rel="canonical" href={canonical} />}
      </Helmet>
      <h1 className="text-3xl font-heading font-semibold">Community & Forums</h1>
      <p className="mt-2 text-muted-foreground">Threaded discussions with topic tags and private groups. Moderation tools ensure a safe space.</p>
      <div className="mt-6 rounded-lg border p-6 bg-card">
        <p className="text-sm text-muted-foreground">Forum threads will be available here. We’ll add posting and moderation in the next iteration.</p>
      </div>
    </main>
  );
};

export default Community;
