import { Test, TestingModule } from '@nestjs/testing';
import { MalController } from './mal.controller';

describe('MalController', () => {
  let controller: MalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MalController],
    }).compile();

    controller = module.get<MalController>(MalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
