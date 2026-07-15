import { activity, edges, nodes, users } from "./catalog";
import type {
  ActivityEvent,
  ActivityKind,
  CatalogEdge,
  CatalogNode,
  Graph,
  User,
} from "./types";

const wait = <T,>(v: T, ms = 60): Promise<T> => new Promise((r) => setTimeout(() => r(v), ms));

export const service = {
  users(): Promise<User[]> {
    return wait(users);
  },
  currentUser(): User {
    return users[0];
  },
  userById(id: string): User | undefined {
    return users.find((u) => u.id === id);
  },
  graph(): Promise<Graph> {
    return wait({ nodes, edges });
  },
  listDatasets(): Promise<CatalogNode[]> {
    return wait(nodes.filter((n) => n.type === "dataset"));
  },
  listAll(): Promise<CatalogNode[]> {
    return wait(nodes);
  },
  getNode(id: string): Promise<CatalogNode | undefined> {
    return wait(nodes.find((n) => n.id === id));
  },
  listEdges(): Promise<CatalogEdge[]> {
    return wait(edges);
  },
  listActivity(kinds?: ActivityKind[]): Promise<ActivityEvent[]> {
    const out = kinds && kinds.length > 0 ? activity.filter((e) => kinds.includes(e.kind)) : activity;
    return wait(out);
  },
  upstream(id: string): CatalogNode[] {
    const seen = new Set<string>();
    const walk = (n: string) => {
      edges
        .filter((e) => e.target === n)
        .forEach((e) => {
          if (!seen.has(e.source)) {
            seen.add(e.source);
            walk(e.source);
          }
        });
    };
    walk(id);
    return Array.from(seen)
      .map((nId) => nodes.find((n) => n.id === nId))
      .filter((n): n is CatalogNode => Boolean(n));
  },
  downstream(id: string): CatalogNode[] {
    const seen = new Set<string>();
    const walk = (n: string) => {
      edges
        .filter((e) => e.source === n)
        .forEach((e) => {
          if (!seen.has(e.target)) {
            seen.add(e.target);
            walk(e.target);
          }
        });
    };
    walk(id);
    return Array.from(seen)
      .map((nId) => nodes.find((n) => n.id === nId))
      .filter((n): n is CatalogNode => Boolean(n));
  },
};
