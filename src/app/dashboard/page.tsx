import Link from 'next/link';
import { getAllProjects, Project } from '@/lib/mockData';

export default function Dashboard() {
  const projects: Project[] = getAllProjects();
  const recentProjects = projects
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  const totalMilestones = projects.reduce((sum, p) => sum + (p.milestones?.length || 0), 0);
  const completedTasks = projects.reduce((sum, p) => 
    sum + (p.milestones?.reduce((taskSum, m) => 
      taskSum + (m.tasks?.filter(t => t.completed).length || 0), 0) || 0)
  , 0);
  const totalTasks = projects.reduce((sum, p) => 
    sum + (p.milestones?.reduce((taskSum, m) => 
      taskSum + (m.tasks?.length || 0), 0) || 0)
  , 0);
  
  const stats = [
    { name: 'Total Projects', value: projects.length },
    { name: 'Total Milestones', value: totalMilestones },
    { name: 'Total Tasks', value: totalTasks },
    { name: 'Completed Tasks', value: completedTasks },
  ];
  
  const activityItems = [
    { id: 1, type: 'created', content: 'Created a new research project', date: '2 hours ago' },
    { id: 2, type: 'updated', content: 'Updated project milestone', date: '1 day ago' },
    { id: 3, type: 'added', content: 'Added new document to quantum research', date: '3 days ago' },
    { id: 4, type: 'completed', content: 'Completed literature review milestone', date: '1 week ago' },
  ];
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
        
        <div className="mt-6">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="px-4 py-5 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden sm:p-6 border border-gray-200 dark:border-gray-700">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.name}</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-100">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg col-span-2 border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Recent Projects</h2>
                <Link
                  href="/projects"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View all
                </Link>
              </div>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentProjects.length > 0 ? (
                recentProjects.map((project: Project) => (
                  <li key={project.id} className="px-4 py-4 sm:px-6">
                    <Link href={`/projects/${project.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md -m-2 p-2">
                      <div className="flex items-center justify-between">
                        <p className="text-md font-medium text-blue-600 dark:text-blue-400 truncate">{project.title}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {project.milestones?.length || 0} Milestone(s)
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            {project.description?.substring(0, 150) || 'No description available'}
                            {project.description && project.description.length > 150 ? '...' : ''}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-5 text-center text-sm text-gray-500 dark:text-gray-400">
                  No projects yet.{' '}
                  <Link href="/projects/new" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Create your first project
                  </Link>
                </li>
              )}
            </ul>
            {recentProjects.length > 0 && (
              <div className="px-4 py-4 sm:px-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/projects/new"
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                >
                  New Project
                </Link>
              </div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Recent Activity</h2>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden" style={{ maxHeight: '400px' }}>
              {activityItems.map((item) => (
                <li key={item.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 h-2 w-2 rounded-full ${
                      item.type === 'created' ? 'bg-green-500' : 
                      item.type === 'updated' ? 'bg-yellow-500' : 
                      item.type === 'added' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 dark:text-gray-200">{item.content}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 