import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');

        console.log("MongoDB URI Loaded:", uri);

        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),

  ],
})
export class AppModule { }
