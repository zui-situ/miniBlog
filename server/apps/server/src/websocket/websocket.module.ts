import { Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller';
import { EventsGateway } from "./websocket.gateway";
import { WebsocketService } from './websocket.service';

@Module({
  providers: [EventsGateway, WebsocketService],
  exports: [EventsGateway],
  controllers: [WebsocketController]
})
export class WebsocketModule {}
