import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";

const articles = [
  { title: 'Visual schedules: getting started', type: 'Article' },
  { title: 'Breathing exercises for calming', type: 'Video' },
  { title: 'Evidence summary: social stories', type: 'Paper' },
];

const Resources = () => {
  const canonical = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>Resources — AuriCare Library</title>
        <meta name="description" content="Curated articles, videos, and research papers for autism support and learning." />
        {canonical && <link rel="canonical" href={canonical} />}
      </Helmet>
      <h1 className="text-3xl font-heading font-semibold">Resources</h1>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <Card key={a.title}>
            <CardContent className="pt-6">
              <span className="text-xs rounded-full border px-2 py-1 text-muted-foreground">{a.type}</span>
              <h2 className="mt-3 text-lg font-medium">{a.title}</h2>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default Resources;
