import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { api } from '../lib/api.js';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { content: data } = await api('/content');
      setContent(data || {});
    } catch {
      setContent({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getSection = useCallback(
    (page, section, fallback = {}) => {
      return content[page]?.[section] ?? fallback;
    },
    [content],
  );

  const value = useMemo(
    () => ({ content, loading, refresh, getSection }),
    [content, loading, refresh, getSection],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}

export function usePageSection(page, section, fallback = {}) {
  const { getSection, loading } = useContent();
  return { data: getSection(page, section, fallback), loading };
}
