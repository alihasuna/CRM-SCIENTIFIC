'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  deleteProject, 
  Project, 
  Milestone, 
  Task, 
  TheoreticalSource, 
  CodingInfo, 
  updateTaskStatus,
  addMilestone,
  addTask,
  addTheoreticalSource,
  updateProject,
  deleteMilestone,
  deleteTask,
  deleteTheoreticalSource,
  updateMilestone,
  updateTask,
  updateTheoreticalSource
} from '@/lib/mockData';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import AddMilestoneModal from '@/components/AddMilestoneModal';
import AddTaskModal from '@/components/AddTaskModal';
import AddSourceModal from '@/components/AddSourceModal';
import InlineEditField from '@/components/InlineEditField';
import EditMilestoneModal from '@/components/EditMilestoneModal';
import EditTaskModal from '@/components/EditTaskModal';
import EditSourceModal from '@/components/EditSourceModal';

type ProjectDetailClientProps = {
  project: Project;
};

// Helper function to format date strings
const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'PP'); // e.g., Sep 21, 2024
  } catch (e) {
    return 'Invalid Date';
  }
};

export default function ProjectDetailClient({ 
  project, 
}: ProjectDetailClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  // State to toggle milestone task visibility
  const [visibleTasks, setVisibleTasks] = useState<Record<string, boolean>>({});
  // Add state to manage local project data for immediate UI updates
  const [currentProject, setCurrentProject] = useState<Project>(project);
  const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [addingTaskToMilestoneId, setAddingTaskToMilestoneId] = useState<string | null>(null);
  const [isAddSourceModalOpen, setIsAddSourceModalOpen] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null); // State for general errors
  const [isEditMilestoneModalOpen, setIsEditMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false); // State for Edit Task Modal
  const [editingTask, setEditingTask] = useState<Task | null>(null); // State for task being edited
  const [editingTaskMilestoneId, setEditingTaskMilestoneId] = useState<string | null>(null); // Track milestone context
  const [isEditSourceModalOpen, setIsEditSourceModalOpen] = useState(false); // State for Edit Source Modal
  const [editingSource, setEditingSource] = useState<TheoreticalSource | null>(null); // State for source being edited
  
  useEffect(() => {
    setCurrentProject(project);
    setGeneralError(null); // Clear errors when project data reloads
  }, [project]);

  // Helper to clear error after a delay
  const clearErrorAfterDelay = () => {
    setTimeout(() => setGeneralError(null), 5000); // Clear error after 5 seconds
  };

  const toggleTasksVisibility = (milestoneId: string) => {
    setVisibleTasks(prev => ({ ...prev, [milestoneId]: !prev[milestoneId] }));
  };
  
  // Handler for Task Checkbox Toggle
  const handleTaskToggle = async (milestoneId: string, taskId: string, currentCompleted: boolean) => {
    setGeneralError(null); // Clear previous errors
    const newCompleted = !currentCompleted;
    
    // Create the expected updated task for optimistic update
    const updatedTaskState: Task = { 
        // Find the task to get its existing properties
        ...(currentProject.milestones.find(m => m.id === milestoneId)?.tasks.find(t => t.id === taskId) as Task), 
        completed: newCompleted, 
        status: newCompleted ? 'Done' : 'In Progress' // Adjust logic as needed
    };

    // Optimistic UI Update
    setCurrentProject(prevProject => {
      if (!prevProject) return prevProject; // Should not happen
      return {
        ...prevProject,
        milestones: prevProject.milestones.map(m => 
          m.id === milestoneId 
            ? { 
                ...m, 
                tasks: m.tasks.map(t => 
                  t.id === taskId ? updatedTaskState : t
                )
              } 
            : m
        )
      };
    });

    try {
      const updatedTaskResult = updateTaskStatus(project.id, milestoneId, taskId, newCompleted);
      if (!updatedTaskResult) {
        console.error("Failed to update task status in mockData - reverting UI");
        setGeneralError("Failed to update task. Please try again.");
        setCurrentProject(project);
        clearErrorAfterDelay();
      } else {
        // Data updated successfully in mockData, refresh server data to ensure consistency
        // Note: This refresh might cause a flicker if the optimistic update differs slightly from refreshed data
        router.refresh(); 
      }
    } catch (error) {
      console.error("Error calling updateTaskStatus:", error);
      setGeneralError("An error occurred while updating the task.");
      setCurrentProject(project);
      clearErrorAfterDelay();
    }
  };
  
  const handleDelete = async () => {
    if (isDeleting) return;
    
    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
      setIsDeleting(true);
      try {
        const deleted = deleteProject(project.id);
        if (deleted) {
          router.push('/projects');
          // No need to refresh here as we are navigating away
        } else {
          alert('Failed to delete project');
          setIsDeleting(false);
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        setIsDeleting(false);
        // Show error to user?
      }
      // No finally block needed if navigating away on success
    }
  };

  // Handler for Adding a Milestone
  const handleAddMilestone = async (milestoneData: Omit<Milestone, 'id' | 'tasks'>) => {
    setGeneralError(null);
    try {
      const newMilestone = addMilestone(project.id, milestoneData);
      if (!newMilestone) {
        throw new Error("Failed to add milestone in mockData");
      }
      
      // Optimistic Update (more complex, could just refresh)
      setCurrentProject(prev => prev ? ({ 
          ...prev, 
          milestones: [...prev.milestones, { ...newMilestone, tasks: [] }] // Add new milestone
      }) : prev);
      
      setIsAddMilestoneModalOpen(false); // Close modal on success
      router.refresh(); // Refresh to ensure full consistency

    } catch (error) {
      console.error("Error adding milestone:", error);
      setGeneralError("Failed to add milestone. Please try again.");
      // Re-throw error to be caught by modal's error handling
      throw error; 
    }
  };

  // --- New Handlers for Add Task --- 
  const openAddTaskModal = (milestoneId: string) => {
    setAddingTaskToMilestoneId(milestoneId);
    setIsAddTaskModalOpen(true);
  };

  const closeAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
    setAddingTaskToMilestoneId(null);
  };

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'completed'>) => {
    setGeneralError(null);
    if (!addingTaskToMilestoneId) return; // Should not happen
    
    try {
      const newTask = addTask(project.id, addingTaskToMilestoneId, taskData);
      if (!newTask) {
        throw new Error("Failed to add task in mockData");
      }
      
      // Optimistic Update
      setCurrentProject(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          milestones: prev.milestones.map(m => 
            m.id === addingTaskToMilestoneId
              ? { ...m, tasks: [...m.tasks, newTask] } // Add new task to the correct milestone
              : m
          )
        };
      });
      
      closeAddTaskModal(); // Close modal on success
      router.refresh(); // Refresh data

    } catch (error) {
      console.error("Error adding task:", error);
      setGeneralError("Failed to add task. Please try again.");
      // Re-throw error for modal
      throw error; 
    }
  };
  // --- End Add Task Handlers ---

  // --- Add Source Handler ---
  const handleAddSource = async (sourceData: Omit<TheoreticalSource, 'id'>) => {
    setGeneralError(null);
     try {
      const newSource = addTheoreticalSource(project.id, sourceData);
      if (!newSource) {
        throw new Error("Failed to add source in mockData");
      }
      
      // Optimistic Update
      setCurrentProject(prev => prev ? ({ 
          ...prev, 
          // Ensure array exists before spreading
          theoreticalBackground: [...(prev.theoreticalBackground || []), newSource] 
      }) : prev);
      
      setIsAddSourceModalOpen(false); // Close modal on success
      router.refresh(); // Refresh data

    } catch (error) {
      console.error("Error adding source:", error);
      setGeneralError("Failed to add source. Please try again.");
      // Re-throw error for modal
      throw error; 
    }
  };
  // --- End Add Source Handler ---

  // --- Generic Field Save Handler ---
  const handleSaveField = async (fieldName: string, newValue: string) => {
    setGeneralError(null);
    const updateData: Partial<Omit<Project, 'id' | 'createdAt' | 'userId'>> = {};

    // Handle nested coding fields
    if (fieldName === 'coding.repoUrl' || fieldName === 'coding.notes') {
      const key = fieldName.split('.')[1] as keyof CodingInfo;
      updateData.coding = { ...currentProject.coding, [key]: newValue };
    } else {
      // Handle top-level fields
      (updateData as any)[fieldName] = newValue;
    }

    try {
      const updatedProjectResult = updateProject(project.id, updateData);
      if (!updatedProjectResult) {
        throw new Error(`Failed to update field ${fieldName} in mockData`);
      }

      // Optimistic Update
      setCurrentProject(prev => prev ? ({ ...prev, ...updateData }) : prev);

      router.refresh(); // Refresh data
    } catch (error) {
      console.error(`Error updating field ${fieldName}:`, error);
      setGeneralError("Failed to save changes. Please try again.");
      // Re-throw error for InlineEditField to handle
      throw error; 
    }
  };
  // --- End Save Field Handler ---

  // --- Delete Milestone Handler ---
  const handleDeleteMilestone = async (milestoneId: string, milestoneTitle: string) => {
    setGeneralError(null);
    if (!confirm(`Are you sure you want to delete the milestone "${milestoneTitle}"? This will also delete all its tasks.`)) {
      return;
    }

    const originalMilestones = currentProject.milestones;

    // Optimistic Update
    setCurrentProject(prev => prev ? ({ 
        ...prev, 
        milestones: prev.milestones.filter(m => m.id !== milestoneId) 
    }) : prev);

    try {
      const success = deleteMilestone(project.id, milestoneId);
      if (!success) {
        throw new Error("Failed to delete milestone in mockData");
      }
      router.refresh(); // Refresh data after successful deletion
    } catch (error) {
      console.error("Error deleting milestone:", error);
      setGeneralError("Failed to delete milestone. Please try again.");
      // Revert optimistic update
      setCurrentProject(prev => prev ? ({ ...prev, milestones: originalMilestones }) : prev);
      clearErrorAfterDelay();
    }
  };
  // --- End Delete Milestone Handler ---

  // --- Delete Task Handler ---
  const handleDeleteTask = async (milestoneId: string, taskId: string, taskDescription: string) => {
    setGeneralError(null);
    // Simple confirm for task deletion, could be less intrusive
    if (!confirm(`Are you sure you want to delete the task "${taskDescription}"?`)) {
      return;
    }

    const originalMilestones = currentProject.milestones;

    // Optimistic Update
    setCurrentProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        milestones: prev.milestones.map(m => 
          m.id === milestoneId
            ? { ...m, tasks: m.tasks.filter(t => t.id !== taskId) }
            : m
        )
      };
    });

    try {
      const success = deleteTask(project.id, milestoneId, taskId);
      if (!success) {
        throw new Error("Failed to delete task in mockData");
      }
      router.refresh(); // Refresh data after successful deletion
    } catch (error) {
      console.error("Error deleting task:", error);
      setGeneralError("Failed to delete task. Please try again.");
      // Revert optimistic update
      setCurrentProject(prev => prev ? ({ ...prev, milestones: originalMilestones }) : prev);
      clearErrorAfterDelay();
    }
  };
  // --- End Delete Task Handler ---

  // --- Delete Source Handler ---
  const handleDeleteSource = async (sourceId: string, sourceTitle: string) => {
    setGeneralError(null);
    if (!confirm(`Are you sure you want to delete the source "${sourceTitle}"?`)) {
      return;
    }

    const originalSources = currentProject.theoreticalBackground;

    // Optimistic Update
    setCurrentProject(prev => prev ? ({ 
        ...prev, 
        theoreticalBackground: (prev.theoreticalBackground || []).filter(s => s.id !== sourceId) 
    }) : prev);

    try {
      const success = deleteTheoreticalSource(project.id, sourceId);
      if (!success) {
        throw new Error("Failed to delete source in mockData");
      }
      router.refresh(); // Refresh data after successful deletion
    } catch (error) {
      console.error("Error deleting source:", error);
      setGeneralError("Failed to delete source. Please try again.");
      // Revert optimistic update
      setCurrentProject(prev => prev ? ({ ...prev, theoreticalBackground: originalSources }) : prev);
      clearErrorAfterDelay();
    }
  };
  // --- End Delete Source Handler ---

  // --- Edit Milestone Handlers ---
  const openEditMilestoneModal = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setIsEditMilestoneModalOpen(true);
  };

  const closeEditMilestoneModal = () => {
    setIsEditMilestoneModalOpen(false);
    setEditingMilestone(null);
  };

  const handleUpdateMilestone = async (milestoneId: string, data: Omit<Milestone, 'id' | 'tasks'>) => {
    setGeneralError(null);
    try {
      const updatedMilestone = updateMilestone(project.id, milestoneId, data);
      if (!updatedMilestone) {
        throw new Error("Failed to update milestone in mockData");
      }
      
      // Optimistic Update
      setCurrentProject(prev => prev ? ({ 
          ...prev, 
          milestones: prev.milestones.map(m => m.id === milestoneId ? { ...m, ...data } : m)
      }) : prev);
      
      closeEditMilestoneModal(); // Close modal on success
      router.refresh(); // Refresh data

    } catch (error) {
      console.error("Error updating milestone:", error);
      // Re-throw error for modal display
      throw error; 
    }
  };
  // --- End Edit Milestone Handlers ---

  // --- Edit Task Handlers ---
  const openEditTaskModal = (milestoneId: string, task: Task) => {
    setEditingTaskMilestoneId(milestoneId);
    setEditingTask(task);
    setIsEditTaskModalOpen(true);
  };

  const closeEditTaskModal = () => {
    setIsEditTaskModalOpen(false);
    setEditingTask(null);
    setEditingTaskMilestoneId(null);
  };

  const handleUpdateTask = async (taskId: string, data: Omit<Task, 'id' | 'completed'>) => {
    setGeneralError(null);
    if (!editingTaskMilestoneId) return; // Should not happen

    try {
      const updatedTask = updateTask(project.id, editingTaskMilestoneId, taskId, data);
      if (!updatedTask) {
        throw new Error("Failed to update task in mockData");
      }
      
      // Optimistic Update
      setCurrentProject(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          milestones: prev.milestones.map(m => 
            m.id === editingTaskMilestoneId
              ? { ...m, tasks: m.tasks.map(t => t.id === taskId ? updatedTask : t) }
              : m
          )
        };
      });
      
      closeEditTaskModal(); // Close modal on success
      router.refresh(); // Refresh data

    } catch (error) {
      console.error("Error updating task:", error);
      // Re-throw error for modal display
      throw error; 
    }
  };
  // --- End Edit Task Handlers ---

  // --- Edit Source Handlers ---
  const openEditSourceModal = (source: TheoreticalSource) => {
    setEditingSource(source);
    setIsEditSourceModalOpen(true);
  };

  const closeEditSourceModal = () => {
    setIsEditSourceModalOpen(false);
    setEditingSource(null);
  };

  const handleUpdateSource = async (sourceId: string, data: Omit<TheoreticalSource, 'id'>) => {
    setGeneralError(null);
    try {
      const updatedSource = updateTheoreticalSource(project.id, sourceId, data);
      if (!updatedSource) {
        throw new Error("Failed to update source in mockData");
      }
      
      // Optimistic Update
      setCurrentProject(prev => {
        if (!prev || !prev.theoreticalBackground) return prev;
        return {
          ...prev,
          theoreticalBackground: prev.theoreticalBackground.map(s => 
            s.id === sourceId ? updatedSource : s
          )
        };
      });
      
      closeEditSourceModal(); // Close modal on success
      router.refresh(); // Refresh data

    } catch (error) {
      console.error("Error updating source:", error);
      // Re-throw error for modal display
      throw error; 
    }
  };
  // --- End Edit Source Handlers ---

  if (!currentProject) return null; 

  return (
    <>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Display General Error */} 
        {generalError && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md fixed bottom-4 right-4 z-50 shadow-lg" role="alert">
                {generalError}
                <button onClick={() => setGeneralError(null)} className="ml-4 font-bold text-red-800">&times;</button>
            </div>
        )}
        <div className="px-4 py-4 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Link
                href="/projects"
                className="mr-4 p-1 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 truncate">{currentProject.title}</h1>
            </div>
            <div className="flex space-x-3">
              <Link 
                href={`/projects/${currentProject.id}/edit`}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </Link>
              <button 
                className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>

          {/* General Plan and Aim */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">General Plan and Aim</h2>
            </div>
            <div className="px-6 py-5">
              <InlineEditField
                fieldName="planAndAim"
                initialValue={currentProject.planAndAim}
                onSave={handleSaveField}
                displayAs="textarea"
                textareaProps={{ rows: 4 }}
                placeholder="Define the main goal and overall plan..."
                emptyText="No plan defined yet. Click the edit icon to add one."
              />
            </div>
          </div>

          {/* UPDATED: Milestones section */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Milestones & Tasks</h2>
              <button 
                onClick={() => setIsAddMilestoneModalOpen(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Milestone
              </button>
            </div>
            <div className="overflow-hidden">
              {currentProject.milestones.length === 0 ? (
                <p className="px-6 py-4 text-sm text-gray-500">No milestones defined for this project.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {currentProject.milestones.map((milestone: Milestone) => (
                    <li key={milestone.id} className="px-6 py-4 group relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center flex-1 min-w-0">
                          {/* Status Indicator */}
                          <div className={`h-3 w-3 rounded-full mr-3 flex-shrink-0 ${
                            milestone.status === 'Completed' ? 'bg-green-500' :
                            milestone.status === 'In Progress' ? 'bg-yellow-500' : 'bg-gray-300'
                          }`}></div>
                          {/* Title and Description */}
                          <div className="flex-1 min-w-0">
                             <p className="text-sm font-medium text-gray-900 truncate">{milestone.title}</p>
                             {milestone.description && <p className="text-xs text-gray-500 mt-1">{milestone.description}</p>}
                          </div>
                        </div>
                        {/* Due Date */}
                        <div className="ml-2 flex-shrink-0 flex items-center space-x-2">
                          <p className="text-xs text-gray-500">Due: {formatDate(milestone.dueDate)}</p>
                          {/* Toggle Task Button */}
                          {milestone.tasks.length > 0 && (
                             <button 
                               onClick={() => toggleTasksVisibility(milestone.id)}
                               className="p-1 text-gray-400 hover:text-gray-600"
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={visibleTasks[milestone.id] ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
                                </svg>
                             </button>
                          )}
                          {/* Edit Milestone Button (appears on hover) */}
                          <button 
                            onClick={() => openEditMilestoneModal(milestone)}
                            className="p-1 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                            aria-label={`Edit milestone ${milestone.title}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          {/* Delete Milestone Button (appears on hover) */}
                          <button 
                            onClick={() => handleDeleteMilestone(milestone.id, milestone.title)}
                            className="p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                            aria-label={`Delete milestone ${milestone.title}`}
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                               <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                             </svg>
                          </button>
                        </div>
                      </div>

                      {/* Tasks List (Conditional) */}
                      {visibleTasks[milestone.id] && milestone.tasks.length > 0 && (
                        <div className="mt-4 pt-3 pl-6 border-l border-gray-200 ml-1.5">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-medium text-gray-500">Tasks:</h4>
                             {/* Add Task Button */}
                            <button 
                              onClick={() => openAddTaskModal(milestone.id)} // Open Add Task Modal for this milestone
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                             >
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                               </svg>
                               Add Task
                             </button>
                          </div>
                          {milestone.tasks.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">No tasks for this milestone yet.</p>
                          ) : (
                            <ul className="space-y-3">
                              {milestone.tasks.map((task: Task) => (
                                <li key={task.id} className="flex items-start space-x-3 group/task relative pr-10"> {/* Add padding right for buttons */}
                                  <input 
                                    type="checkbox" 
                                    checked={task.completed}
                                    onChange={() => handleTaskToggle(milestone.id, task.id, task.completed)}
                                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    aria-labelledby={`task-desc-${task.id}`}
                                  />
                                  <div className="flex-1">
                                    <p id={`task-desc-${task.id}`} className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{task.description}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${
                                        task.status === 'Done' ? 'bg-green-100 text-green-800' :
                                        task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                        task.status === 'Updated' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                      }`}>{task.status}</span>
                                      {task.dueDate && <p className="text-xs text-gray-400">Due: {formatDate(task.dueDate)}</p>}
                                    </div>
                                    {task.comments && <p className="text-xs text-gray-500 mt-1 italic">Comment: {task.comments}</p>}
                                  </div>
                                  
                                  {/* Buttons Container */} 
                                  <div className="absolute top-0 right-0 flex items-center space-x-1 opacity-0 group-hover/task:opacity-100 focus-within:opacity-100 transition-opacity">
                                    {/* Edit Task Button */} 
                                    <button 
                                      onClick={() => openEditTaskModal(milestone.id, task)}
                                      className="p-0.5 text-gray-400 hover:text-blue-600"
                                      aria-label={`Edit task ${task.description}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                    
                                    {/* Delete Task Button */}
                                    <button 
                                      onClick={() => handleDeleteTask(milestone.id, task.id, task.description)}
                                      className="p-0.5 text-gray-400 hover:text-red-600"
                                      aria-label={`Delete task ${task.description}`}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* NEW: Theoretical Background */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Theoretical Background</h2>
              <button 
                onClick={() => setIsAddSourceModalOpen(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Source
              </button>
            </div>
             <div className="overflow-hidden">
               {currentProject.theoreticalBackground.length === 0 ? (
                  <p className="px-6 py-4 text-sm text-gray-500">No theoretical sources listed.</p>
               ) : (
                 <ul className="divide-y divide-gray-200">
                  {currentProject.theoreticalBackground.map((source: TheoreticalSource) => (
                    <li key={source.id} className="px-6 py-4 flex items-center justify-between group relative">
                      <div className="flex items-center min-w-0 flex-1">
                         <span className="inline-block mr-3 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 capitalize">{source.type}</span>
                         <div className="min-w-0 flex-1">
                           <p className="text-sm font-medium text-gray-900 truncate">{source.title}</p>
                           {source.url && <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate block">{source.url}</a>}
                           {source.notes && <p className="text-xs text-gray-500 mt-1">Notes: {source.notes}</p>}
                         </div>
                      </div>
                         {/* Buttons Container */} 
                         <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                             {/* Edit Source Button */}
                             <button 
                               onClick={() => openEditSourceModal(source)}
                               className="p-1 text-gray-400 hover:text-blue-600"
                               aria-label={`Edit source ${source.title}`}
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                             </button>
                             {/* Delete Source Button */}
                             <button 
                               onClick={() => handleDeleteSource(source.id, source.title)}
                               className="p-1 text-gray-400 hover:text-red-600"
                               aria-label={`Delete source ${source.title}`}
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                             </button>
                         </div>
                    </li>
                  ))}
                 </ul>
               )}
             </div>
          </div>
          
          {/* NEW: Coding Section */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Coding</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <InlineEditField
                label="Repository URL"
                fieldName="coding.repoUrl"
                initialValue={currentProject.coding?.repoUrl}
                onSave={handleSaveField}
                displayAs="link"
                placeholder="https://github.com/user/repo"
                emptyText="No repository URL set."
              />
              <InlineEditField
                label="Coding Notes"
                fieldName="coding.notes"
                initialValue={currentProject.coding?.notes}
                onSave={handleSaveField}
                displayAs="textarea"
                textareaProps={{ rows: 3 }}
                placeholder="Notes about the codebase, setup, etc."
                emptyText="No coding notes added."
              />
            </div>
          </div>
          
          {/* NEW: Results Section */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Results</h2>
            </div>
            <div className="px-6 py-5">
              <InlineEditField
                fieldName="results"
                initialValue={currentProject.results}
                onSave={handleSaveField}
                displayAs="textarea"
                textareaProps={{ rows: 5 }}
                placeholder="Summarize the outcomes, findings, etc."
                emptyText="No results recorded yet."
              />
            </div>
          </div>
          
          {/* NEW: Notes Section */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">My Notes & Thoughts</h2>
            </div>
            <div className="px-6 py-5">
              <InlineEditField
                fieldName="notes"
                initialValue={currentProject.notes}
                onSave={handleSaveField}
                displayAs="textarea"
                textareaProps={{ rows: 5 }}
                placeholder="Jot down personal reflections, ideas, next steps..."
                emptyText="No personal notes added."
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Render the Modal */}
      <AddMilestoneModal 
        isOpen={isAddMilestoneModalOpen}
        onClose={() => setIsAddMilestoneModalOpen(false)}
        onAddMilestone={handleAddMilestone}
        projectId={currentProject.id} 
      />
      {/* Add Task Modal (render only when needed) */}
      {addingTaskToMilestoneId && (
         <AddTaskModal 
           isOpen={isAddTaskModalOpen}
           onClose={closeAddTaskModal}
           onAddTask={handleAddTask}
           projectId={currentProject.id} 
           milestoneId={addingTaskToMilestoneId}
         />
      )}
      {/* Render Add Source Modal */}
      <AddSourceModal 
         isOpen={isAddSourceModalOpen}
         onClose={() => setIsAddSourceModalOpen(false)}
         onAddSource={handleAddSource}
         projectId={currentProject.id} 
      />
      {/* Render Edit Milestone Modal */}
      <EditMilestoneModal
        isOpen={isEditMilestoneModalOpen}
        onClose={closeEditMilestoneModal}
        onUpdateMilestone={handleUpdateMilestone}
        milestone={editingMilestone} 
      />
      {/* Render Edit Task Modal */}
      {editingTask && editingTaskMilestoneId && (
          <EditTaskModal
            isOpen={isEditTaskModalOpen}
            onClose={closeEditTaskModal}
            onUpdateTask={handleUpdateTask}
            task={editingTask}
            projectId={currentProject.id}
            milestoneId={editingTaskMilestoneId}
          />
      )}
      {/* Render Edit Source Modal */}
      {editingSource && (
        <EditSourceModal
          isOpen={isEditSourceModalOpen}
          onClose={closeEditSourceModal}
          onUpdateSource={handleUpdateSource}
          source={editingSource}
          projectId={currentProject.id}
        />
      )}
    </>
  );
} 