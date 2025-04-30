import Link from 'next/link';
import { getAllProjects } from '@/lib/mockData';

export default function MilestonesPage() {
  const projects = getAllProjects();
  
  // Generate mock milestones for all projects
  const allMilestones = projects.flatMap(project => {
    // Create 2-3 milestones per project for demonstration
    const count = Math.floor(Math.random() * 2) + 2; // 2-3 milestones
    const statuses = ['not-started', 'in-progress', 'completed'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `${project.id}-m${i+1}`,
      projectId: project.id,
      projectTitle: project.title,
      title: i === 0 ? 'Literature Review' : 
             i === 1 ? 'Data Collection' : 
             i === 2 ? 'Initial Analysis' : `Milestone ${i+1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      dueDate: new Date(Date.now() + (i + 1) * 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // random future dates
      createdAt: new Date().toISOString(),
    }));
  });
  
  // Sort milestones by due date
  const sortedMilestones = [...allMilestones].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
  
  // Group milestones by status
  const upcomingMilestones = sortedMilestones.filter(m => m.status !== 'completed');
  const completedMilestones = sortedMilestones.filter(m => m.status === 'completed');
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Research Milestones</h1>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Milestone
          </button>
        </div>
        
        {/* Filters */}
        <div className="bg-white shadow mb-6 rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-900">Filter by:</span>
              <div className="relative">
                <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option>All Projects</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.title}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option>All Statuses</option>
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search milestones..." 
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Upcoming Milestones */}
        <div className="bg-white shadow mb-6 rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Milestones</h2>
          </div>
          <div className="overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {upcomingMilestones.length > 0 ? (
                upcomingMilestones.map((milestone) => (
                  <li key={milestone.id} className="px-6 py-5 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className={`h-3 w-3 rounded-full flex-shrink-0 ${
                            milestone.status === 'completed' ? 'bg-green-500' : 
                            milestone.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                          }`} 
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                          <Link href={`/projects/${milestone.projectId}`} className="text-xs text-blue-600 hover:text-blue-800">
                            {milestone.projectTitle}
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          milestone.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          milestone.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {milestone.status === 'not-started' ? 'Not Started' : 
                           milestone.status === 'in-progress' ? 'In Progress' : 'Completed'}
                        </span>
                        <p className="text-sm text-gray-500 whitespace-nowrap">
                          Due: {new Date(milestone.dueDate).toLocaleDateString()}
                        </p>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-6 py-5 text-center text-sm text-gray-500">
                  No upcoming milestones found.
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Completed Milestones */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Completed Milestones</h2>
          </div>
          <div className="overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {completedMilestones.length > 0 ? (
                completedMilestones.map((milestone) => (
                  <li key={milestone.id} className="px-6 py-5 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-3 w-3 rounded-full bg-green-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                          <Link href={`/projects/${milestone.projectId}`} className="text-xs text-blue-600 hover:text-blue-800">
                            {milestone.projectTitle}
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                        <p className="text-sm text-gray-500 whitespace-nowrap">
                          Due: {new Date(milestone.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-6 py-5 text-center text-sm text-gray-500">
                  No completed milestones yet.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 