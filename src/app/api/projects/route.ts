import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Configure dynamic behavior for static export
export const dynamic = 'force-dynamic';

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        milestones: true,
        documents: true
      }
    });
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.userId) {
      return NextResponse.json(
        { error: 'Title and userId are required' },
        { status: 400 }
      );
    }
    
    const project = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        userId: body.userId,
      }
    });
    
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 