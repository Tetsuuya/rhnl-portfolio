import { supabase } from './supabaseClient';
import type { Experience } from '../data/experience';
import { fallbackExperienceData } from '../data/experience';

export const experienceService = {
  /**
   * Fetches all experience items from Supabase.
   * If there is an error, it falls back to the static fallbackExperienceData.
   */
  async fetchExperience(): Promise<Experience[]> {
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.warn('Failed to fetch from Supabase experience table, using static fallback:', error.message);
        return fallbackExperienceData;
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data as Experience[];
    } catch (err) {
      console.error('Error fetching experience from Supabase:', err);
      return fallbackExperienceData;
    }
  },

  /**
   * Inserts a new experience item into Supabase.
   */
  async addExperience(exp: Omit<Experience, 'id'>): Promise<Experience> {
    const { data, error } = await supabase
      .from('experience')
      .insert([exp])
      .select();

    if (error) {
      throw new Error(`Failed to add experience: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned after inserting experience.');
    }

    return data[0] as Experience;
  },

  /**
   * Updates an existing experience item in Supabase.
   */
  async updateExperience(id: number, exp: Omit<Experience, 'id'>): Promise<Experience> {
    const { data, error } = await supabase
      .from('experience')
      .update(exp)
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(`Failed to update experience: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error(`No experience found with ID: ${id}`);
    }

    return data[0] as Experience;
  },

  /**
   * Deletes an experience item from Supabase.
   */
  async deleteExperience(id: number): Promise<void> {
    const { error } = await supabase
      .from('experience')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete experience: ${error.message}`);
    }
  },

  /**
   * Seeds the database with original fallbackExperienceData.
   * Skips items that already exist in the DB (checked by company and role).
   */
  async seedDatabase(): Promise<Experience[]> {
    const current = await this.fetchExperience();
    const currentKeys = new Set(current.map((e) => `${e.company}-${e.role}`));

    const toSeed = fallbackExperienceData.filter((e) => !currentKeys.has(`${e.company}-${e.role}`));

    if (toSeed.length === 0) {
      return current;
    }

    const dbPayloads = toSeed.map((e) => {
      const { id: _, ...rest } = e;
      return rest;
    });

    const { data, error } = await supabase
      .from('experience')
      .insert(dbPayloads)
      .select();

    if (error) {
      throw new Error(`Failed to seed experience: ${error.message}`);
    }

    const seeded = data ? (data as Experience[]) : [];
    return [...seeded, ...current].sort((a, b) => b.id - a.id);
  }
};
