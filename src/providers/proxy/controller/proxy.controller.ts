import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { ProxyService } from '../service/proxy.service.js';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { IgnoreThrottler } from '../../../decorators/throttler/ignore-throttler.decorator.js';

@ApiTags('Proxy')
@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  @ApiOperation({
    summary: 'Proxy stream requests (e.g., .m3u8, .ts)',
  })
  @ApiQuery({ name: 'url', required: true, description: 'CDN resource URL' })
  @ApiQuery({
    name: 'headers',
    required: false,
    description: 'JSON string of custom headers',
  })
  @ApiQuery({
    name: 'origin',
    required: false,
    description: 'Origin header value',
  })
  @IgnoreThrottler()
  async proxyStream(
    @Res() res: Response,
    @Query('url') url: string,
    @Query('headers') headers?: string,
    @Query('origin') origin?: string,
  ) {
    if (!url || !url.startsWith('http')) {
      res.status(400).json({ message: 'Invalid URL' });
      return;
    }

    let customHeaders: Record<string, string> = {};
    if (headers) {
      try {
        customHeaders = JSON.parse(decodeURIComponent(headers)) as Record<
          string,
          string
        >;
      } catch {
        res
          .status(400)
          .json({ message: 'Invalid headers format. Must be valid JSON.' });
        return;
      }
    }

    if (origin) {
      customHeaders['Origin'] = origin;
    }

    try {
      const {
        content,
        headers: responseHeaders,
        isStream,
      } = await this.proxyService.fetchProxiedStream(url, customHeaders);

      Object.entries(responseHeaders).forEach(([key, value]) => {
        if (value !== undefined) {
          res.setHeader(key, value);
        }
      });

      if (isStream && content instanceof Readable) {
        res.flushHeaders();
        const onClose = () => {
          content.destroy();
        };

        res.on('close', onClose);
        res.on('finish', () => res.removeListener('close', onClose));
        content.on('error', (err) => {
          console.error('Stream error:', err);
          if (!res.headersSent && !res.writableEnded) {
            res.status(500).send('Stream error');
          }
        });

        await pipeline(content, res);
      } else {
        res.send(content);
      }
    } catch (err: unknown) {
      console.error('Proxy failed:', err instanceof Error ? err.message : err);
      if (!res.headersSent && !res.writableEnded) {
        res.status(500).json({
          message: 'Failed to fetch resource',
          reason: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }
}
