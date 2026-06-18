import type { BlogAuthor, BlogPost } from "../types";

const AUTHORS: Record<string, BlogAuthor> = {
  "mock-instructor-1": {
    id: "mock-instructor-1",
    name: "Dr. Aisha Rahman",
    email: "aisha@primelearning.ae",
    avatarUrl: undefined,
    bio: "Behavioural economist and lead instructor for the Strategy & Leadership track.",
    role: "INSTRUCTOR",
  },
  "mock-instructor-2": {
    id: "mock-instructor-2",
    name: "Marcus Chen",
    email: "marcus@primelearning.ae",
    avatarUrl: undefined,
    bio: "Staff engineer turned educator. Writes about applied ML and production systems.",
    role: "INSTRUCTOR",
  },
  "mock-content-admin": {
    id: "mock-content-admin",
    name: "Prime Editorial",
    email: "learning@primelearning.ae",
    bio: "The Prime Learning editorial desk, programme notes, market briefs, and study guides.",
    role: "CONTENT_ADMIN",
  },
};

export const MOCK_BLOG_AUTHORS = AUTHORS;

const now = () => new Date().toISOString();
const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const SEED: BlogPost[] = [
  {
    id: "blog-1",
    slug: "what-actually-changes-when-you-learn-strategy",
    title: "What actually changes when you learn strategy",
    excerpt:
      "Most strategy frameworks teach vocabulary. The good ones teach attention. Here's how to tell the difference, and why it matters for the way you spend your week.",
    content: `# What actually changes when you learn strategy\n\nThere are two ways to leave a strategy course.\n\nThe first is with a vocabulary upgrade, Porter's Five Forces, the BCG matrix, an opinion about Blue Ocean. You will use these words in meetings. You will sound more senior. You will not necessarily make better decisions.\n\nThe second is harder to describe but easier to spot in practice. The people who leave strategy courses *this* way notice different things. They notice when a product team is optimising for a metric that doesn't connect to a customer behaviour. They notice when a leadership team is reorganising instead of choosing. They notice when "we should do both" is masking "we don't know which one matters more."\n\n## The shift is in attention, not in language\n\nStrategy, taught well, is a slow rewiring of where your eyes go first. When you walk into a quarterly review, do you read the headline number or the assumption underneath it? When a competitor moves, do you ask *what* they did or *what they're betting on*?\n\n> "Strategy is the art of looking at the same data as everyone else and seeing something different.", adapted, more or less, from Roger Martin.\n\n## Three habits worth stealing\n\n1. **Write the bet, not the plan.** Plans rot. Bets, "we believe X, therefore we will do Y, and we'll know we were wrong if Z", age into evidence.\n2. **Ask what you would have to believe.** When someone proposes a project, work backwards to the world in which that project is the right answer. Then ask whether you live in that world.\n3. **Notice what you stopped doing.** Strategy is mostly subtraction. The portfolio you killed is the portfolio that funded the one that worked.\n\n## What to look for in your next course\n\nIf the syllabus is mostly nouns, you'll leave with vocabulary. If it's mostly verbs, *frame, choose, kill, defend, revisit*, you'll leave with attention.\n\nPick the second kind.`,
    coverImageUrl: "/og-image.png",
    author: AUTHORS["mock-instructor-1"],
    tags: ["strategy", "leadership", "career"],
    category: "Business & Leadership",
    status: "PUBLISHED",
    featured: true,
    publishedAt: daysAgo(3),
    readingTimeMinutes: 5,
    createdAt: daysAgo(7),
    updatedAt: daysAgo(3),
  },
  {
    id: "blog-2",
    slug: "the-quiet-rise-of-applied-ai-in-finance",
    title: "The quiet rise of applied AI in finance",
    excerpt:
      "While the headlines chase chatbots, the real shift in finance is happening inside risk teams. Here's the playbook we keep seeing.",
    content: `# The quiet rise of applied AI in finance\n\nThe newsroom version of AI in finance is robo-advisors and trading bots. The version that's actually moving P&L is far less photogenic: model documentation, reconciliations, and risk attribution.\n\n## Where the budget is going\n\nIn the last twelve months of programme requests at Prime Learning, three workflows come up over and over:\n\n- **Counterparty due diligence**, turning 80-page filings into structured risk signals before a human reads them.\n- **Reg-change triage**, classifying which line of a 200-page consultation paper affects which desk.\n- **Trade narrative generation**, turning the day's flows into a desk-level summary that traders actually read.\n\nNone of these are models on the front page. All of them save somebody three hours a day.\n\n## What the best teams have in common\n\n1. They version their **prompts** like code.\n2. They define **acceptance criteria** for an AI output the same way they define them for a junior analyst.\n3. They have a path to **escalate** when the model isn't sure, and they reward analysts for using it.\n\n## What we teach\n\nThe applied AI for finance cohort spends week one *not* writing prompts. We spend it auditing the workflow you'd be replacing. The teams who skip that step build very fast tools that solve the wrong problem.`,
    coverImageUrl: undefined,
    author: AUTHORS["mock-instructor-2"],
    tags: ["ai", "finance", "applied-ml"],
    category: "Finance & Markets",
    status: "PUBLISHED",
    featured: false,
    publishedAt: daysAgo(8),
    readingTimeMinutes: 4,
    createdAt: daysAgo(12),
    updatedAt: daysAgo(8),
  },
  {
    id: "blog-3",
    slug: "a-study-plan-for-the-cfa-l1-that-respects-your-week",
    title: "A study plan for the CFA L1 that respects your week",
    excerpt:
      "Most CFA plans assume you're a full-time student. Here's the one we give working professionals who have four to six hours a week, and a calendar that fights them.",
    content: `# A study plan for the CFA L1 that respects your week\n\nThe CFA Level 1 curriculum is built for about 300 hours of study. The advice column version of that is "fifteen hours a week for five months." If you have a real job, that's not a plan, it's a fantasy.\n\nHere's the version we give learners in the Prime Learning CFA prep track.\n\n## Anchor the week around two long blocks\n\nNot evenings. Evenings are negotiated away the moment your week gets hard. Find two **two-hour blocks** in your week that are physically defended, Saturday morning, Sunday late afternoon, and treat the rest as bonus.\n\n## Sequence the topics for momentum, not order\n\nThe curriculum is not optimised for human motivation. Start with **Quant + Fixed Income**. They reward steady practice and they make Ethics and Portfolio Management make sense later.\n\n## End every block with a short test\n\nA twenty-minute mock at the end of each block locks in retention and shows you where the next session needs to start. Don't grade harshly, grade *consistently*.\n\n## The mistake everyone makes\n\nRereading instead of recalling. If you finish a chapter and immediately read it again, you've practised reading. You haven't practised remembering. Close the book, open a blank doc, and write what you remember. Then check.`,
    coverImageUrl: undefined,
    author: AUTHORS["mock-content-admin"],
    tags: ["cfa", "test-prep", "study-skills"],
    category: "Finance & Markets",
    status: "PUBLISHED",
    featured: false,
    publishedAt: daysAgo(14),
    readingTimeMinutes: 6,
    createdAt: daysAgo(16),
    updatedAt: daysAgo(14),
  },
  {
    id: "blog-4",
    slug: "design-systems-without-a-design-team",
    title: "Design systems without a design team",
    excerpt:
      "What to do when you're the only frontend engineer who cares about consistency, and the org chart hasn't caught up yet.",
    content: `# Design systems without a design team\n\nMost design system advice assumes you have a design team. If you don't, here's the version that survives Monday morning.\n\n## Start with three tokens\n\nNot a Figma library. Three CSS variables: a primary colour, a base spacing unit, and a heading scale. Everything else is a special case until proven otherwise.\n\n## Components, not abstractions\n\nResist the urge to build a \`<Box>\`. Build the five components your product actually has, \`Button\`, \`Card\`, \`Input\`, \`EmptyState\`, \`Toast\`, and freeze their props. The abstraction can wait.\n\n## The "approve once" rule\n\nFor every new component, find the one stakeholder who has to approve it visually. Get sign-off once. From then on, your job is to refuse new variants politely.\n\n## When to bring in a designer\n\nWhen you have more components than colours. That's the signal, your visual surface area is outgrowing the tokens you bootstrapped with.`,
    coverImageUrl: undefined,
    author: AUTHORS["mock-instructor-2"],
    tags: ["design-systems", "frontend", "engineering"],
    category: "Technology & Data",
    status: "PUBLISHED",
    featured: false,
    publishedAt: daysAgo(21),
    readingTimeMinutes: 4,
    createdAt: daysAgo(25),
    updatedAt: daysAgo(21),
  },
  {
    id: "blog-5",
    slug: "what-we-learned-running-our-first-cohort",
    title: "What we learned running our first cohort",
    excerpt:
      "A behind-the-curtain note from the Prime Learning programme team. Three things we kept, three we changed, and one we should have caught sooner.",
    content: `# What we learned running our first cohort\n\nWe finished our first eight-week cohort programme this quarter. Some of it worked. Some of it didn't.\n\n## What we kept\n\n- **Two live sessions a week, 90 minutes each.** Long enough to work through a problem, short enough to stay awake.\n- **Office hours are for projects, not for syllabus.** If a learner is asking us to re-explain a recorded lecture, we ask them to rewatch first.\n- **A graded final project.** Cohorts without a deliverable drift. Ours didn't.\n\n## What we changed\n\n- **Slack as the primary channel.** Replaced by a private forum that supports threaded long-form replies. Slack rewarded fastest-responder, not most thoughtful.\n- **Weekly quizzes.** Moved to bi-weekly. The weekly cadence trained learners to study for quizzes, not to learn.\n- **Open-ended capstones.** Replaced with three constrained capstone options. Choice paralysis cost us a full week.\n\n## What we should have caught sooner\n\nThe quietest learners were the ones doing the best work. Our engagement metrics were measuring posting frequency, not learning. We've stopped optimising for the dashboard.`,
    coverImageUrl: undefined,
    author: AUTHORS["mock-content-admin"],
    tags: ["cohort", "education", "behind-the-scenes"],
    category: "Inside Prime",
    status: "PUBLISHED",
    featured: false,
    publishedAt: daysAgo(30),
    readingTimeMinutes: 5,
    createdAt: daysAgo(34),
    updatedAt: daysAgo(30),
  },
  {
    id: "blog-6",
    slug: "draft-the-honest-guide-to-changing-careers-at-35",
    title: "The honest guide to changing careers at 35",
    excerpt:
      "Draft, pending edit. A long-form piece on the math and the emotions of changing careers in your mid-thirties.",
    content: `# Draft\n\nThis is a draft post used to exercise the editor and preview flow. It is intentionally short, the published version will replace this body.`,
    coverImageUrl: undefined,
    author: AUTHORS["mock-instructor-1"],
    tags: ["career", "long-form"],
    category: "Career",
    status: "DRAFT",
    featured: false,
    publishedAt: undefined,
    readingTimeMinutes: 1,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
];

let store: BlogPost[] = [...SEED];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureUniqueSlug(base: string, ignoreId?: string): string {
  const root = base || `post-${Date.now()}`;
  let candidate = root;
  let n = 1;
  while (store.some((p) => p.slug === candidate && p.id !== ignoreId)) {
    n += 1;
    candidate = `${root}-${n}`;
  }
  return candidate;
}

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export const mockBlogStore = {
  list(): BlogPost[] {
    return clone(store);
  },
  reset(): void {
    store = [...SEED];
  },
  findBySlug(slug: string): BlogPost | undefined {
    const found = store.find((p) => p.slug === slug);
    return found ? clone(found) : undefined;
  },
  findById(id: string): BlogPost | undefined {
    const found = store.find((p) => p.id === id);
    return found ? clone(found) : undefined;
  },
  insert(input: {
    title: string;
    slug?: string;
    excerpt: string;
    content: string;
    coverImageUrl?: string;
    tags?: string[];
    category?: string;
    status?: BlogPost["status"];
    author: BlogAuthor;
  }): BlogPost {
    const slug = ensureUniqueSlug(input.slug ? slugify(input.slug) : slugify(input.title));
    const nowIso = now();
    const post: BlogPost = {
      id: `blog-${Math.random().toString(36).slice(2, 10)}`,
      slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      coverImageUrl: input.coverImageUrl,
      author: input.author,
      tags: input.tags ?? [],
      category: input.category,
      status: input.status ?? "DRAFT",
      featured: false,
      publishedAt: input.status === "PUBLISHED" ? nowIso : undefined,
      readingTimeMinutes: estimateReadingTime(input.content),
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    store = [post, ...store];
    return clone(post);
  },
  update(id: string, patch: Partial<BlogPost>): BlogPost | undefined {
    const idx = store.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    const existing = store[idx];
    const nextSlug = patch.slug
      ? ensureUniqueSlug(slugify(patch.slug), id)
      : existing.slug;
    const nextContent = patch.content ?? existing.content;
    const becamePublished =
      existing.status !== "PUBLISHED" && patch.status === "PUBLISHED";
    const next: BlogPost = {
      ...existing,
      ...patch,
      slug: nextSlug,
      readingTimeMinutes: estimateReadingTime(nextContent),
      publishedAt: becamePublished ? now() : existing.publishedAt,
      updatedAt: now(),
    };
    store[idx] = next;
    return clone(next);
  },
  remove(id: string): boolean {
    const before = store.length;
    store = store.filter((p) => p.id !== id);
    return store.length < before;
  },
};

export const mockSlugify = slugify;
