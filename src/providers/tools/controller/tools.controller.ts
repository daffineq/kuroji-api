import { Controller } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { ToolsService } from '../service/tools.service.js';

// TODO: Delete this controller if it's not used. I'll just exclude it for now
@ApiExcludeController()
@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}
}
