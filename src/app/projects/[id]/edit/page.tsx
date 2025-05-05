import { getProjectById, getAllProjects, Project } from '@/lib/mockData';
import EditProjectClient from './EditProjectClient';

// This is required for static export with dynamic routes
export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project: Project) => ({
    id: project.id,
  }));
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const project = getProjectById(params.id);
  return <EditProjectClient project={project} params={params} />;
} 