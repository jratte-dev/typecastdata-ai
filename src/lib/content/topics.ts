/**
 * Topic taxonomy. Adding a topic? Update both the union type and the metadata
 * array. The reader validates that every article frontmatter `topic` field is
 * one of these values.
 */

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

const TOPIC_IDS = new Set<string>(TOPICS.map((t) => t.id));

export function isTopic(value: unknown): value is Topic {
  return typeof value === "string" && TOPIC_IDS.has(value);
}

export function topicMeta(t: Topic): TopicMeta {
  const meta = TOPICS.find((x) => x.id === t);
  if (!meta) {
    throw new Error(`Unknown topic: ${t}`);
  }
  return meta;
}
