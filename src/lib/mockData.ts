// Mock data store for static site export
const initialProjects = [
  {
    id: '1',
    title: 'Example Research Project',
    description: 'This is an example project created for demonstration purposes.',
    userId: 'default-user-id',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Initialize projects from localStorage if available, otherwise use initial data
let projects = initialProjects;

// Check if we're in a browser environment (not during static rendering)
if (typeof window !== 'undefined') {
  try {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      projects = JSON.parse(savedProjects);
      console.log('Loaded projects from localStorage:', projects);
    } else {
      // If no projects in localStorage, initialize with default and save
      localStorage.setItem('projects', JSON.stringify(initialProjects));
      console.log('Initialized localStorage with default projects');
    }
  } catch (error) {
    console.error('Error loading projects from localStorage:', error);
  }
}

// Get all projects
export function getAllProjects() {
  // If in browser, get fresh data from localStorage
  if (typeof window !== 'undefined') {
    try {
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        return JSON.parse(savedProjects);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }
  return [...projects];
}

// Get project by ID
export function getProjectById(id: string) {
  // If in browser, get fresh data from localStorage
  if (typeof window !== 'undefined') {
    try {
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        const projectsArray = JSON.parse(savedProjects);
        return projectsArray.find((project: any) => project.id === id);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }
  return projects.find(project => project.id === id);
}

// Create new project
export function createProject(data: { 
  title: string; 
  description?: string; 
  userId: string;
}) {
  const newProject = {
    id: Date.now().toString(),
    title: data.title,
    description: data.description || '',
    userId: data.userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  projects.push(newProject);
  
  // Save to localStorage if in browser environment
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('projects', JSON.stringify(projects));
      console.log('Saved project to localStorage:', newProject);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
  
  return newProject;
}

// Update project
export function updateProject(id: string, data: { 
  title?: string; 
  description?: string;
}) {
  const index = projects.findIndex(project => project.id === id);
  if (index === -1) return null;
  
  const updatedProject = {
    ...projects[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  projects[index] = updatedProject;
  
  // Save to localStorage if in browser environment
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('projects', JSON.stringify(projects));
      console.log('Updated project in localStorage:', updatedProject);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
  
  return updatedProject;
}

// Delete project
export function deleteProject(id: string) {
  const index = projects.findIndex(project => project.id === id);
  if (index === -1) return false;
  
  projects.splice(index, 1);
  
  // Save to localStorage if in browser environment
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('projects', JSON.stringify(projects));
      console.log('Deleted project from localStorage, remaining projects:', projects.length);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
  
  return true;
} 