export type Topic = "data" | "ai" | "postmortems" | "trade";

export type TopicMeta = {
  id: Topic;
  label: string;
  name: string;
  dek: string;
};

export const TOPICS: TopicMeta[] = [
  {
    id: "data",
    label: "data",
    name: "Data work",
    dek: "Warehouses, pipelines, dbt, query plans. The boring parts that turn out to be load-bearing.",
  },
  {
    id: "ai",
    label: "ai",
    name: "AI work",
    dek: "LLMs, serving, evals, retrieval. Notes from inside a hype cycle, written by someone who has to make it work.",
  },
  {
    id: "postmortems",
    label: "postmortems",
    name: "Postmortems",
    dek: "Things that broke. What we thought happened, what actually happened, and the gap between the two.",
  },
  {
    id: "trade",
    label: "trade",
    name: "The trade",
    dek: "Career, hiring, the industry. Twenty years of opinions a senior engineer will admit to in person.",
  },
];

export type Post = {
  slug: string;
  title: string;
  isoDate: string;
  date: string;
  topic: Topic;
  href: string;
  isNew?: boolean;
};

const _posts: Post[] = [
  {
    slug: "warehouse-vs-serving",
    title:
      "Your warehouse is faster than your model serving, and that should embarrass you",
    isoDate: "2026-05-04",
    date: "May 4, 2026",
    topic: "ai",
    href: "/article",
    isNew: true,
  },
  {
    slug: "vector-search-not-search",
    title: "Stop using vector search for things that are not search",
    isoDate: "2026-04-23",
    date: "Apr 23, 2026",
    topic: "ai",
    href: "#",
  },
  {
    slug: "warehouse-state-machine",
    title:
      "Your data warehouse is a state machine, please treat it like one",
    isoDate: "2026-04-12",
    date: "Apr 12, 2026",
    topic: "data",
    href: "#",
  },
  {
    slug: "hiring-senior-data-engineers",
    title:
      "On hiring senior data engineers who do not all want to be managers",
    isoDate: "2026-04-02",
    date: "Apr 2, 2026",
    topic: "trade",
    href: "#",
  },
  {
    slug: "ai-infra-postmortems-2025",
    title:
      "I read every AI infra postmortem from 2025 so you do not have to",
    isoDate: "2026-03-28",
    date: "Mar 28, 2026",
    topic: "postmortems",
    href: "#",
  },
  {
    slug: "nine-llms-cheapest-won",
    title: "I evaluated nine LLMs on the same task, the cheapest one won",
    isoDate: "2026-03-11",
    date: "Mar 11, 2026",
    topic: "ai",
    href: "#",
  },
  {
    slug: "twelve-interview-questions-i-wont-ask",
    title: "Twelve interview questions I will not ask you, and why",
    isoDate: "2026-03-04",
    date: "Mar 4, 2026",
    topic: "trade",
    href: "#",
  },
  {
    slug: "ten-years-cdc",
    title: "Ten years of CDC, and the same three bugs",
    isoDate: "2026-02-19",
    date: "Feb 19, 2026",
    topic: "data",
    href: "#",
  },
  {
    slug: "ai-easiest-thirty-percent",
    title:
      "AI is not coming for your job, it is coming for the easiest 30%",
    isoDate: "2026-02-11",
    date: "Feb 11, 2026",
    topic: "trade",
    href: "#",
  },
  {
    slug: "deleted-six-months-of-telemetry",
    title: "The night we deleted six months of telemetry",
    isoDate: "2026-02-02",
    date: "Feb 2, 2026",
    topic: "postmortems",
    href: "#",
  },
  {
    slug: "dbt-project-ate-a-quarter",
    title:
      "The dbt project that ate a quarter, and what we learned the second time",
    isoDate: "2026-01-30",
    date: "Jan 30, 2026",
    topic: "data",
    href: "#",
  },
  {
    slug: "streaming-pipeline-batch-pipeline",
    title:
      "Why our streaming pipeline became a batch pipeline at 3 a.m.",
    isoDate: "2025-12-14",
    date: "Dec 14, 2025",
    topic: "postmortems",
    href: "#",
  },
];

export const POSTS: Post[] = [..._posts].sort((a, b) =>
  b.isoDate.localeCompare(a.isoDate)
);

export function postsByTopic(t: Topic, n?: number): Post[] {
  const list = POSTS.filter((p) => p.topic === t);
  return typeof n === "number" ? list.slice(0, n) : list;
}

export function topicMeta(t: Topic): TopicMeta {
  return TOPICS.find((x) => x.id === t)!;
}
