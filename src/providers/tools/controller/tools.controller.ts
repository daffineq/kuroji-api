import { Controller } from '@nestjs/common';
import { ToolsService } from '../service/tools.service.js';

@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}
}
