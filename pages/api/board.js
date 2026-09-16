import { kv } from '@vercel/kv';

const KEY = 'timeline:board';

const DEFAULT_DATA = {
  milestones: [
    {
      id: 'm1', name: 'Kick-off', date: '2026-09-01', label: 'Sprint 1', isToday: false,
      cards: [
        { id: 'c1', type: 'idea', title: 'Define north-star metric', desc: 'Align the team on a single metric that captures product success.', tasks: [], collapsed: false },
        { id: 'c2', type: 'task', title: 'Set up project repo & CI', desc: 'GitHub org, branch strategy, and initial Actions pipeline.', tasks: [{ text: 'Create GitHub repo', done: true }, { text: 'Configure branch protection rules', done: true }, { text: 'Set up CI/CD pipeline', done: false }], collapsed: false }
      ]
    },
    {
      id: 'm2', name: 'Alpha', date: '2026-09-17', label: 'Today', isToday: true,
      cards: [
        { id: 'c3', type: 'idea', title: 'Onboarding redesign', desc: 'Explore a progress-bar-first onboarding flow.', tasks: [], collapsed: false },
        { id: 'c4', type: 'task', title: 'Ship dashboard v1', desc: 'Core charts, filters, and export are in scope.', tasks: [{ text: 'Finalize data model', done: true }, { text: 'Build chart components', done: true }, { text: 'Add export to CSV', done: false }, { text: 'QA on mobile', done: false }], collapsed: false },
        { id: 'c5', type: 'risk', title: 'API rate limits under load', desc: 'Third-party API caps at 1000 req/min. Peak traffic could exceed this by 3×.', tasks: [], collapsed: true }
      ]
    },
    {
      id: 'm3', name: 'Beta', date: '2026-10-10', label: "Oct '26", isToday: false,
      cards: [
        { id: 'c6', type: 'idea', title: 'Collaborative editing', desc: 'Let multiple users work in the same doc simultaneously.', tasks: [], collapsed: false },
        { id: 'c7', type: 'task', title: 'Invite 50 beta users', desc: 'Source from waitlist, product communities, and warm intros.', tasks: [{ text: 'Draft invite email', done: false }, { text: 'Set up feedback channel', done: false }, { text: 'Send wave 1 (25 users)', done: false }], collapsed: false }
      ]
    },
    {
      id: 'm4', name: 'Launch', date: '2026-11-20', label: 'v1.0', isToday: false,
      cards: [
        { id: 'c8', type: 'idea', title: 'Product Hunt launch strategy', desc: 'Coordinate hunter, supporter mobilization, and timing for a top-5 finish.', tasks: [], collapsed: true },
        { id: 'c9', type: 'note', title: 'Press & announcement copy', desc: 'Prepare blog post, social assets, and press kit one week before launch day.', tasks: [], collapsed: false }
      ]
    },
    {
      id: 'm5', name: 'Post-launch', date: '2026-12-15', label: 'Q4 wrap', isToday: false,
      cards: [
        { id: 'c10', type: 'note', title: 'Retrospective & metrics review', desc: 'What hit, what missed, and what do we double down on in Q1?', tasks: [], collapsed: false }
      ]
    }
  ]
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const data = await kv.get(KEY);
    return res.status(200).json(data ?? DEFAULT_DATA);
  }

  if (req.method === 'POST') {
    const body = req.body;
    if (!body || !Array.isArray(body.milestones)) {
      return res.status(400).json({ error: 'Invalid body' });
    }
    await kv.set(KEY, body);
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
