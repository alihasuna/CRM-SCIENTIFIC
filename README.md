# CRM-SCIENTIFIC

A research project management application for tracking research projects, milestones, and documents.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup and Development](#setup-and-development)
- [Project Structure](#project-structure)
- [Deployment](#deployment)

## Features

- **Project Management**: Create, view, edit, and delete research projects
- **Milestone Tracking**: Track research milestones with statuses (not started, in progress, completed)
- **Document Management**: Organize research documents by project
- **Dashboard**: Get an overview of active projects and upcoming milestones

## Technology Stack

- **Framework**: Next.js 15
- **UI**: Tailwind CSS
- **Language**: TypeScript
- **Data**: Mock data (will be connected to a backend in the future)

## Setup and Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/alihasuna/CRM-SCIENTIFIC.git
cd CRM-SCIENTIFIC
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Mode

For local testing of the production build:

```bash
npm run build
npm run start
```

## Project Structure

```
CRM-SCIENTIFIC/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard page
│   │   ├── documents/      # Documents list page  
│   │   ├── milestones/     # Milestones list page
│   │   ├── projects/       # Projects pages
│   │   │   ├── [id]/       # Project detail and edit pages
│   │   │   ├── new/        # New project page
│   │   ├── layout.tsx      # Root layout
│   ├── components/         # Reusable components
│   ├── lib/                # Utilities and helpers
│   │   ├── mockData.ts     # Mock data functions
```

## Important Notes for Development

When working with this project, be aware of these specific characteristics:

1. **Static Export Configuration**: The project is configured to use static export for production but dynamic rendering for development. This is handled in `next.config.ts` by setting `output: process.env.NODE_ENV === 'production' ? 'export' : undefined`.

2. **Client/Server Component Split**: The project uses a pattern of splitting pages into server components that fetch data and client components that handle interactivity. This approach is used in the project detail and edit pages.

3. **Mock Data**: Currently using mock data from `@/lib/mockData.ts`. In a future version, this will be replaced with actual API calls.

## Deployment

The project is configured for deployment on GitHub Pages:

```bash
npm run build
# Files will be generated in the 'out' directory
```

## License

MIT
