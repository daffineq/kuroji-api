import axios from 'axios';
import { URL } from 'url';
import { UrlConfig } from '../../../../configs/url.config.js';
import { Readable } from 'stream';

const HEADERS = {
  Origin: 'https://megaplay.buzz',
  Referer: 'https://megaplay.buzz/',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
  Accept: '*/*',
};

export async function fetchProxiedStream(url: string): Promise<{
  content: Buffer | Readable;
  contentType: string;
  isStream: boolean;
}> {
  const response = await axios.get<Readable>(url, {
    headers: HEADERS,
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
    const rawText = await streamToString(response.data);
    const baseUrl = url.slice(0, url.lastIndexOf('/') + 1);

    const rewritten = rawText
      .split('\n')
      .map((line) => {
        if (line.trim().startsWith('#') || line.trim() === '') return line;
        const full = new URL(line.trim(), baseUrl).toString();
        return `${UrlConfig.BASE}api/anime/watch/0/zoro/proxy?url=${encodeURIComponent(full)}`;
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

function streamToString(stream: Readable): Promise<string> {
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
