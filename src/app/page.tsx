import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24">
      <div className="max-w-5xl w-full">
        <h1 className="mb-4 text-4xl font-bold text-center">
          Research Tracking System
        </h1>
        <p className="mb-8 text-center">
          Organize your research milestones, documents, and share progress with your academic supervisor.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center mb-12">
          <Link 
            href="/projects" 
            className="flex-1 p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Projects</h2>
            <p className="text-gray-600">
              Manage your research projects, track progress, and organize milestones.
            </p>
          </Link>

          <Link 
            href="/documents" 
            className="flex-1 p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Documents</h2>
            <p className="text-gray-600">
              Store and organize research papers, reports, and presentations.
            </p>
          </Link>

          <Link 
            href="/milestones" 
            className="flex-1 p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Milestones</h2>
            <p className="text-gray-600">
              Track important research milestones and deadlines across all projects.
            </p>
          </Link>
        </div>

        <div className="text-center">
          <Link 
            href="/login" 
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
