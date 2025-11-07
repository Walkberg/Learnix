import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './features/ai/ai.module';
import { AuthModule } from './features/auth/auth.module';
import { CoursesModule } from './features/courses/courses.module';
import { SummariesModule } from './features/summaries/summaries.module';
import { FlashcardsModule } from './features/flashcards/flashcards.module';
import { QuizzesModule } from './features/quizzes/quizzes.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    AiModule,
    AuthModule,
    CoursesModule,
    SummariesModule,
    FlashcardsModule,
    QuizzesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
