import { HttpModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'libs/common/strategy/jwt.strategy';
import { LocalStrategy } from 'libs/common/strategy/local.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
@Module({
  imports:[
    PassportModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    })
  ],
  controllers: [AuthController],
  providers:[LocalStrategy,JwtStrategy,AuthService]
})
export class AuthModule {}
