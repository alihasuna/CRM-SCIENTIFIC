import Link from 'next/link';
import prisma from '@/lib/prisma';

async function getProjects() {
  const projects = await prisma.project.findMany({
    include: {
      milestones: true,
      documents: true,
      _count: {
        select: {
          milestones: true,
          documents: true
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });
  
  return projects;
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Research Projects</h1>
        <Link
          href="/projects/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          New Project
        </Link>
      </div>
      
      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new research project.</p>
          <div className="mt-6">
            <Link
              href="/projects/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Project
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link 
              key={project.id} 
              href={`/projects/${project.id}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{project.title}</h3>
                {project.description && (
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                )}
                <div className="flex justify-between text-sm text-gray-500">
                  <div>
                    <span>{project._count.milestones} Milestones</span>
                  </div>
                  <div>
                    <span>{project._count.documents} Documents</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 text-right">
                <span className="text-sm font-medium text-blue-600">View details &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 