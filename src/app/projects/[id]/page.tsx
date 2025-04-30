import { getProjectById, getAllProjects } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import ProjectDetailClient from './ProjectDetailClient';

// This is required for static export with dynamic routes
export function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map(project => ({
    id: project.id,
  }));
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
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
  
  return <ProjectDetailClient project={project} milestones={milestones} documents={documents} params={params} />;
} 