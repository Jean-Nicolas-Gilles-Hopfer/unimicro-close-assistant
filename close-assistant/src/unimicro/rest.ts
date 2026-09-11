/**
 * Thin client for the Unimicro business API (api/biz) and the statistics endpoint.
 * Docs: developer.unimicro.no/guide/api/filtering, /guide/api/statistics
 */
import { config } from "../config.js";
import { getAccessToken } from "./auth.js";

export interface RestOptions { baseUrl?: string; companyKey?: string; }

export class UnimicroRest {
  private baseUrl: string;
  private companyKey: string;
  constructor(o: RestOptions = {}) {
    this.baseUrl = (o.baseUrl ?? config.baseUrl).replace(/\/+$/, "");
    this.companyKey = o.companyKey ?? config.companyKey;
  }

  withCompany(companyKey: string): UnimicroRest { return new UnimicroRest({ baseUrl: this.baseUrl, companyKey }); }

  private async headers(): Promise<Record<string, string>> {
    const h: Record<string, string> = {
      Authorization: `Bearer ${await getAccessToken("rest")}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (this.companyKey) h.CompanyKey = this.companyKey;
    return h;
  }

  async request<T>(method: string, path: string, query?: Record<string, string | number | boolean | undefined>, body?: unknown): Promise<T> {
    const url = new URL(path.replace(/^\/+/, ""), this.baseUrl + "/");
    for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const res = await fetch(url, { method, headers: await this.headers(), body: body === undefined ? undefined : JSON.stringify(body) });
    const text = await res.text();
    if (!res.ok) throw new Error(`Unimicro API ${method} ${url.pathname} -> ${res.status}: ${text.slice(0, 500)}`);
    return (text ? JSON.parse(text) : null) as T;
  }

  get<T = unknown>(path: string, query?: Record<string, string | number | boolean | undefined>) { return this.request<T>("GET", path, query); }
  post<T = unknown>(path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>) { return this.request<T>("POST", path, query, body); }
  put<T = unknown>(path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>) { return this.request<T>("PUT", path, query, body); }

  /** GET api/biz/{entity} with OData-style options. */
  biz<T = unknown>(entity: string, q: { filter?: string; select?: string; expand?: string; orderby?: string; top?: number; skip?: number } = {}) {
    return this.get<T[]>(`api/biz/${entity}`, q);
  }

  /** Statistics (ad-hoc aggregation) endpoint. Returns the Data array. */
  async statistics<T = Record<string, unknown>>(q: { model: string; select: string; filter?: string; expand?: string; join?: string; orderby?: string; top?: number; skip?: number; }): Promise<T[]> {
    const res = await this.get<{ Success: boolean; Message?: string; Data: T[] }>("api/statistics", { ...q, wrap: false });
    if (Array.isArray(res)) return res as unknown as T[];
    if (res && res.Success === false) throw new Error(`statistics failed: ${res.Message}`);
    return res?.Data ?? [];
  }

  companies() { return this.get<{ Name: string; Key: string; IsTest?: boolean; ID?: number }[]>("api/init/companies"); }
}
