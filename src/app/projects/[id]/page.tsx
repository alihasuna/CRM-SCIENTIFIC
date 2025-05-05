import { getProjectById, getAllProjects, Project } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import ProjectDetailClient from './ProjectDetailClient';

// This is required for static export with dynamic routes
export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project: Project) => ({
    id: project.id,
  }));
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = getProjectById(params.id);
  
  if (!project) {
    notFound();
  }
  
  // Remove the mock milestones and documents
  // const milestones = [ ... ];
  // const documents = [ ... ];
  
  // Pass the full project object to the client component
  return <ProjectDetailClient project={project} />;
} 