import axios from 'axios';
import { URL } from 'url';

const HEADERS = {
  Origin: 'https://megaplay.buzz',
  Referer: 'https://megaplay.buzz/',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
  Accept: '*/*',
};

export async function fetchProxiedStream(
  url: string,
): Promise<{ content: Buffer; contentType: string }> {
  const response = await axios.get<ArrayBuffer>(url, {
    headers: HEADERS,
    responseType: 'arraybuffer',
    decompress: true,
    timeout: 10000,
  });

  const headers = response.headers as Record<string, string | undefined>;
  const contentType = headers['content-type'] || '';
  const rawText = Buffer.from(response.data).toString('utf-8');

  if (
    contentType.includes('application/vnd.apple.mpegurl') ||
    url.endsWith('.m3u8')
  ) {
    const baseUrl = url.slice(0, url.lastIndexOf('/') + 1);

    const rewritten = rawText
      .split('\n')
      .map((line) => {
        if (line.trim().startsWith('#') || line.trim() === '') return line;
        const full = new URL(line.trim(), baseUrl).toString();
        return `/api/anime/watch/_/zoro/proxy?url=${encodeURIComponent(full)}`;
      })
      .join('\n');

    return {
      content: Buffer.from(rewritten, 'utf-8'),
      contentType: 'application/vnd.apple.mpegurl',
    };
  }

  return {
    content: Buffer.from(response.data),
    contentType,
  };
}
