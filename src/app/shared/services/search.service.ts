import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { SearchEntry } from '../models/search-entry.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly configUrl = 'assets/config/search-index.json';
  private readonly entries$: Observable<SearchEntry[]> = this.http
    .get<unknown>(this.configUrl)
    .pipe(
      map(config => this.validateConfig(config)),
      shareReplay({ bufferSize: 1, refCount: false })
    );

  constructor(private http: HttpClient) {}

  search(query: string): Observable<SearchEntry[]> {
    const terms = this.normalize(query).split(/\s+/).filter(Boolean);
    if (terms.length === 0) {
      return this.entries$.pipe(map(() => []));
    }

    return this.entries$.pipe(
      map(entries => entries
        .map(entry => ({
          entry,
          title: this.normalize(entry.title),
          keywords: this.normalize(entry.keywords.join(' ')),
          details: this.normalize(`${entry.description} ${entry.category}`)
        }))
        .filter(({ title, keywords, details }) =>
          terms.every(term => `${title} ${keywords} ${details}`.includes(term))
        )
        .sort((a, b) =>
          this.score(b.entry, terms) - this.score(a.entry, terms) ||
          a.entry.title.localeCompare(b.entry.title)
        )
        .map(({ entry }) => entry)
      )
    );
  }

  private score(entry: SearchEntry, terms: string[]): number {
    const title = this.normalize(entry.title);
    const keywords = this.normalize(entry.keywords.join(' '));
    return terms.reduce((total, term) =>
      total + (title.includes(term) ? 3 : 0) + (keywords.includes(term) ? 2 : 0), 0
    );
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase()
      .trim();
  }

  private validateConfig(config: unknown): SearchEntry[] {
    if (!this.isRecord(config) || !Array.isArray(config['entries'])) {
      throw new Error(`Invalid search configuration in ${this.configUrl}: expected an entries array`);
    }

    const ids = new Set<string>();
    const entries: SearchEntry[] = [];
    for (const value of config['entries']) {
      if (!this.isRecord(value)) {
        throw new Error(`Invalid search entry in ${this.configUrl}: expected an object`);
      }

      const id = value['id'];
      const title = value['title'];
      const description = value['description'];
      const category = value['category'];
      const keywords = value['keywords'];
      const route = value['route'];
      const fragment = value['fragment'];
      const image = value['image'];
      const action = value['action'];

      if (
        typeof id !== 'string' ||
        !id.trim() ||
        ids.has(id) ||
        typeof title !== 'string' ||
        typeof description !== 'string' ||
        typeof category !== 'string' ||
        !Array.isArray(keywords) ||
        !keywords.every((keyword): keyword is string => typeof keyword === 'string') ||
        (route !== undefined && typeof route !== 'string') ||
        (fragment !== undefined && typeof fragment !== 'string') ||
        (image !== undefined && typeof image !== 'string') ||
        (action !== undefined && action !== 'cart') ||
        (!route && action !== 'cart')
      ) {
        throw new Error(`Invalid search entry in ${this.configUrl}: ${String(id ?? 'unknown')}`);
      }

      const entry: SearchEntry = { id, title, description, category, keywords };
      if (route !== undefined) entry.route = route;
      if (fragment !== undefined) entry.fragment = fragment;
      if (image !== undefined) entry.image = image;
      if (action !== undefined) entry.action = action;
      entries.push(entry);
      ids.add(id);
    }

    return entries;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
