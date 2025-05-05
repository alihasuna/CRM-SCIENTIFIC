// This file provides the static params for dynamic routes
import type { Project } from '@/lib/mockData';

// Build-time generated params for static export
export async function generateStaticParams() {
  // Import function inside function to avoid client-side import of implementation
  const { getAllProjects } = await import('@/lib/mockData');
  const projects = getAllProjects();
  return projects.map((project: Project) => ({
    id: project.id,
  }));
} 