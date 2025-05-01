import { getProjectById, getAllProjects } from '@/lib/mockData';
import EditProjectClient from './EditProjectClient';

// This is required for static export with dynamic routes
export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map(project => ({
    id: project.id,
  }));
}

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  // Await the params before using them
  const resolvedParams = await Promise.resolve(params);
  const project = getProjectById(resolvedParams.id);
  return <EditProjectClient project={project} params={resolvedParams} />;
} 