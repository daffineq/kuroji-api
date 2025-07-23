import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';
import { ZoroService } from '../service/zoro.service.js';
import { zoroFetch } from '../service/zoro.fetch.service.js';
import { Prisma } from '@prisma/client';
import { zoroSelect } from '../types/types.js';
import { ZoroSelectDto } from '../types/swagger-types.js';
import { fetchProxiedStream } from '../utils/hls.proxy.helper.js';

@ApiTags('Zoro')
@Controller('anime')
export class ZoroController {
  constructor(private readonly service: ZoroService) {}

  @Get('info/:id/zoro')
  @ApiOperation({
    summary: 'Get anime information from Zoro',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  async getZoroByAnilist(@Param('id', ParseIntPipe) id: number) {
    return this.service.getZoroByAnilist(id, zoroSelect);
  }

  @Post('info/:id/zoro')
  @ApiOperation({
    summary: 'Get anime information from Zoro with selected fields',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiBody({ type: ZoroSelectDto, required: false })
  async postZoroByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Body('select') select: Prisma.ZoroSelect = zoroSelect,
  ) {
    return this.service.getZoroByAnilist(id, select);
  }

  @Get('watch/:id/zoro')
  @ApiOperation({
    summary: 'Get streaming sources from Zoro',
  })
  @ApiParam({ name: 'id', type: String, description: 'Zoro episode ID' })
  @ApiQuery({ name: 'dub', required: false, type: Boolean })
  async getZoroWatch(
    @Param('id') id: string,
    @Query('dub') dub: boolean = false,
  ) {
    return zoroFetch.getSources(id, dub);
  }

  @Get('watch/:id/zoro/proxy')
  @ApiOperation({
    summary:
      "Proxy stream requests (e.g., .m3u8, .ts) (the id doesn't matter at all)",
  })
  @ApiQuery({ name: 'url', required: true, description: 'CDN resource URL' })
  async proxyStream(@Query('url') url: string, @Res() res: Response) {
    if (!url || !url.startsWith('http')) {
      return res.status(400).send('Invalid URL');
    }

    try {
      const { content, contentType } = await fetchProxiedStream(url);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'no-store');
      res.send(content);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Proxy failed:', err.message);
      } else {
        console.error('Proxy failed:', err);
      }
      res.status(500).send('Failed to fetch resource');
    }
  }

  @Put('info/:id/zoro/update')
  @ApiOperation({
    summary: 'Update and get information from Zoro',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiQuery({ name: 'force', required: false, type: Boolean })
  async updateZoroByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Query('force') force: boolean = false,
  ) {
    return this.service.update(id, force, zoroSelect);
  }

  @Post('info/:id/zoro/update')
  @ApiOperation({
    summary: 'Update and get information from Zoro with selected fields',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Anilist ID' })
  @ApiQuery({ name: 'force', required: false, type: Boolean })
  @ApiBody({ type: ZoroSelectDto, required: false })
  async postUpdateZoroByAnilist(
    @Param('id', ParseIntPipe) id: number,
    @Query('force') force: boolean = false,
    @Body('select') select: Prisma.ZoroSelect = zoroSelect,
  ) {
    return this.service.update(id, force, select);
  }
}
