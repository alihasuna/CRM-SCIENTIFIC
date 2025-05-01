// This file provides the static params for dynamic routes

// Build-time generated params for static export
export async function generateStaticParams() {
  // Import inside function to avoid client-side import
  const { getAllProjects } = await import('@/lib/mockData');
  const projects = getAllProjects();
  return projects.map((project: any) => ({
    id: project.id,
  }));
} 