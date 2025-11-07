import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/common/prisma.service';
import { JwtAuthGuard } from '../../src/common/guards/jwt.guard';
import { AI_ADAPTER } from '../../src/features/ai/adapter';
import { MockAdapter } from '../../src/features/ai/mock-adapter';

describe('Quiz (e2e)', () => {
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
    await prisma.quiz.deleteMany();
    await prisma.flashcard.deleteMany();
    await prisma.studySheet.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Quiz Generation (US3)', () => {
    it('should generate a quiz with requested number of MCQ questions', async () => {
      // Create test user
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          displayName: 'Test User',
          passwordHash: 'dummy-hash',
        },
      });

      // Create a course
      const course = await prisma.course.create({
        data: {
          title: 'Test Course',
          sourceText: 'Test content about JavaScript programming',
          authorId: user.id,
          emoji: '📚',
        },
      });

      // Mock AI quiz response
      mockAi.setMockResponses({
        quiz: [
          {
            question: 'What is JavaScript?',
            options: [
              'A programming language',
              'A coffee brand',
              'A framework',
              'An IDE',
            ],
            correctAnswer: 0,
          },
          {
            question: 'What is a variable?',
            options: [
              'A storage location',
              'A function',
              'A loop',
              'A condition',
            ],
            correctAnswer: 0,
          },
        ],
      });

      // Generate quiz
      const response = await request(app.getHttpServer())
        .post(`/courses/${course.id}/quizzes`)
        .send({
          count: 2,
          type: 'MCQ',
        })
        .set('Authorization', 'Bearer dummy-token')
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.courseId).toBe(course.id);
      expect(response.body.params.count).toBe(2);
      expect(response.body.params.types).toContain('MCQ');
      expect(response.body.questions).toHaveLength(2);

      // Verify MCQ structure
      const firstQuestion = response.body.questions[0];
      expect(firstQuestion.type).toBe('MCQ');
      expect(firstQuestion.question).toBe('What is JavaScript?');
      expect(firstQuestion.options).toHaveLength(4);
      expect(firstQuestion.correctAnswer).toBe(0);

      // Verify quiz persisted
      const savedQuiz = await prisma.quiz.findUnique({
        where: { id: response.body.id },
      });
      expect(savedQuiz).toBeDefined();
    });

    it('should list all quizzes for a course', async () => {
      // Create test user and course
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          displayName: 'Test User',
          passwordHash: 'dummy-hash',
        },
      });

      const course = await prisma.course.create({
        data: {
          title: 'Test Course',
          sourceText: 'Test content',
          authorId: user.id,
        },
      });

      // Create multiple quizzes
      const quiz1 = await prisma.quiz.create({
        data: {
          courseId: course.id,
          params: { count: 5, types: ['MCQ'] },
          questions: [
            {
              id: '1',
              type: 'MCQ',
              question: 'Q1',
              options: ['A', 'B', 'C', 'D'],
              correctAnswer: 0,
            },
          ],
        },
      });

      const quiz2 = await prisma.quiz.create({
        data: {
          courseId: course.id,
          params: { count: 3, types: ['OPEN'] },
          questions: [
            { id: '2', type: 'OPEN', question: 'Q2', correctAnswer: 'Answer' },
          ],
        },
      });

      // List quizzes
      const response = await request(app.getHttpServer())
        .get(`/courses/${course.id}/quizzes`)
        .set('Authorization', 'Bearer dummy-token')
        .expect(200);

      // Verify array format (FR-015)
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items).toHaveLength(2);

      const quizIds = response.body.items.map((q: any) => q.id);
      expect(quizIds).toContain(quiz1.id);
      expect(quizIds).toContain(quiz2.id);
    });

    it('should get a specific quiz by id', async () => {
      // Create test data
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          displayName: 'Test User',
          passwordHash: 'dummy-hash',
        },
      });

      const course = await prisma.course.create({
        data: {
          title: 'Test Course',
          sourceText: 'Test content',
          authorId: user.id,
        },
      });

      const quiz = await prisma.quiz.create({
        data: {
          courseId: course.id,
          params: { count: 5, types: ['MCQ'] },
          questions: [
            {
              id: '1',
              type: 'MCQ',
              question: 'Sample question',
              options: ['A', 'B', 'C', 'D'],
              correctAnswer: 2,
            },
          ],
        },
      });

      // Get quiz by id
      const response = await request(app.getHttpServer())
        .get(`/quizzes/${quiz.id}`)
        .set('Authorization', 'Bearer dummy-token')
        .expect(200);

      expect(response.body.id).toBe(quiz.id);
      expect(response.body.courseId).toBe(course.id);
      expect(response.body.questions).toHaveLength(1);
      expect(response.body.questions[0].question).toBe('Sample question');
    });

    it('should return 400 when question count is invalid', async () => {
      // Create test user and course
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          displayName: 'Test User',
          passwordHash: 'dummy-hash',
        },
      });

      const course = await prisma.course.create({
        data: {
          title: 'Test Course',
          sourceText: 'Test content',
          authorId: user.id,
        },
      });

      // Attempt to generate quiz with invalid count
      await request(app.getHttpServer())
        .post(`/courses/${course.id}/quizzes`)
        .send({
          count: 0, // Invalid: too low
          type: 'MCQ',
        })
        .set('Authorization', 'Bearer dummy-token')
        .expect(400);

      await request(app.getHttpServer())
        .post(`/courses/${course.id}/quizzes`)
        .send({
          count: 100, // Invalid: too high
          type: 'MCQ',
        })
        .set('Authorization', 'Bearer dummy-token')
        .expect(400);
    });

    it('should return 404 when course does not exist', async () => {
      await request(app.getHttpServer())
        .post('/courses/nonexistent-id/quizzes')
        .send({
          count: 5,
          type: 'MCQ',
        })
        .set('Authorization', 'Bearer dummy-token')
        .expect(404);
    });
  });
});
