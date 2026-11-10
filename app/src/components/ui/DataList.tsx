import { Fragment } from 'react';
import type { ReactNode } from 'react';
import { SearchX } from 'lucide-react';
import { EmptyState, ErrorState, LoadingState } from './States';

interface DataListProps<T> {
  // Pass the result of a list hook straight in, e.g. clientHooks.useList()
  query: {
    data?: T[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => unknown;
  };
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  filter?: (item: T) => boolean; // Search and filters
  empty: ReactNode; // Shown when there's nothing saved yet
  noMatchMessage?: string; // Shown when search/filters hide everything
}

// Handles loading, errors, empty lists and "no matches", then renders each item
export function DataList<T>({ query, getKey, renderItem, filter, empty, noMatchMessage }: DataListProps<T>) {
  if (query.isLoading) return <LoadingState />;
  if (query.error) return <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;

  const items = query.data ?? [];
  if (items.length === 0) return <>{empty}</>;

  const visible = filter ? items.filter(filter) : items;
  if (visible.length === 0) {
    return <EmptyState icon={SearchX} title={noMatchMessage ?? 'Nothing matches your search or filters.'} />;
  }

  return (
    <div className="space-y-2">
      {visible.map((item) => (
        <Fragment key={getKey(item)}>{renderItem(item)}</Fragment>
      ))}
    </div>
  );
}
