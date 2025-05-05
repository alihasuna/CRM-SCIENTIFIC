'use client';

import { useState } from 'react';
// import { useRouter } from 'next/navigation'; // Removed as it's unused
import Link from 'next/link';
import { createProject, getAllProjects } from '@/lib/mockData';

export default function NewProjectPage() {
  // const router = useRouter(); // Removed as it's unused
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    
    console.log('Creating project with:', { title, description });
    
    if (!title.trim()) {
      setError('Project title is required');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // For demo purposes, we're using a default user ID
      // In a real app, this would come from authentication
      const userId = 'default-user-id';
      
      // Use mock data function instead of API call
      const newProject = createProject({
        title,
        description,
        userId,
      });
      
      console.log('Project created:', newProject);
      
      // Check if project was added successfully
      const allProjects = getAllProjects();
      console.log('All projects after creation:', allProjects);
      
      // Force a hard navigation instead of client-side transition
      window.location.href = '/projects';
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">New Research Project</h1>
      
      {error && (
        <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-md" role="alert">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Project Title
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="title"
              id="title"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., Quantum Machine Learning Research"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Describe your research project..."
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Link
            href="/projects"
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
} 