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
      const cmsData = content[page]?.[section];
      if (!cmsData) return fallback;
      
      // If data is an array or string, don't try to merge objects
      if (typeof cmsData !== 'object' || Array.isArray(cmsData)) {
        return cmsData;
      }

      // Keep CMS fields that are not empty, null, or undefined
      const cleanCmsData = Object.fromEntries(
        Object.entries(cmsData).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      );

      return { ...fallback, ...cleanCmsData };
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
