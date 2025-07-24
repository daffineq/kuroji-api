import axios from 'axios';
import { URL } from 'url';
import { UrlConfig } from '../../../configs/url.config.js';
import { Readable } from 'stream';
import { Provider } from '../../anime/stream/types/types.js';

export class ProxyService {
  async fetchProxiedStream(url: string): Promise<{
    content: Buffer | Readable;
    contentType: string;
    isStream: boolean;
  }> {
    const response = await axios.get<Readable>(url, {
      headers: this.getHeaders(url),
      responseType: 'stream',
      decompress: false,
      timeout: 10000,
      validateStatus: () => true, // we don't throw
    });

    const headers = response.headers as Record<string, string | undefined>;
    const contentType = headers['content-type'] || '';

    if (
      contentType.includes('application/vnd.apple.mpegurl') ||
      url.endsWith('.m3u8')
    ) {
      const rawText = await this.streamToString(response.data);
      const baseUrl = url.slice(0, url.lastIndexOf('/') + 1);

      const rewritten = rawText
        .split('\n')
        .map((line) => {
          if (line.trim().startsWith('#') || line.trim() === '') return line;
          const full = new URL(line.trim(), baseUrl).toString();
          return `${UrlConfig.BASE}api/proxy?url=${encodeURIComponent(full)}`;
        })
        .join('\n');

      return {
        content: Buffer.from(rewritten, 'utf-8'),
        contentType: 'application/vnd.apple.mpegurl',
        isStream: false,
      };
    }

    return {
      content: response.data,
      contentType,
      isStream: true,
    };
  }

  private getHeaders(url: string): Record<string, string | undefined> {
    const provider = detectProvider(url);

    if (!provider) {
      return {};
    }

    if (provider === Provider.zoro) {
      return {
        Origin: 'https://megaplay.buzz',
        Referer: 'https://megaplay.buzz/',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        Accept: '*/*',
      };
    } else if (provider === Provider.animekai) {
      return {}; // Couldn't get headers - dead provider
    } else if (provider === Provider.animepahe) {
      return { Referer: 'https://kwik.si/' };
    } else if (provider === Provider.anilibria) {
      return {}; //TODO: put here default headers when anilibra is working
    }

    return {};

    function detectProvider(url: string): Provider | null {
      const hostname = new URL(url).hostname;

      if (
        hostname.includes('padorupado.ru') ||
        hostname.includes('kwik.cx') ||
        hostname.includes('kwik.si') ||
        hostname.includes('animepahe.com') ||
        hostname.includes('animepahe.ru')
      ) {
        return Provider.animepahe;
      }

      if (
        hostname.includes('dotstream.buzz') ||
        hostname.includes('megaplay.buzz') ||
        hostname.includes('hianime.to') ||
        hostname.includes('renvix.club') ||
        hostname.includes('onestra.click')
      ) {
        return Provider.zoro;
      }

      // TODO: add others when they are working

      return null;
    }
  }

  private async streamToString(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => {
        if (Buffer.isBuffer(chunk)) {
          chunks.push(chunk);
        } else if (typeof chunk === 'string' || chunk instanceof Uint8Array) {
          chunks.push(Buffer.from(chunk));
        } else {
          reject(new Error('Unknown chunk type'));
        }
      });
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      stream.on('error', reject);
    });
  }
}
