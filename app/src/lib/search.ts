// True if the search text appears in any of the values (ignores case).
// An empty search matches everything.
//   matchesSearch(search, client.name, client.email, client.phone)
export function matchesSearch(search: string, ...values: (string | undefined | null)[]): boolean {
  const term = search.trim().toLowerCase();
  if (!term) return true;
  return values.some((value) => value?.toLowerCase().includes(term));
}
