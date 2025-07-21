import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Anilibra')
@Controller('anime')
export class AnilibriaController {
  constructor() {}
}
