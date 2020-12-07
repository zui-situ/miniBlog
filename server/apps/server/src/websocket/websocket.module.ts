import { Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller';
import { EventsGateway } from "./websocket.gateway";

@Module({
  providers: [EventsGateway],
  exports: [EventsGateway],
  controllers: [WebsocketController]
})
export class WebsocketModule {}
