import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './apis/users/user.module';
import { AuthModule } from './apis/auth/auth.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './apis/projects/project.module';
import { QuestionBoardModule } from './apis/questionBoards/questionboards.module';
import { QuestionCommentModule } from './apis/questionComments/questionComment.module';
import { ProcessCategoryModule } from './apis/processCategory/processCategory.module';
import { FileModule } from './apis/file/file.module';
import { PaymentModule } from './apis/payment/payment.module';
import { ScheduleModule } from './apis/schedule/schedule.module';
import { ProjectParticipantModule } from './apis/projectParticipants/projectParticipant.module';
import { ProjectFileModule } from './apis/projectFile/projectFile.module';
// import { ChatGateway } from './chat/chat.gateway';
// import { ChatModule } from './chat/chat.module';
// import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    AuthModule,
    FileModule,
    PaymentModule,
    ProjectParticipantModule,
    ProcessCategoryModule,
    ProjectFileModule,
    ProjectModule,
    QuestionBoardModule,
    QuestionCommentModule,
    ScheduleModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.SQLHOST,
      username: 'root',
      password: process.env.SQLHOSTPASSWORD,
      database: 'teamdatabase',
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      timezone: '-09:00',
      logging: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/common/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: [
          'http://smaf.site',
          'http://localhost:3000',
          'https://backend.smaf.shop',
          'http://localhost:5500',
        ],
        credentials: true,
      },
    }),

    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: process.env.REDIS_URL,
      isGlobal: true,
    }),

    // ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
