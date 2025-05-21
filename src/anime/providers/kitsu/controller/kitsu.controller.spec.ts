import { Test, TestingModule } from '@nestjs/testing';
import { KitsuController } from './kitsu.controller';

describe('KitsuController', () => {
  let controller: KitsuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KitsuController],
    }).compile();

    controller = module.get<KitsuController>(KitsuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
