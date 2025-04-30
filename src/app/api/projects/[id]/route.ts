import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Correct type definition for the params
type RouteParams = { params: { id: string } };

// GET a single project by ID - fix the type definition
export async function GET(
  _request: NextRequest,
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
  _request: NextRequest,
  { params: _params }: RouteParams
) {
  try {
    const { id } = _params;
    const body = await _request.json();
    
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
      }
    });
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    await prisma.project.delete({
      where: { id }
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
