// src/types/filters.ts
//
// Filter state types — used by FilterPanel, usePostFetcher,
// and the public/admin container components.

export interface PostFilters {
  search: string;
  categories: string[];
  dateFrom: string;
  dateTo: string;
  resourceType: string[];
}
