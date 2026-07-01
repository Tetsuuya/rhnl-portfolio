import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { projectService } from '../services/projectService';
import { techStackService } from '../services/techStackService';
import { experienceService } from '../services/experienceService';
import { generateResumePDF } from '../services/resumeService';
import type { Project } from '../data/projects';
import type { TechItem, CategoryType as TechCategoryType } from '../data/techStack';
import type { Experience } from '../data/experience';

const AdminPage = () => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authMethod, setAuthMethod] = useState<'supabase' | 'local' | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Tab switcher state
  const [activeTab, setActiveTab] = useState<'projects' | 'tech_stack' | 'experience'>('projects');

  // Projects states
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Tech Stack states
  const [techItems, setTechItems] = useState<TechItem[]>([]);
  const [editingTechItem, setEditingTechItem] = useState<TechItem | null>(null);
  const [isTechModalOpen, setIsTechModalOpen] = useState<boolean>(false);

  // Experience states
  const [experienceItems, setExperienceItems] = useState<Experience[]>([]);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isExpModalOpen, setIsExpModalOpen] = useState<boolean>(false);

  // CRUD / Modal states for Projects
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Project Form fields
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [techStackInput, setTechStackInput] = useState<string>('');
  const [htmlUrl, setHtmlUrl] = useState<string>('');
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [featured, setFeatured] = useState<boolean>(false);
  const [stars, setStars] = useState<number>(0);
  const [forks, setForks] = useState<number>(0);
  const [updatedAt, setUpdatedAt] = useState<string>('');

  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUploadLoading, setImageUploadLoading] = useState<boolean>(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePosition, setImagePosition] = useState<string>('center center');

  // Tech Stack Form fields
  const [techName, setTechName] = useState<string>('');
  const [techCategory, setTechCategory] = useState<TechCategoryType>('Language');
  const [techIcon, setTechIcon] = useState<string>('');

  // Experience Form fields
  const [expCompany, setExpCompany] = useState<string>('');
  const [expRole, setExpRole] = useState<string>('');
  const [expDuration, setExpDuration] = useState<string>('');
  const [expDescription, setExpDescription] = useState<string>('');
  const [expLocation, setExpLocation] = useState<string>('');
  const [expJobType, setExpJobType] = useState<string>('');
  const [expAchievementsInput, setExpAchievementsInput] = useState<string>('');
  const [expTechStackInput, setExpTechStackInput] = useState<string>('');

  // Check existing Supabase session on mount and listen to state updates
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        setAuthMethod('supabase');
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setIsAuthenticated(true);
          setAuthMethod('supabase');
        } else {
          setIsAuthenticated(false);
          setAuthMethod(null);
          setProjects([]);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch projects, tech stack, and experience when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
      loadTechItems();
      loadExperienceItems();
    }
  }, [isAuthenticated]);

  const loadTechItems = async () => {
    try {
      setLoading(true);
      const data = await techStackService.fetchTechStack();
      setTechItems(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load tech stack items');
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.fetchProjects();
      setProjects(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const loadExperienceItems = async () => {
    try {
      setLoading(true);
      const data = await experienceService.fetchExperience();
      setExperienceItems(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load experience items');
    } finally {
      setLoading(false);
    }
  };

  // Login handler using Supabase Auth
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (!email.trim()) {
        throw new Error('Email address is required for Supabase Auth.');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      setIsAuthenticated(true);
      setAuthMethod('supabase');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setAuthMethod(null);
    setProjects([]);
  };

  // Seed DB handler for projects
  const handleSeed = async () => {
    if (!window.confirm('Are you sure you want to seed the database with static projects? (This won\'t overwrite existing duplicates)')) {
      return;
    }

    try {
      setLoading(true);
      const updated = await projectService.seedDatabase();
      setProjects(updated);
      showToast('Database seeded successfully!');
    } catch (err: any) {
      setError(err.message || 'Seeding failed');
    } finally {
      setLoading(false);
    }
  };

  // Seed DB handler for Tech Stack
  const handleSeedTechStack = async () => {
    if (!window.confirm('Are you sure you want to seed the database with all 22 default technologies? (This won\'t overwrite existing duplicates)')) {
      return;
    }

    try {
      setLoading(true);
      const updated = await techStackService.seedDatabase();
      setTechItems(updated);
      showToast('Tech stack seeded successfully!');
    } catch (err: any) {
      setError(err.message || 'Tech stack seeding failed');
    } finally {
      setLoading(false);
    }
  };

  // Seed DB handler for Experience
  const handleSeedExperience = async () => {
    if (!window.confirm('Are you sure you want to seed the database with fallback experience items? (This won\'t overwrite existing duplicates)')) {
      return;
    }

    try {
      setLoading(true);
      const updated = await experienceService.seedDatabase();
      setExperienceItems(updated);
      showToast('Experience seeded successfully!');
    } catch (err: any) {
      setError(err.message || 'Experience seeding failed');
    } finally {
      setLoading(false);
    }
  };

  // Export Resume PDF handler
  const handleExportResume = async () => {
    try {
      setLoading(true);
      showToast('Generating resume PDF...');
      
      await generateResumePDF({
        projects,
        techStack: techItems,
        experience: experienceItems
      });
      
      showToast('Resume PDF exported successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to export resume');
    } finally {
      setLoading(false);
    }
  };

  // Toast message utility
  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Open modal for Create Project
  const openCreateModal = () => {
    setEditingProject(null);
    setName('');
    setDescription('');
    setImage('');
    setTechStackInput('');
    setHtmlUrl('');
    setRepoUrl('');
    setFeatured(false);
    setStars(0);
    setForks(0);
    setUpdatedAt(new Date().toISOString().split('T')[0]);
    setImageFile(null);
    setImagePreview('');
    setImageUploadError(null);
    setImagePosition('center center');
    setIsModalOpen(true);
  };

  // Open modal for Edit Project
  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description);
    setImage(project.image || '');
    setTechStackInput(project.techStack?.join(', ') || '');
    setHtmlUrl(project.html_url);
    setRepoUrl(project.repo_url || '');
    setFeatured(project.featured || false);
    setStars(project.stargazers_count);
    setForks(project.forks_count);
    setUpdatedAt(project.updated_at ? project.updated_at.split('T')[0] : '');
    setImageFile(null);
    setImagePreview(project.image || '');
    setImageUploadError(null);
    setImagePosition(project.image_position || 'center center');
    setIsModalOpen(true);
  };

  // Image file selection & upload handler
  const handleImageFileChange = async (file: File | null) => {
    if (!file) return;
    // Validate type
    if (!file.type.startsWith('image/')) {
      setImageUploadError('Please select a valid image file (JPG, PNG, GIF, WebP, etc.).');
      return;
    }
    // Validate size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError('Image must be smaller than 5 MB.');
      return;
    }

    setImageFile(file);
    setImageUploadError(null);

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    try {
      setImageUploadLoading(true);
      const publicUrl = await projectService.uploadImage(file);
      setImage(publicUrl);
      showToast('Image uploaded successfully!');
    } catch (err: any) {
      setImageUploadError(err.message || 'Upload failed. Check your Supabase Storage bucket.');
      setImage('');
    } finally {
      setImageUploadLoading(false);
    }
  };

  // Form submit (Add/Edit Project)
  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const techStack = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const projectPayload: Omit<Project, 'id'> = {
      name,
      description,
      image: image.trim() || undefined,
      image_position: imagePosition,
      techStack,
      html_url: htmlUrl,
      repo_url: repoUrl.trim() || undefined,
      stargazers_count: Number(stars),
      forks_count: Number(forks),
      updated_at: updatedAt ? new Date(updatedAt).toISOString() : new Date().toISOString(),
      featured,
    };

    try {
      setLoading(true);
      if (editingProject) {
        const updated = await projectService.updateProject(editingProject.id, projectPayload);
        setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? updated : p)));
        showToast('Project updated successfully!');
      } else {
        const added = await projectService.addProject(projectPayload);
        setProjects((prev) => [added, ...prev]);
        showToast('Project added successfully!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast('Project deleted successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  // Open modal for Create Tech Item
  const openCreateTechModal = () => {
    setEditingTechItem(null);
    setTechName('');
    setTechCategory('Language');
    setTechIcon('');
    setIsTechModalOpen(true);
  };

  // Open modal for Edit Tech Item
  const openEditTechModal = (tech: TechItem) => {
    setEditingTechItem(tech);
    setTechName(tech.name);
    setTechCategory(tech.category);
    setTechIcon(tech.icon);
    setIsTechModalOpen(true);
  };

  // Form submit for Tech Item (Add/Edit)
  const handleSubmitTechItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const techPayload: Omit<TechItem, 'id'> = {
      name: techName,
      category: techCategory,
      icon: techIcon,
    };

    try {
      setLoading(true);
      if (editingTechItem) {
        const updated = await techStackService.updateTechItem(editingTechItem.id!, techPayload);
        setTechItems((prev) => prev.map((t) => (t.id === editingTechItem.id ? updated : t)));
        showToast('Tech item updated successfully!');
      } else {
        const added = await techStackService.addTechItem(techPayload);
        setTechItems((prev) => [...prev, added]);
        showToast('Tech item added successfully!');
      }
      setIsTechModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save tech item');
    } finally {
      setLoading(false);
    }
  };

  // Delete Tech Item
  const handleDeleteTechItem = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete tech item "${name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await techStackService.deleteTechItem(id);
      setTechItems((prev) => prev.filter((t) => t.id !== id));
      showToast('Tech item deleted successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to delete tech item');
    } finally {
      setLoading(false);
    }
  };

  // Open modal for Create Experience
  const openCreateExpModal = () => {
    setEditingExperience(null);
    setExpCompany('');
    setExpRole('');
    setExpDuration('');
    setExpDescription('');
    setExpLocation('');
    setExpJobType('');
    setExpAchievementsInput('');
    setExpTechStackInput('');
    setIsExpModalOpen(true);
  };

  // Open modal for Edit Experience
  const openEditExpModal = (exp: Experience) => {
    setEditingExperience(exp);
    setExpCompany(exp.company);
    setExpRole(exp.role);
    setExpDuration(exp.duration);
    setExpDescription(exp.description);
    setExpLocation(exp.location || '');
    setExpJobType(exp.job_type || '');
    setExpAchievementsInput(exp.key_achievements?.join('\n') || '');
    setExpTechStackInput(exp.tech_stack?.join(', ') || '');
    setIsExpModalOpen(true);
  };

  // Form submit for Experience (Add/Edit)
  const handleSubmitExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const key_achievements = expAchievementsInput
      .split('\n')
      .map((a) => a.trim())
      .filter(Boolean);

    const tech_stack = expTechStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const expPayload: Omit<Experience, 'id'> = {
      company: expCompany,
      role: expRole,
      duration: expDuration,
      description: expDescription,
      location: expLocation || null,
      job_type: expJobType || null,
      key_achievements,
      tech_stack,
    };

    try {
      setLoading(true);
      if (editingExperience) {
        const updated = await experienceService.updateExperience(editingExperience.id, expPayload);
        setExperienceItems((prev) => prev.map((e) => (e.id === editingExperience.id ? updated : e)));
        showToast('Experience updated successfully!');
      } else {
        const added = await experienceService.addExperience(expPayload);
        setExperienceItems((prev) => [added, ...prev]);
        showToast('Experience added successfully!');
      }
      setIsExpModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save experience');
    } finally {
      setLoading(false);
    }
  };

  // Delete Experience
  const handleDeleteExperience = async (id: number, company: string) => {
    if (!window.confirm(`Are you sure you want to delete experience at "${company}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await experienceService.deleteExperience(id);
      setExperienceItems((prev) => prev.filter((e) => e.id !== id));
      showToast('Experience deleted successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to delete experience');
    } finally {
      setLoading(false);
    }
  };

  // Render Login Card
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-120px)] w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-black/50 border-2 border-white/20 p-8 rounded-2xl backdrop-blur-md shadow-2xl relative overflow-hidden">
          {/* Decorative glowing gradient */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>

          <div className="text-center relative">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Admin Portal
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Manage your portfolio database projects & details
            </p>
          </div>

          <form className="mt-8 space-y-6 relative" onSubmit={handleLogin}>
            {authError && (
              <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                {authError}
              </div>
            )}

            <div className="rounded-md space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">
                  Email Address <span className="text-pink-300 font-bold">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-white/20 placeholder-gray-500 bg-white/5 text-white focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm transition-all"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">
                  Password <span className="text-pink-300 font-bold">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-white/20 placeholder-gray-500 bg-white/5 text-white focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={authLoading}
                className="group relative w-full flex justify-center py-2.5 px-4 border-2 border-pink-400 text-sm font-semibold rounded-lg text-white bg-black/80 hover:bg-pink-500/10 hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all duration-300 transform active:scale-95 disabled:opacity-50"
              >
                {authLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative max-w-7xl">
      {/* Toast Alert */}
      {successMessage && (
        <div className="fixed top-24 right-4 z-50 p-4 bg-green-950/80 border-2 border-green-500/80 rounded-xl text-green-200 shadow-2xl backdrop-blur-md animate-fade-in-down">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-black/40 border-2 border-white/20 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Dashboard Panel
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Logged in via <span className="text-pink-300 font-bold uppercase">{authMethod} key</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {activeTab === 'projects' ? (
            <>
              <button
                onClick={handleSeed}
                disabled={loading}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-cyan-200 border-2 border-cyan-400/50 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-500/10 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:opacity-50"
              >
                Seed DB from Static Code
              </button>
              <button
                onClick={openCreateModal}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-pink-200 border-2 border-pink-400/50 hover:border-pink-400 bg-pink-950/20 hover:bg-pink-500/10 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]"
              >
                Add New Project
              </button>
            </>
          ) : activeTab === 'tech_stack' ? (
            <>
              <button
                onClick={handleSeedTechStack}
                disabled={loading}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-cyan-200 border-2 border-cyan-400/50 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-500/10 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:opacity-50"
              >
                Seed Tech Stack
              </button>
              <button
                onClick={openCreateTechModal}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-pink-200 border-2 border-pink-400/50 hover:border-pink-400 bg-pink-950/20 hover:bg-pink-500/10 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]"
              >
                Add Tech Item
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSeedExperience}
                disabled={loading}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-cyan-200 border-2 border-cyan-400/50 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-500/10 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:opacity-50"
              >
                Seed Experience
              </button>
              <button
                onClick={openCreateExpModal}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-pink-200 border-2 border-pink-400/50 hover:border-pink-400 bg-pink-950/20 hover:bg-pink-500/10 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]"
              >
                Add Experience
              </button>
            </>
          )}
          <button
            onClick={handleExportResume}
            disabled={loading}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-green-200 border-2 border-green-400/50 hover:border-green-400 bg-green-950/20 hover:bg-green-500/10 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] disabled:opacity-50"
          >
            📄 Export Resume PDF
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-400 hover:text-white border-2 border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-white/10 mb-8 gap-4">
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'projects'
              ? 'text-pink-300 border-b-2 border-pink-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab('tech_stack')}
          className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'tech_stack'
              ? 'text-pink-300 border-b-2 border-pink-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Tech Stack & Tools
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'experience'
              ? 'text-pink-300 border-b-2 border-pink-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Experience
        </button>
      </div>

      {/* Stats dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {activeTab === 'projects' ? (
          <>
            <div className="bg-black/30 border-2 border-white/15 p-5 rounded-xl backdrop-blur-sm">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Projects</div>
              <div className="text-3xl font-extrabold text-white mt-1">{projects.length}</div>
            </div>
            <div className="bg-black/30 border-2 border-white/15 p-5 rounded-xl backdrop-blur-sm">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Featured Projects</div>
              <div className="text-3xl font-extrabold text-pink-300 mt-1">
                {projects.filter((p) => p.featured).length}
              </div>
            </div>
          </>
        ) : activeTab === 'tech_stack' ? (
          <>
            <div className="bg-black/30 border-2 border-white/15 p-5 rounded-xl backdrop-blur-sm">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Tech Items</div>
              <div className="text-3xl font-extrabold text-white mt-1">{techItems.length}</div>
            </div>
            <div className="bg-black/30 border-2 border-white/15 p-5 rounded-xl backdrop-blur-sm">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Categories</div>
              <div className="text-3xl font-extrabold text-pink-300 mt-1">5 Types</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-black/30 border-2 border-white/15 p-5 rounded-xl backdrop-blur-sm">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Experience</div>
              <div className="text-3xl font-extrabold text-white mt-1">{experienceItems.length}</div>
            </div>
            <div className="bg-black/30 border-2 border-white/15 p-5 rounded-xl backdrop-blur-sm">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Active Roles</div>
              <div className="text-3xl font-extrabold text-pink-300 mt-1">
                {experienceItems.filter((e) => e.duration.toLowerCase().includes('present')).length} Active
              </div>
            </div>
          </>
        )}
        <div className="bg-black/30 border-2 border-white/15 p-5 rounded-xl backdrop-blur-sm">
          <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Storage Provider</div>
          <div className="text-lg font-bold text-cyan-300 mt-2">Supabase PostgreSQL</div>
        </div>
      </div>

      {/* Primary list */}
      <div className="bg-black/40 border-2 border-white/20 rounded-2xl overflow-hidden backdrop-blur-md">
        {error && (
          <div className="p-4 bg-red-900/20 border-b border-red-500/30 text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {activeTab === 'projects' ? (
          loading && projects.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-transparent border-t-pink-400 border-pink-400/20 rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">Fetching projects database...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <p className="text-lg font-medium">No projects in database</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Run 'Seed DB' above to populate with projects from projects.ts, or manually add your first item.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-gray-400 uppercase bg-white/5">
                    <th className="p-4 font-bold">Image</th>
                    <th className="p-4 font-bold">Project Name</th>
                    <th className="p-4 font-bold">Tech Stack</th>
                    <th className="p-4 font-bold text-center">Featured</th>
                    <th className="p-4 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        {proj.image ? (
                          <img
                            src={proj.image}
                            alt={proj.name}
                            className="w-16 h-10 object-cover rounded border border-white/10"
                          />
                        ) : (
                          <div className="w-16 h-10 bg-white/5 rounded border border-white/10 flex items-center justify-center text-[10px] text-gray-500 font-semibold">
                            NO IMAGE
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white text-sm sm:text-base">{proj.name}</div>
                        <div className="text-xs text-gray-400 line-clamp-1 max-w-xs mt-0.5">
                          {proj.description}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {proj.techStack?.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 bg-cyan-950/30 border border-cyan-800/30 text-[10px] text-cyan-300 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {proj.featured ? (
                          <span className="inline-block px-2 py-0.5 bg-pink-950/50 border border-pink-700/50 text-[10px] text-pink-300 rounded font-semibold">
                            ★ Featured
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(proj)}
                            className="p-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/20 rounded transition-all"
                            title="Edit Project"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id, proj.name)}
                            className="p-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded transition-all"
                            title="Delete Project"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : activeTab === 'tech_stack' ? (
          loading && techItems.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-transparent border-t-pink-400 border-pink-400/20 rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">Fetching tech stack...</p>
            </div>
          ) : techItems.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <p className="text-lg font-medium">No tech stack items in database</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Run 'Seed Tech Stack' above to populate with default items, or manually add your first item.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-gray-400 uppercase bg-white/5">
                    <th className="p-4 font-bold text-center">Icon</th>
                    <th className="p-4 font-bold">Tech Name</th>
                    <th className="p-4 font-bold">Category</th>
                    <th className="p-4 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {techItems.map((tech) => (
                    <tr key={tech.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center">
                        <div className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg p-1.5 mx-auto text-white">
                          {tech.icon.trim().toLowerCase().startsWith('<svg') ? (
                            <div 
                              className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain flex items-center justify-center" 
                              dangerouslySetInnerHTML={{ __html: tech.icon }} 
                            />
                          ) : (
                            <img 
                              src={tech.icon} 
                              alt={tech.name} 
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white text-sm sm:text-base">{tech.name}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-cyan-950/30 border border-cyan-800/30 text-[10px] text-cyan-300 rounded font-semibold">
                          {tech.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditTechModal(tech)}
                            className="p-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/20 rounded transition-all"
                            title="Edit Tech Item"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTechItem(tech.id!, tech.name)}
                            className="p-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded transition-all"
                            title="Delete Tech Item"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          loading && experienceItems.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-transparent border-t-pink-400 border-pink-400/20 rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">Fetching experience history...</p>
            </div>
          ) : experienceItems.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <p className="text-lg font-medium">No experience in database</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Run 'Seed Experience' above to populate with fallback items, or manually add your first item.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-gray-400 uppercase bg-white/5">
                    <th className="p-4 font-bold">Company / Organization</th>
                    <th className="p-4 font-bold">Role / Position</th>
                    <th className="p-4 font-bold">Duration</th>
                    <th className="p-4 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {experienceItems.map((exp) => (
                    <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm sm:text-base">{exp.company}</div>
                        <div className="text-xs text-gray-400 line-clamp-1 max-w-xs mt-0.5">
                          {exp.description}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-cyan-950/30 border border-cyan-800/30 text-xs text-cyan-300 rounded font-semibold">
                          {exp.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        {exp.duration}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditExpModal(exp)}
                            className="p-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/20 rounded transition-all"
                            title="Edit Experience"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteExperience(exp.id, exp.company)}
                            className="p-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded transition-all"
                            title="Delete Experience"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* CRUD Overlay Modal for Projects */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-neutral-900 border-2 border-white/20 max-w-2xl w-full rounded-2xl shadow-2xl p-6 sm:p-8 animate-scale-up">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingProject ? `Edit Project: ${editingProject.name}` : 'Add New Portfolio Project'}
            </h3>

            <form onSubmit={handleSubmitProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Project Name <span className="text-pink-300">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    placeholder="E.g., CalcMate"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Live Demo URL <span className="text-pink-300">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={htmlUrl}
                    onChange={(e) => setHtmlUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    placeholder="E.g., https://calcmate.example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  GitHub Repo URL
                  <span className="ml-2 text-gray-600 font-normal normal-case">(optional — shows a Repo button on the card)</span>
                </label>
                <input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  placeholder="E.g., https://github.com/Tetsuuya/calcmate"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Description <span className="text-pink-300">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  placeholder="Describe the application features and highlights..."
                />
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Project Image
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Drop Zone */}
                  <div
                    className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all duration-200 min-h-[120px] ${
                      isDraggingOver
                        ? 'border-pink-400 bg-pink-500/10'
                        : 'border-white/20 bg-white/5 hover:border-pink-400/60 hover:bg-pink-500/5'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingOver(false);
                      const file = e.dataTransfer.files?.[0] || null;
                      handleImageFileChange(file);
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileChange(e.target.files?.[0] || null)}
                    />
                    {imageUploadLoading ? (
                      <>
                        <div className="w-8 h-8 border-4 border-transparent border-t-pink-400 border-pink-400/20 rounded-full animate-spin" />
                        <span className="text-xs text-gray-400">Uploading...</span>
                      </>
                    ) : imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-24 object-cover rounded-lg border border-white/10"
                          style={{ objectPosition: imagePosition }}
                        />
                        <span className="text-[10px] text-gray-500">Click to replace</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs text-gray-400 text-center leading-tight">
                          Drop image here<br /><span className="text-pink-400">or click to browse</span>
                        </span>
                        <span className="text-[10px] text-gray-600">PNG, JPG, WebP · Max 5 MB</span>
                      </>
                    )}
                  </div>

                  {/* Manual URL fallback + clear */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Or paste URL manually</label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => {
                        setImage(e.target.value);
                        setImagePreview(e.target.value);
                        setImageFile(null);
                      }}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                      placeholder="https://example.com/image.png"
                    />
                    {imageUploadError && (
                      <p className="text-[11px] text-red-400 leading-snug">{imageUploadError}</p>
                    )}
                    {imageFile && !imageUploadLoading && !imageUploadError && (
                      <p className="text-[11px] text-green-400 leading-snug truncate">
                        ✓ {imageFile.name}
                      </p>
                    )}
                    {(image || imagePreview) && (
                      <button
                        type="button"
                        onClick={() => { setImage(''); setImagePreview(''); setImageFile(null); setImageUploadError(null); }}
                        className="mt-auto text-[11px] text-red-400/70 hover:text-red-400 transition-colors text-left"
                      >
                        ✕ Remove image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Focal Point Picker — shown only when there's an image */}
              {imagePreview && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Image Focal Point
                    <span className="ml-2 text-gray-600 font-normal normal-case">
                      — click a zone to choose which part shows in the card
                    </span>
                  </label>
                  <div className="flex gap-4 items-start">
                    {/* Live preview */}
                    <div className="flex-shrink-0 w-36 h-24 rounded-lg border border-white/10 overflow-hidden bg-black/40">
                      <img
                        src={imagePreview}
                        alt="Focal preview"
                        className="w-full h-full object-cover"
                        style={{ objectPosition: imagePosition }}
                      />
                    </div>

                    {/* 3×3 grid */}
                    <div className="flex flex-col gap-1">
                      {(['top', 'center', 'bottom'] as const).map((vert) => (
                        <div key={vert} className="flex gap-1">
                          {(['left', 'center', 'right'] as const).map((horiz) => {
                            const pos = `${horiz} ${vert}`;
                            const isActive = imagePosition === pos;
                            return (
                              <button
                                key={pos}
                                type="button"
                                title={pos}
                                onClick={() => setImagePosition(pos)}
                                className={`w-8 h-8 rounded border text-[10px] font-bold transition-all duration-150 ${
                                  isActive
                                    ? 'bg-pink-500/30 border-pink-400 text-pink-300 shadow-[0_0_8px_rgba(236,72,153,0.5)]'
                                    : 'bg-white/5 border-white/15 text-gray-500 hover:border-pink-400/50 hover:bg-pink-500/10 hover:text-pink-400'
                                }`}
                              >
                                {horiz === 'left' && vert === 'top' && '↖'}
                                {horiz === 'center' && vert === 'top' && '↑'}
                                {horiz === 'right' && vert === 'top' && '↗'}
                                {horiz === 'left' && vert === 'center' && '←'}
                                {horiz === 'center' && vert === 'center' && '⊙'}
                                {horiz === 'right' && vert === 'center' && '→'}
                                {horiz === 'left' && vert === 'bottom' && '↙'}
                                {horiz === 'center' && vert === 'bottom' && '↓'}
                                {horiz === 'right' && vert === 'bottom' && '↘'}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                      <p className="text-[10px] text-gray-600 mt-1">Position: <span className="text-gray-400">{imagePosition}</span></p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Tech Stack <span className="text-gray-500 font-normal italic">(Comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  placeholder="E.g., React, TypeScript, Tailwind"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Stars Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stars}
                    onChange={(e) => setStars(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Forks Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={forks}
                    onChange={(e) => setForks(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Updated At Date
                  </label>
                  <input
                    type="date"
                    value={updatedAt}
                    onChange={(e) => setUpdatedAt(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-pink-500 focus:ring-pink-500 border-white/15 bg-white/5"
                />
                <label htmlFor="featured" className="text-sm text-gray-300 font-semibold cursor-pointer">
                  Feature this project on the home page
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white bg-white/5 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-semibold text-white border-2 border-pink-400 bg-pink-500/10 hover:bg-pink-500/20 rounded-lg transition-all shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                >
                  {loading ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRUD Overlay Modal for Tech Items */}
      {isTechModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-neutral-900 border-2 border-white/20 max-w-2xl w-full rounded-2xl shadow-2xl p-6 sm:p-8 animate-scale-up">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingTechItem ? `Edit Tech Item: ${editingTechItem.name}` : 'Add New Tech Item'}
            </h3>

            <form onSubmit={handleSubmitTechItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Tech Name <span className="text-pink-300">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={techName}
                    onChange={(e) => setTechName(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    placeholder="E.g., GraphQL"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Category <span className="text-pink-300">*</span>
                  </label>
                  <select
                    value={techCategory}
                    onChange={(e) => setTechCategory(e.target.value as TechCategoryType)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  >
                    <option value="Language">Language</option>
                    <option value="Framework">Framework</option>
                    <option value="Database">Database</option>
                    <option value="Design">Design</option>
                    <option value="Tool">Tool</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-grow">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Icon (SVG Markup or Image URL) <span className="text-pink-300">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={techIcon}
                    onChange={(e) => setTechIcon(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-xs animate-pulse-subtle"
                    placeholder="Paste <svg>...</svg> tag markup OR enter direct image URL (e.g., https://example.com/logo.png)"
                  />
                </div>
                {techIcon.trim() && (
                  <div className="flex flex-col items-center justify-center w-20 h-20 bg-white/5 border border-white/10 rounded-lg p-2 text-white flex-shrink-0 self-end mb-1">
                    <span className="text-[10px] text-gray-500 mb-1">Preview</span>
                    <div className="w-10 h-10 flex items-center justify-center">
                      {techIcon.trim().toLowerCase().startsWith('<svg') ? (
                        <div 
                          className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain flex items-center justify-center" 
                          dangerouslySetInnerHTML={{ __html: techIcon }} 
                        />
                      ) : (
                        <img 
                          src={techIcon} 
                          alt="Preview" 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsTechModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white bg-white/5 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-semibold text-white border-2 border-pink-400 bg-pink-500/10 hover:bg-pink-500/20 rounded-lg transition-all shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                >
                  {loading ? 'Saving...' : 'Save Tech Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRUD Overlay Modal for Experience */}
      {isExpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-neutral-900 border-2 border-white/20 max-w-2xl w-full rounded-2xl shadow-2xl p-6 sm:p-8 animate-scale-up">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingExperience ? `Edit Experience: ${editingExperience.company}` : 'Add New Experience'}
            </h3>

            <form onSubmit={handleSubmitExperience} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Company / Organization <span className="text-pink-300">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    placeholder="E.g., Tech Solutions Inc."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Role / Position <span className="text-pink-300">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={expRole}
                    onChange={(e) => setExpRole(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    placeholder="E.g., Senior Full-Stack Developer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Duration <span className="text-pink-300">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={expDuration}
                    onChange={(e) => setExpDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    placeholder="E.g., Jan 2024 - Present"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={expLocation}
                    onChange={(e) => setExpLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    placeholder="E.g., Cagayan de Oro, Philippines (Remote)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Job Type
                </label>
                <input
                  type="text"
                  value={expJobType}
                  onChange={(e) => setExpJobType(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  placeholder="E.g., Part-time, Full-time, Contract"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Description / Responsibilities <span className="text-pink-300">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  placeholder="Describe your role and key tasks..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Key Achievements (One per line)
                </label>
                <textarea
                  rows={4}
                  value={expAchievementsInput}
                  onChange={(e) => setExpAchievementsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  placeholder="E.g.&#10;Built real estate platform using Payload CMS.&#10;Delivered full-stack features end-to-end."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  value={expTechStackInput}
                  onChange={(e) => setExpTechStackInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  placeholder="E.g. Next.js, TypeScript, Tailwind CSS, tRPC"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white bg-white/5 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-semibold text-white border-2 border-pink-400 bg-pink-500/10 hover:bg-pink-500/20 rounded-lg transition-all shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                >
                  {loading ? 'Saving...' : 'Save Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
