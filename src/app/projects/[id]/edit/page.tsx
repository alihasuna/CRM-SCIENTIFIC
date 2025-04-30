import { getProjectById, getAllProjects } from '@/lib/mockData';
import EditProjectClient from './EditProjectClient';

// This is required for static export with dynamic routes
export function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map(project => ({
    id: project.id,
  }));
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const project = getProjectById(params.id);
  return <EditProjectClient project={project} params={params} />;
} 