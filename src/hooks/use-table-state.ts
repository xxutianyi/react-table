'use client';

import type { FilterState, TableColumn, TableStateApi, TableStates } from '@/lib/table';
import { parseAsInteger, parseAsString, useQueryState, useQueryStates, type UseQueryStatesKeysMap } from 'nuqs';
import React from 'react';

export function useStore(saveStateToQuery?: boolean) {
  const type = saveStateToQuery ? 'query' : 'state';
  return { query: useQueryStore, state: useStateStore }[type];
}

export function useStateStore(): TableStateApi {
  const [page, setPage] = React.useState<number>(1);
  const [size, setSize] = React.useState<number>(10);
  const [sorts, setSorts] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState<Record<string, FilterState> | null>(null);

  function setStates({ page, size, sorts, search, filters }: Partial<TableStates>) {
    if (page) setPage(page);
    if (size) setSize(size);
    setSorts(sorts ?? null);
    setSearch(search ?? null);
    setFilters(filters ?? {});
  }

  return {
    states: { page, size, sorts, search, filters },
    setStates: setStates,
  };
}

export function useQueryStore(columns: TableColumn<any>[]): TableStateApi {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [size, setSize] = useQueryState('size', parseAsInteger.withDefault(10));
  const [sorts, setSorts] = useQueryState('sorts', parseAsString.withDefault(''));
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [filters, setFilters] = useQueryStates(filterableColumnsQuery());

  /**
   * 可筛选的列的Query定义
   */
  function filterableColumnsQuery() {
    const state: UseQueryStatesKeysMap = {};
    columns
      .filter((column) => column.title && column.filters && column.filters.length > 0)
      .forEach((column) => {
        state[column.index] = parseAsString;
      });
    return state;
  }

  function setStates({ page, size, sorts, search, filters }: Partial<TableStates>) {
    if (page) setPage(page);
    if (size) setSize(size);
    setSorts(sorts ?? null);
    setSearch(search ?? null);
    setFilters(filters ?? {});
  }

  return {
    states: { page, size, sorts, search, filters },
    setStates: setStates,
  };
}
