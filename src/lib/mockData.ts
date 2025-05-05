// Define interfaces for better type safety
export interface Task {
  id: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done' | 'Updated';
  completed: boolean;
  dueDate?: string;
  comments?: string;
}

export interface Milestone {
  id: string;
  title: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  dueDate?: string;
  description?: string;
  tasks: Task[];
}

export interface TheoreticalSource {
  id: string;
  type: 'paper' | 'book';
  title: string;
  url?: string;
  notes?: string;
}

export interface CodingInfo {
  repoUrl?: string;
  notes?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  planAndAim?: string;
  milestones: Milestone[];
  theoreticalBackground: TheoreticalSource[];
  coding?: CodingInfo;
  results?: string;
  notes?: string;
}

// Mock data store for static site export
const initialProjects: Project[] = [
  {
    id: '1',
    title: 'Example Research Project',
    description: 'This is an example project created for demonstration purposes.',
    userId: 'default-user-id',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    planAndAim: 'To demonstrate the features of the Research Tracking System.',
    milestones: [
      {
        id: 'm1',
        title: 'Literature Review',
        status: 'Completed',
        dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        description: 'Review existing literature on the topic.',
        tasks: [
          { id: 't1', description: 'Identify key papers', status: 'Done', completed: true },
          { id: 't2', description: 'Summarize findings', status: 'Done', completed: true },
        ],
      },
      {
        id: 'm2',
        title: 'Methodology Design',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
        tasks: [
          { id: 't3', description: 'Define experiment setup', status: 'In Progress', completed: false },
          { id: 't4', description: 'Select measurement tools', status: 'To Do', completed: false },
        ],
      },
    ],
    theoreticalBackground: [
      { id: 'tb1', type: 'paper', title: 'Foundational Paper on Subject X', url: 'http://example.com/paper1' },
      { id: 'tb2', type: 'book', title: 'Comprehensive Book on Methodology Y', notes: 'Chapters 3 and 5 are most relevant.' },
    ],
    coding: {
      repoUrl: 'http://github.com/example/repo',
      notes: 'Main simulation code.'
    },
    results: 'Initial results show promising trends...',
    notes: 'Need to double-check the calculations in the methodology section.'
  }
];

// Initialize projects from localStorage if available, otherwise use initial data
let projects: Project[] = initialProjects;

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
export function getAllProjects(): Project[] {
  // If in browser, get fresh data from localStorage
  if (typeof window !== 'undefined') {
    try {
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        // Basic validation to ensure it's an array
        const parsed = JSON.parse(savedProjects);
        return Array.isArray(parsed) ? parsed : [...initialProjects]; 
      }
    } catch (error) {
      console.error('Error reading projects from localStorage:', error);
      // Fallback to in-memory projects if localStorage fails
      return [...projects];
    }
  }
  // Return a copy to prevent direct modification of the in-memory array
  return [...projects];
}

// Get project by ID
export function getProjectById(id: string): Project | undefined {
  let projectsToSearch = projects;
  // If in browser, get fresh data from localStorage
  if (typeof window !== 'undefined') {
    try {
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed)) {
           projectsToSearch = parsed;
        }
      }
    } catch (error) {
      console.error('Error reading project from localStorage:', error);
    }
  }
  return projectsToSearch.find((project) => project.id === id);
}

// Create new project
export function createProject(data: { 
  title: string; 
  description?: string; 
  userId: string;
  planAndAim?: string;
  // We might not create all details initially, add them later?
}) {
  const newProject: Project = {
    id: Date.now().toString(),
    title: data.title,
    description: data.description || '',
    userId: data.userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    planAndAim: data.planAndAim || '',
    milestones: [], // Start with empty milestones
    theoreticalBackground: [], // Start empty
    coding: {},
    results: '',
    notes: ''
  };
  
  // Update the in-memory store first
  const currentProjects = getAllProjects(); // Ensures we get latest from localStorage if available
  currentProjects.push(newProject);
  projects = currentProjects; // Update the module-level variable
  
  // Save to localStorage if in browser environment
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('projects', JSON.stringify(currentProjects));
      console.log('Saved new project to localStorage:', newProject);
    } catch (error) {
      console.error('Error saving new project to localStorage:', error);
    }
  }
  
  return newProject;
}

// Update project - Needs to handle all new fields
export function updateProject(id: string, data: Partial<Omit<Project, 'id' | 'createdAt' | 'userId'>>) {
  const currentProjects = getAllProjects();
  const index = currentProjects.findIndex(project => project.id === id);
  if (index === -1) return null;
  
  const updatedProject: Project = {
    ...currentProjects[index],
    ...data, // Apply partial updates
    updatedAt: new Date().toISOString()
  };
  
  currentProjects[index] = updatedProject;
  projects = currentProjects; // Update the module-level variable

  // Save to localStorage if in browser environment
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('projects', JSON.stringify(currentProjects));
      console.log('Updated project in localStorage:', updatedProject);
    } catch (error) {
      console.error('Error saving updated project to localStorage:', error);
    }
  }
  
  return updatedProject;
}

// Delete project
export function deleteProject(id: string): boolean {
  const currentProjects = getAllProjects();
  const initialLength = currentProjects.length;
  const filteredProjects = currentProjects.filter(project => project.id !== id);
  
  if (filteredProjects.length === initialLength) return false; // Project not found

  projects = filteredProjects; // Update the module-level variable

  // Save to localStorage if in browser environment
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('projects', JSON.stringify(filteredProjects));
      console.log('Deleted project from localStorage, remaining projects:', filteredProjects.length);
    } catch (error) {
      console.error('Error saving after deletion to localStorage:', error);
    }
  }
  
  return true;
}

// --- Functions for managing sub-entities (Milestones, Tasks, etc.) ---

// Example: Add a milestone to a project
export function addMilestone(projectId: string, milestoneData: Omit<Milestone, 'id' | 'tasks'>): Milestone | null {
  const project = getProjectById(projectId);
  if (!project) return null;

  const newMilestone: Milestone = {
    ...milestoneData,
    id: `m-${Date.now()}`,
    tasks: [],
    status: milestoneData.status || 'Not Started',
  };

  project.milestones.push(newMilestone);
  updateProject(projectId, { milestones: project.milestones });
  return newMilestone;
}

// Example: Add a task to a milestone
export function addTask(projectId: string, milestoneId: string, taskData: Omit<Task, 'id' | 'completed'>): Task | null {
  const project = getProjectById(projectId);
  if (!project) return null;

  const milestone = project.milestones.find(m => m.id === milestoneId);
  if (!milestone) return null;

  const newTask: Task = {
    ...taskData,
    id: `t-${Date.now()}`,
    completed: false,
    status: taskData.status || 'To Do',
  };

  milestone.tasks.push(newTask);
  updateProject(projectId, { milestones: project.milestones });
  return newTask;
}

// Update Task Status
export function updateTaskStatus(projectId: string, milestoneId: string, taskId: string, completed: boolean): Task | null {
  const project = getProjectById(projectId);
  if (!project) return null;

  const milestone = project.milestones.find(m => m.id === milestoneId);
  if (!milestone) return null;

  const task = milestone.tasks.find(t => t.id === taskId);
  if (!task) return null;

  task.completed = completed;
  // Optionally update status based on completion
  task.status = completed ? 'Done' : 'In Progress'; // Or revert to 'To Do' if needed?

  // Update the project in the main list
  updateProject(projectId, { milestones: project.milestones }); 

  return task;
}

// Add Theoretical Source
export function addTheoreticalSource(projectId: string, sourceData: Omit<TheoreticalSource, 'id'>): TheoreticalSource | null {
  const project = getProjectById(projectId);
  if (!project) return null;

  const newSource: TheoreticalSource = {
    ...sourceData,
    id: `ts-${Date.now()}`,
  };

  // Ensure theoreticalBackground array exists
  if (!project.theoreticalBackground) {
    project.theoreticalBackground = [];
  }
  
  project.theoreticalBackground.push(newSource);
  updateProject(projectId, { theoreticalBackground: project.theoreticalBackground });
  return newSource;
}

// Delete Milestone
export function deleteMilestone(projectId: string, milestoneId: string): boolean {
  const project = getProjectById(projectId);
  if (!project || !project.milestones) return false;

  const initialLength = project.milestones.length;
  project.milestones = project.milestones.filter(m => m.id !== milestoneId);
  
  if (project.milestones.length === initialLength) return false; // Not found

  updateProject(projectId, { milestones: project.milestones });
  return true;
}

// Delete Task
export function deleteTask(projectId: string, milestoneId: string, taskId: string): boolean {
  const project = getProjectById(projectId);
  if (!project || !project.milestones) return false;

  const milestone = project.milestones.find(m => m.id === milestoneId);
  if (!milestone || !milestone.tasks) return false;

  const initialLength = milestone.tasks.length;
  milestone.tasks = milestone.tasks.filter(t => t.id !== taskId);

  if (milestone.tasks.length === initialLength) return false; // Not found

  updateProject(projectId, { milestones: project.milestones });
  return true;
}

// Delete Theoretical Source
export function deleteTheoreticalSource(projectId: string, sourceId: string): boolean {
  const project = getProjectById(projectId);
  if (!project || !project.theoreticalBackground) return false;

  const initialLength = project.theoreticalBackground.length;
  project.theoreticalBackground = project.theoreticalBackground.filter(s => s.id !== sourceId);

  if (project.theoreticalBackground.length === initialLength) return false; // Not found

  updateProject(projectId, { theoreticalBackground: project.theoreticalBackground });
  return true;
}

// Update Milestone
export function updateMilestone(projectId: string, milestoneId: string, data: Partial<Omit<Milestone, 'id' | 'tasks'>>): Milestone | null {
  const project = getProjectById(projectId);
  if (!project || !project.milestones) return null;

  const milestoneIndex = project.milestones.findIndex(m => m.id === milestoneId);
  if (milestoneIndex === -1) return null; // Not found

  // Update the milestone data (excluding id and tasks)
  const updatedMilestone = { 
      ...project.milestones[milestoneIndex], 
      ...data 
  };
  project.milestones[milestoneIndex] = updatedMilestone;

  updateProject(projectId, { milestones: project.milestones });
  return updatedMilestone;
}

// Update Task
export function updateTask(projectId: string, milestoneId: string, taskId: string, data: Partial<Omit<Task, 'id'> >): Task | null {
  const project = getProjectById(projectId);
  if (!project || !project.milestones) return null;

  const milestone = project.milestones.find(m => m.id === milestoneId);
  if (!milestone || !milestone.tasks) return null;

  const taskIndex = milestone.tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return null; // Task not found

  // Update task data, ensuring completion status matches Done status if provided
  const updatedData = { ...data };
  if (updatedData.status === 'Done') {
    updatedData.completed = true;
  } else if (updatedData.status === 'To Do' || updatedData.status === 'In Progress' || updatedData.status === 'Updated') {
      updatedData.completed = false;
  }
  // If completed is provided directly, update status accordingly (optional)
  // else if (updatedData.completed !== undefined) { ... }

  const updatedTask = {
    ...milestone.tasks[taskIndex],
    ...updatedData // Apply the changes
  };
  milestone.tasks[taskIndex] = updatedTask;

  updateProject(projectId, { milestones: project.milestones });
  return updatedTask;
}

// Update Theoretical Source
export function updateTheoreticalSource(projectId: string, sourceId: string, data: Partial<Omit<TheoreticalSource, 'id'>>): TheoreticalSource | null {
  const project = getProjectById(projectId);
  if (!project || !project.theoreticalBackground) return null;

  const sourceIndex = project.theoreticalBackground.findIndex(s => s.id === sourceId);
  if (sourceIndex === -1) return null; // Not found

  const updatedSource = {
    ...project.theoreticalBackground[sourceIndex],
    ...data // Apply the changes
  };
  project.theoreticalBackground[sourceIndex] = updatedSource;

  updateProject(projectId, { theoreticalBackground: project.theoreticalBackground });
  return updatedSource;
}

// Add similar functions for updating/deleting milestones/tasks, managing theoretical background, etc. as needed. 