import { supabase } from './supabaseClient';
import type { Project } from '../data/projects';
import { projectsData } from '../data/projects';

// Helper to map DB snake_case to Frontend camelCase
function mapFromDB(dbProj: any): Project {
  return {
    id: dbProj.id,
    name: dbProj.name,
    description: dbProj.description,
    image: dbProj.image || undefined,
    image_position: dbProj.image_position || 'center center',
    techStack: dbProj.tech_stack || [],
    html_url: dbProj.html_url,
    repo_url: dbProj.repo_url || undefined,
    stargazers_count: dbProj.stargazers_count ?? 0,
    forks_count: dbProj.forks_count ?? 0,
    updated_at: dbProj.updated_at || new Date().toISOString(),
    featured: dbProj.featured ?? false,
  };
}

// Helper to map Frontend camelCase to DB snake_case
function mapToDB(proj: Omit<Project, 'id'> & { id?: number }): any {
  const dbProj: any = {
    name: proj.name,
    description: proj.description,
    image: proj.image || null,
    image_position: proj.image_position || 'center center',
    tech_stack: proj.techStack || [],
    html_url: proj.html_url,
    repo_url: proj.repo_url || null,
    stargazers_count: proj.stargazers_count ?? 0,
    forks_count: proj.forks_count ?? 0,
    updated_at: proj.updated_at || new Date().toISOString(),
    featured: proj.featured ?? false,
  };
  if (proj.id !== undefined) {
    dbProj.id = proj.id;
  }
  return dbProj;
}

export const projectService = {
  /**
   * Uploads an image file to Supabase Storage (bucket: project-images)
   * and returns the public URL.
   */
  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },


  /**
   * Fetches all projects from Supabase.
   * If there is an error (e.g. database not set up), it falls back to the static local projectsData.
   */
  async fetchProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.warn('Failed to fetch from Supabase projects table, using static fallback:', error.message);
        return projectsData;
      }

      if (!data || data.length === 0) {
        // If query succeeded but table is empty, we return empty so user can seed it.
        return [];
      }

      return data.map(mapFromDB);
    } catch (err) {
      console.error('Error fetching projects from Supabase:', err);
      return projectsData;
    }
  },

  /**
   * Inserts a new project into Supabase.
   */
  async addProject(project: Omit<Project, 'id'>): Promise<Project> {
    const dbData = mapToDB(project);
    const { data, error } = await supabase
      .from('projects')
      .insert([dbData])
      .select();

    if (error) {
      throw new Error(`Failed to add project: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned after inserting project.');
    }

    return mapFromDB(data[0]);
  },

  /**
   * Updates an existing project in Supabase.
   */
  async updateProject(id: number, project: Omit<Project, 'id'>): Promise<Project> {
    const dbData = mapToDB(project);
    const { data, error } = await supabase
      .from('projects')
      .update(dbData)
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error(`No project found with ID: ${id}`);
    }

    return mapFromDB(data[0]);
  },

  /**
   * Deletes a project from Supabase.
   */
  async deleteProject(id: number): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  },

  /**
   * Seeds the database with original projectsData from projects.ts.
   * Skips files that already exist in the DB (checked by name).
   */
  async seedDatabase(): Promise<Project[]> {
    const current = await this.fetchProjects();
    const currentNames = new Set(current.map((p) => p.name));

    const toSeed = projectsData.filter((p) => !currentNames.has(p.name));

    if (toSeed.length === 0) {
      return current;
    }

    const dbPayloads = toSeed.map((p) => {
      // Exclude id from local data to let PostgreSQL generate it automatically
      const { id: _, ...rest } = p;
      return mapToDB(rest);
    });

    const { data, error } = await supabase
      .from('projects')
      .insert(dbPayloads)
      .select();

    if (error) {
      throw new Error(`Failed to seed database: ${error.message}`);
    }

    const seeded = data ? data.map(mapFromDB) : [];
    return [...seeded, ...current].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }
};
