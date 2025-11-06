import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/common/prisma.service';
import { JwtAuthGuard } from '../../src/common/guards/jwt.guard';
import type { AIAdapter } from '../../src/features/ai/adapter';
import { AI_ADAPTER } from '../../src/features/ai/adapter';
import { MockAdapter } from '../../src/features/ai/mock-adapter';

describe('Summary (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mockAi: MockAdapter;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AI_ADAPTER)
      .useClass(MockAdapter)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    mockAi = moduleRef.get(AI_ADAPTER) as MockAdapter;
    await app.init();
  });

  beforeEach(async () => {
    await prisma.flashcard.deleteMany();
    await prisma.studySheet.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('StudySheet Generation', () => {
    it('should generate a study sheet when a course is created', async () => {
      // Create test user
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          displayName: 'Test User',
          passwordHash: 'dummy-hash',
        },
      });

      // Mock AI responses
      mockAi.setMockResponses({
        summary: [
          '* Key concept 1',
          '* Important point 2',
          '* Critical detail 3',
        ],
      });

      // Create a course
      const course = await request(app.getHttpServer())
        .post('/api/courses')
        .send({
          title: 'Test Course',
          sourceText: 'Test content for study material generation',
          emoji: '📚',
        })
        .set('Authorization', 'Bearer dummy-token')
        .expect(201);

      // Wait for async processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verify study sheet was created
      const studySheet = await prisma.studySheet.findFirst({
        where: { courseId: course.body.id },
      });

      expect(studySheet).toBeDefined();
      expect(studySheet!.keyPoints!).toHaveLength(3);
      expect(studySheet!.keyPoints![0]).toBe('* Key concept 1');

      // Verify flashcards were created
      const flashcards = await prisma.flashcard.findMany({
        where: { courseId: course.body.id },
      });

      expect(flashcards).toHaveLength(3);
      expect(flashcards[0].answer).toContain('Key concept 1');
    });

    it('should return 403 when user exceeds quota', async () => {
      // Create test user with exceeded quota
      const user = await prisma.user.create({
        data: {
          email: 'quota@example.com',
          displayName: 'Quota User',
          passwordHash: 'dummy-hash',
          role: 'FREE',
        },
      });

      // Create max allowed courses
      for (let i = 0; i < 5; i++) {
        await prisma.course.create({
          data: {
            title: `Course ${i}`,
            sourceText: 'Content',
            authorId: user.id,
          },
        });
      }

      // Attempt to create one more course
      await request(app.getHttpServer())
        .post('/api/courses')
        .send({
          title: 'One Too Many',
          sourceText: 'Should fail',
          emoji: '📚',
        })
        .set('Authorization', 'Bearer dummy-token')
        .expect(403);
    });
  });
});
