Creating a local portfolio is the standard for showcase portfolios! Here's how to manage your projects:

## How to Add/Update Projects

### 1. Add Project Data
Edit [`src/data/projects.ts`](../data/projects.ts) and add projects to the `projectsData` array:

```typescript
{
  id: 2,
  name: 'Project Name',
  description: 'Brief description of your project',
  image: '/images/projects/project-name.png',  // Path to your image
  html_url: 'https://github.com/YourUsername/repo-name',
  language: 'TypeScript',
  stargazers_count: 5,      // Optional: GitHub stars
  forks_count: 2,           // Optional: GitHub forks
  updated_at: '2024-01-15T10:30:00Z',
  featured: true,           // Set to true for Featured Projects section
}
```

### 2. Add Project Images
- Create screenshots/previews of your projects
- Save them to: `/public/images/projects/`
- Recommended size: `1200x600px` or `16:9 aspect ratio`
- Supported formats: PNG, JPG, WebP
- Reference in `image` field with path like: `/images/projects/my-project.png`

### 3. Featured vs All Projects
- **Featured Projects** (Homepage): Add `featured: true` to show in the featured section
- **All Projects** (Projects page): All projects with `featured: false` will be listed there
- You can have a mix of both

## Benefits of Local Projects

✅ **No API calls** - Faster, no loading delays  
✅ **No rate limits** - GitHub API won't throttle you  
✅ **Full control** - Show exactly what you want  
✅ **Custom images** - Professional project previews  
✅ **Offline ready** - Works without internet  
✅ **Portfolio standard** - How professional portfolios are built  

## Example Complete Project

```typescript
{
  id: 1,
  name: 'E-Commerce Platform',
  description: 'Full-stack e-commerce site with Django backend and React frontend',
  image: '/images/projects/ecommerce.png',
  html_url: 'https://github.com/yourname/ecommerce',
  language: 'Python',
  stargazers_count: 25,
  forks_count: 5,
  updated_at: '2024-12-20T15:45:00Z',
  featured: true,
}
```

That's it! No more GitHub API loads or missing images. 🚀
