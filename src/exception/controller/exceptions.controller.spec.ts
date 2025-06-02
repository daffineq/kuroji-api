import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionsController } from './exceptions.controller';
import { SharedModule } from '../../shared/shared.module';

describe('ExceptionsController', () => {
  let controller: ExceptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [ExceptionsController],
    }).compile();

    controller = module.get<ExceptionsController>(ExceptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
