import { Test, TestingModule } from '@nestjs/testing';
import { ZoroController } from './zoro.controller';
import { ZoroService } from '../service/zoro.service';
import { ZoroHelper } from '../utils/zoro-helper';
import { SharedModule } from '../../../../shared/shared.module';

describe('ZoroController', () => {
  let controller: ZoroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [ZoroController],
      providers: [ZoroService, ZoroHelper],
    }).compile();

    controller = module.get<ZoroController>(ZoroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
