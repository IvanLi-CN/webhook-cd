import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HooksModule } from './hooks/hooks.module';
import { ProjectsModule } from './projects/projects.module';
import { BullModule } from '@nestjs/bull';
import { DeployTasksModule } from './deploy-tasks/deploy-tasks.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HooksModule,
    ProjectsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'webhook-cd',
      password: '',
      database: 'webhook-cd',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
      prefix: 'webhook-cd',
    }),
    DeployTasksModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
