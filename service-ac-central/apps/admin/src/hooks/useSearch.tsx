import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface SearchContextValue {
  query: string;
  setQuery: (value: string) => void;
  normalizedQuery: string;
}

const SearchContext = createContext<SearchContextValue | undefined>(
  undefined,
);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");

  const value = useMemo(
    () => ({
      query,
      setQuery,
      normalizedQuery: query.trim().toLowerCase(),
    }),
    [query],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch harus digunakan di dalam SearchProvider");
  return ctx;
}

/**
 * Helper: cek apakah salah satu field dari sebuah item cocok dengan
 * kata kunci pencarian global (case-insensitive).
 */
export function matchesQuery(
  fields: Array<string | number | null | undefined>,
  normalizedQuery: string,
) {
  if (!normalizedQuery) return true;
  return fields.some((field) =>
    String(field ?? "").toLowerCase().includes(normalizedQuery),
  );
}
