import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Correct type definition for the params
type RouteParams = { params: { id: string } };

// GET a single project by ID - fix the type definition
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        milestones: true,
        documents: true,
        notes: true
      }
    });
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// Also update the types for PUT and DELETE
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  // Rest of function remains the same
  // ...
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  // Rest of function remains the same
  // ...
}
