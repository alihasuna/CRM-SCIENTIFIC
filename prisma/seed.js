const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  // Create a sample user
  const user = await prisma.user.upsert({
    where: { email: 'researcher@example.com' },
    update: {},
    create: {
      email: 'researcher@example.com',
      name: 'Sample Researcher',
      id: 'default-user-id',
    },
  });

  console.log('Created sample user:', user);

  // Create a sample project
  const project = await prisma.project.upsert({
    where: { id: 'sample-project-1' },
    update: {},
    create: {
      id: 'sample-project-1',
      title: 'Quantum Computing Research',
      description: 'Investigating quantum algorithms for optimization problems',
      userId: user.id,
    },
  });

  console.log('Created sample project:', project);

  // Create sample milestones
  const milestone1 = await prisma.milestone.upsert({
    where: { id: 'sample-milestone-1' },
    update: {},
    create: {
      id: 'sample-milestone-1',
      title: 'Literature Review',
      description: 'Complete review of existing quantum optimization algorithms',
      date: new Date('2023-12-15'),
      status: 'COMPLETED',
      projectId: project.id,
    },
  });

  const milestone2 = await prisma.milestone.upsert({
    where: { id: 'sample-milestone-2' },
    update: {},
    create: {
      id: 'sample-milestone-2',
      title: 'Implementation of QAOA',
      description: 'Implement Quantum Approximate Optimization Algorithm',
      date: new Date('2024-03-30'),
      status: 'IN_PROGRESS',
      projectId: project.id,
    },
  });

  console.log('Created sample milestones:', milestone1, milestone2);

  // Create sample document
  const document = await prisma.document.upsert({
    where: { id: 'sample-document-1' },
    update: {},
    create: {
      id: 'sample-document-1',
      title: 'Quantum Optimization Review',
      description: 'Summary of state-of-the-art quantum optimization methods',
      type: 'report',
      url: 'https://example.com/documents/quantum-review.pdf',
      projectId: project.id,
    },
  });

  console.log('Created sample document:', document);

  // Create sample note
  const note = await prisma.note.upsert({
    where: { id: 'sample-note-1' },
    update: {},
    create: {
      id: 'sample-note-1',
      content: 'Meeting with supervisor: Need to focus on noise mitigation in quantum circuits.',
      projectId: project.id,
    },
  });

  console.log('Created sample note:', note);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 