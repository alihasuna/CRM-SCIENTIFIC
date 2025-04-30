import Link from 'next/link';
import { getAllProjects } from '@/lib/mockData';

export default function DocumentsPage() {
  const projects = getAllProjects();
  
  // Generate mock documents for all projects
  const allDocuments = projects.flatMap(project => {
    // Create 2-4 documents per project for demonstration
    const count = Math.floor(Math.random() * 3) + 2; // 2-4 documents
    const types = ['pdf', 'docx', 'xlsx', 'pptx', 'txt'];
    const titles = [
      'Research Proposal', 
      'Literature Review', 
      'Methodology Documentation',
      'Data Collection Plan',
      'Experiment Results',
      'Data Analysis Report',
      'Meeting Notes',
      'Presentation Slides'
    ];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `${project.id}-d${i+1}`,
      projectId: project.id,
      projectTitle: project.title,
      title: titles[Math.floor(Math.random() * titles.length)],
      type: types[Math.floor(Math.random() * types.length)],
      size: `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 9) + 1}MB`,
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(), // random past dates
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString(),
    }));
  });
  
  // Sort documents by last updated date (newest first)
  const sortedDocuments = [...allDocuments].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  // Group documents by type
  const documentsByType = sortedDocuments.reduce((acc, doc) => {
    acc[doc.type] = acc[doc.type] || [];
    acc[doc.type].push(doc);
    return acc;
  }, {} as Record<string, typeof allDocuments>);
  
  // Count documents by type
  const typeCounts = Object.entries(documentsByType).map(([type, docs]) => ({
    type,
    count: docs.length
  })).sort((a, b) => b.count - a.count);
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Research Documents</h1>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
            </svg>
            Upload Document
          </button>
        </div>
        
        {/* Filters and search */}
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
                  <option>All Types</option>
                  {typeCounts.map(({ type }) => (
                    <option key={type} value={type}>{type.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search documents..." 
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
        
        {/* Document stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Documents</dt>
                    <dd className="text-lg font-semibold text-gray-900">{allDocuments.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          {typeCounts.slice(0, 3).map(({ type, count }) => (
            <div key={type} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${
                    type === 'pdf' ? 'bg-red-500' : 
                    type === 'docx' ? 'bg-blue-500' : 
                    type === 'xlsx' ? 'bg-green-500' : 
                    type === 'pptx' ? 'bg-orange-500' : 'bg-gray-500'
                  } rounded-md p-3`}>
                    <span className="text-white uppercase font-semibold text-xs">{type}</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{type.toUpperCase()} Files</dt>
                      <dd className="text-lg font-semibold text-gray-900">{count}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Document list */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Documents</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {sortedDocuments.length > 0 ? (
              sortedDocuments.map((document) => (
                <li key={document.id} className="px-6 py-5 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 ${
                        document.type === 'pdf' ? 'bg-red-100' : 
                        document.type === 'docx' ? 'bg-blue-100' : 
                        document.type === 'xlsx' ? 'bg-green-100' : 
                        document.type === 'pptx' ? 'bg-orange-100' : 'bg-gray-100'
                      } rounded-md flex items-center justify-center`}>
                        <span className={`text-xs font-medium uppercase ${
                          document.type === 'pdf' ? 'text-red-800' : 
                          document.type === 'docx' ? 'text-blue-800' : 
                          document.type === 'xlsx' ? 'text-green-800' : 
                          document.type === 'pptx' ? 'text-orange-800' : 'text-gray-800'
                        }`}>{document.type}</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">{document.title}</h3>
                        <div className="mt-1 flex items-center">
                          <Link href={`/projects/${document.projectId}`} className="text-xs text-blue-600 hover:text-blue-800">
                            {document.projectTitle}
                          </Link>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-xs text-gray-500">{document.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        Updated {new Date(document.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-5 text-center text-sm text-gray-500">
                No documents found. Upload your first document to get started.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
} 