// Mock data store for static site export
let projects = [
  {
    id: '1',
    title: 'Example Research Project',
    description: 'This is an example project created for demonstration purposes.',
    userId: 'default-user-id',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Get all projects
export function getAllProjects() {
  return [...projects];
}

// Get project by ID
export function getProjectById(id: string) {
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
  
  // In a real application with localStorage:
  // localStorage.setItem('projects', JSON.stringify(projects));
  
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
  
  // In a real application with localStorage:
  // localStorage.setItem('projects', JSON.stringify(projects));
  
  return updatedProject;
}

// Delete project
export function deleteProject(id: string) {
  const index = projects.findIndex(project => project.id === id);
  if (index === -1) return false;
  
  projects.splice(index, 1);
  
  // In a real application with localStorage:
  // localStorage.setItem('projects', JSON.stringify(projects));
  
  return true;
} 