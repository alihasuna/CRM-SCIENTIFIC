# Research Tracking System

A CRM-like system for scientific research, helping researchers organize milestones, documents, and share progress with academic supervisors.

## Features

- **Project Management**: Create and manage research projects
- **Milestone Tracking**: Set and monitor research milestones with deadlines
- **Document Management**: Store and organize research papers, reports, and presentations
- **Note Taking**: Keep track of important research notes and meeting minutes
- **Progress Sharing**: Share progress with academic supervisors

## Tech Stack

- **Frontend**: Next.js 15 with React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM (easily changeable to PostgreSQL, MySQL, etc.)
- **Hosting**: GitHub Pages (free)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/CRM-SCIENTIFIC.git
   cd CRM-SCIENTIFIC
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Generate Prisma client
   ```
   npx prisma generate
   ```

4. Push database schema and seed with sample data
   ```
   npx prisma db push
   npx prisma db seed
   ```

5. Start the development server
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The project is configured for automatic deployment to GitHub Pages.

1. Fork this repository
2. Enable GitHub Pages in your repository settings
3. The GitHub Actions workflow will automatically build and deploy the site

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the awesome framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
