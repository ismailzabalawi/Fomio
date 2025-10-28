import { useEffect, useState } from 'react';
import { bffFetch } from '../lib/apiClient';

export function useDiscourseSettings() {
  const [settings, setSettings] = useState<{
    minTitle: number;
    minPost: number;
  }>({ minTitle: 15, minPost: 20 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        // Use BFF endpoint instead of direct Discourse call
        const data = await bffFetch('/site/settings') as any;
        setSettings({
          minTitle: data.min_topic_title_length || 15,
          minPost: data.min_post_length || 20,
        });
      } catch (e) {
        // fallback to defaults
        console.warn('Failed to fetch site settings, using defaults:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  return { ...settings, loading };
}
