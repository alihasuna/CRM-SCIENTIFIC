'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getProjectById, getAllProjects } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import DeleteProjectModal from '@/components/DeleteProjectModal';

// This is required for static export with dynamic routes
export function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map(project => ({
    id: project.id,
  }));
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const project = getProjectById(params.id);
  
  if (!project) {
    notFound();
  }
  
  // Mock milestones for this project
  const milestones = [
    { id: '1', title: 'Literature Review', status: 'completed', dueDate: '2023-10-15' },
    { id: '2', title: 'Data Collection', status: 'in-progress', dueDate: '2023-11-30' },
    { id: '3', title: 'Initial Analysis', status: 'not-started', dueDate: '2023-12-31' },
  ];
  
  // Mock documents for this project
  const documents = [
    { id: '1', title: 'Research Proposal', type: 'pdf', updatedAt: '2023-09-01' },
    { id: '2', title: 'Literature Review Notes', type: 'docx', updatedAt: '2023-10-12' },
    { id: '3', title: 'Data Collection Plan', type: 'xlsx', updatedAt: '2023-10-25' },
  ];
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-4 sm:px-0">
        {/* Header with back button and actions */}
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
            <h1 className="text-2xl font-bold text-gray-900 truncate">{project.title}</h1>
          </div>
          <div className="flex space-x-3">
            <Link 
              href={`/projects/${params.id}/edit`}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </Link>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
        
        {/* Project details card */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Project Details</h2>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {project.description || "No description provided."}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(project.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </div>
          </div>
        </div>
        
        {/* Milestones section */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Milestones</h2>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Milestone
            </button>
          </div>
          <div className="overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {milestones.length > 0 ? (
                milestones.map((milestone) => (
                  <li key={milestone.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className={`h-3 w-3 rounded-full mr-3 ${
                            milestone.status === 'completed' ? 'bg-green-500' : 
                            milestone.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                          }`} 
                        />
                        <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="text-sm text-gray-500">Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-6 py-4 text-center text-sm text-gray-500">
                  No milestones yet. Add your first milestone to track progress.
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Documents section */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Documents</h2>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Upload Document
            </button>
          </div>
          <div className="overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {documents.length > 0 ? (
                documents.map((document) => (
                  <li key={document.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                          <span className="text-xs font-medium uppercase">{document.type}</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{document.title}</p>
                          <p className="text-sm text-gray-500">
                            Updated on {new Date(document.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <button className="mr-2 p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-6 py-4 text-center text-sm text-gray-500">
                  No documents yet. Upload your first document to share.
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Notes section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Notes</h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <textarea
                rows={4}
                className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                placeholder="Add a note about this project..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Note
              </button>
            </div>
            <div className="mt-6">
              <div className="border-t border-gray-200 pt-4">
                <p className="text-center text-sm text-gray-500">No notes yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      <DeleteProjectModal 
        projectId={params.id}
        projectTitle={project.title}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
} 