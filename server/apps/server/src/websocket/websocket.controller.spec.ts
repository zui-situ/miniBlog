import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketController } from './websocket.controller';

describe('Websocket Controller', () => {
  let controller: WebsocketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebsocketController],
    }).compile();

    controller = module.get<WebsocketController>(WebsocketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
