import { useState, useEffect } from 'react';
import type { Experience } from '../data/experience';
import { experienceService } from '../services/experienceService';

interface UseExperienceReturn {
  experienceItems: Experience[];
  loading: boolean;
  error: string | null;
}

export const useExperience = (): UseExperienceReturn => {
  const [experienceItems, setExperienceItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadExperience = async () => {
      try {
        setLoading(true);
        const data = await experienceService.fetchExperience();
        if (isMounted) {
          setExperienceItems(data);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load experience items');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadExperience();

    return () => {
      isMounted = false;
    };
  }, []);

  return { experienceItems, loading, error };
};
