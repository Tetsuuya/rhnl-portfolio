import { useState, useEffect } from 'react';
import type { TechItem } from '../data/techStack';
import { techStackService } from '../services/techStackService';

interface UseTechStackReturn {
  techItems: TechItem[];
  loading: boolean;
  error: string | null;
}

export const useTechStack = (): UseTechStackReturn => {
  const [techItems, setTechItems] = useState<TechItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadTechStack = async () => {
      try {
        setLoading(true);
        const data = await techStackService.fetchTechStack();
        if (isMounted) {
          setTechItems(data);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load tech stack items');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTechStack();

    return () => {
      isMounted = false;
    };
  }, []);

  return { techItems, loading, error };
};
