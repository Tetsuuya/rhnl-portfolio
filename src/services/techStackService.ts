import { supabase } from './supabaseClient';
import type { TechItem } from '../data/techStack';
import { techStackData } from '../data/techStack';

// Helper to map DB snake_case to Frontend camelCase
function mapFromDB(dbTech: any): TechItem {
  return {
    id: dbTech.id,
    name: dbTech.name,
    category: dbTech.category,
    icon: dbTech.icon || '',
  };
}

// Helper to map Frontend camelCase to DB snake_case
function mapToDB(tech: Omit<TechItem, 'id'> & { id?: number }): any {
  const dbTech: any = {
    name: tech.name,
    category: tech.category,
    icon: tech.icon || '',
  };
  if (tech.id !== undefined) {
    dbTech.id = tech.id;
  }
  return dbTech;
}

export const techStackService = {
  /**
   * Fetches all tech items from Supabase.
   * If there is an error (e.g. table not set up), it falls back to the static local techStackData.
   */
  async fetchTechStack(): Promise<TechItem[]> {
    try {
      const { data, error } = await supabase
        .from('tech_stack')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.warn('Failed to fetch from Supabase tech_stack table, using static fallback:', error.message);
        return techStackData;
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map(mapFromDB);
    } catch (err) {
      console.error('Error fetching tech stack from Supabase:', err);
      return techStackData;
    }
  },

  /**
   * Inserts a new tech item into Supabase.
   */
  async addTechItem(tech: Omit<TechItem, 'id'>): Promise<TechItem> {
    const dbData = mapToDB(tech);
    const { data, error } = await supabase
      .from('tech_stack')
      .insert([dbData])
      .select();

    if (error) {
      throw new Error(`Failed to add tech item: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned after inserting tech item.');
    }

    return mapFromDB(data[0]);
  },

  /**
   * Updates an existing tech item in Supabase.
   */
  async updateTechItem(id: number, tech: Omit<TechItem, 'id'>): Promise<TechItem> {
    const dbData = mapToDB(tech);
    const { data, error } = await supabase
      .from('tech_stack')
      .update(dbData)
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(`Failed to update tech item: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error(`No tech item found with ID: ${id}`);
    }

    return mapFromDB(data[0]);
  },

  /**
   * Deletes a tech item from Supabase.
   */
  async deleteTechItem(id: number): Promise<void> {
    const { error } = await supabase
      .from('tech_stack')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete tech item: ${error.message}`);
    }
  },

  /**
   * Seeds the database with original techStackData from techStack.ts.
   * Skips items that already exist in the DB (checked by name).
   */
  async seedDatabase(): Promise<TechItem[]> {
    const current = await this.fetchTechStack();
    const currentNames = new Set(current.map((t) => t.name));

    const toSeed = techStackData.filter((t) => !currentNames.has(t.name));

    if (toSeed.length === 0) {
      return current;
    }

    const dbPayloads = toSeed.map((t) => {
      // Exclude id from local data to let PostgreSQL generate it automatically
      const { id: _, ...rest } = t;
      return mapToDB(rest);
    });

    const { data, error } = await supabase
      .from('tech_stack')
      .insert(dbPayloads)
      .select();

    if (error) {
      throw new Error(`Failed to seed tech stack: ${error.message}`);
    }

    const seeded = data ? data.map(mapFromDB) : [];
    return [...current, ...seeded].sort((a, b) => a.id - b.id);
  }
};
