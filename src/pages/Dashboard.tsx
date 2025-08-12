import { Helmet } from "react-helmet-async";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const lineData = [
  { week: 'W1', milestones: 2 },
  { week: 'W2', milestones: 3 },
  { week: 'W3', milestones: 4 },
  { week: 'W4', milestones: 5 },
];
const barData = [
  { domain: 'Communication', score: 60 },
  { domain: 'Social', score: 50 },
  { domain: 'Motor', score: 70 },
  { domain: 'Self-care', score: 55 },
];

const Dashboard = () => {
  const canonical = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>Progress Dashboard — AuriCare</title>
        <meta name="description" content="Visualize therapy milestones and domain scores for your child profile." />
        {canonical && <link rel="canonical" href={canonical} />}
      </Helmet>
      <h1 className="text-3xl font-heading font-semibold">Progress Dashboard</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-4 bg-card">
          <h2 className="font-medium">Milestones over time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="milestones" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border p-4 bg-card">
          <h2 className="font-medium">Skill domains</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="domain" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
