import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ExceptionsService } from '../service/exceptions.service';
import { ExceptionFilterDto } from '../model/ExceptionFilterDto';

@Controller('exceptions')
export class ExceptionsController {
  constructor(private readonly service: ExceptionsService) {}

  @Get()
  async getAllExceptions(@Query() filter: ExceptionFilterDto) {
    return this.service.getExceptions(filter);
  }

  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
