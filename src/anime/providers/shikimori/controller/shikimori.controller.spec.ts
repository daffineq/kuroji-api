import { Test, TestingModule } from '@nestjs/testing';
import { ShikimoriController } from './shikimori.controller';
import { ShikimoriService } from '../service/shikimori.service';
import { PrismaService } from '../../../../prisma.service';
import { CustomHttpService } from '../../../../http/http.service';
import { ShikimoriHelper } from '../utils/shikimori-helper';
import { HttpModule } from '@nestjs/axios';

describe('ShikimoriController', () => {
  let controller: ShikimoriController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [ShikimoriController],
      providers: [
        ShikimoriService,
        PrismaService,
        CustomHttpService,
        ShikimoriHelper
      ],
    }).compile();

    controller = module.get<ShikimoriController>(ShikimoriController);
  });

  it('get Shikimori check', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
