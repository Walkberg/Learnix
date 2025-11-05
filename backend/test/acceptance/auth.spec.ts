import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaClient } from '@prisma/client';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Clean up users before each test
    await prisma.user.deleteMany();
  });

  describe('/auth/signup (POST)', () => {
    const signupDto = {
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Test User',
    };

    it('should create a new user and return token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(201);

      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(signupDto.email);
      expect(response.body.user.displayName).toBe(signupDto.displayName);
      expect(response.body.user.passwordHash).toBeUndefined();
    });

    it('should fail if email already exists', async () => {
      await request(app.getHttpServer()).post('/auth/signup').send(signupDto);

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(409);
    });
  });

  describe('/auth/login (POST)', () => {
    const userDto = {
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Test User',
    };

    beforeEach(async () => {
      // Create a user for login tests
      await request(app.getHttpServer()).post('/auth/signup').send(userDto);
    });

    it('should login and return token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userDto.email,
          password: userDto.password,
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(userDto.email);
      expect(response.body.user.passwordHash).toBeUndefined();
    });

    it('should fail with invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userDto.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });
});
