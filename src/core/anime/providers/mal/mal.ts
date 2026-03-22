import { getKey, Redis } from 'src/helpers/redis.util';
import { parseString } from 'src/helpers/parsers';
import { Anilist } from '../anilist';
import { ProviderModule } from 'src/helpers/module';
import { Anime } from '../../anime';
import { AnimeVideoPayload } from '../../types';
import { load } from 'cheerio';
import { MyAnimeListInfo, MyAnimeListVideo } from './types';

class MyAnimeListModule extends ProviderModule<MyAnimeListInfo> {
  override readonly name = 'MyAnimeList';

  private url = 'https://myanimelist.net';

  override async getInfo(id: number, idMal?: number): Promise<MyAnimeListInfo> {
    const key = getKey(this.name, 'info', id);

    const cached = await Redis.get<MyAnimeListInfo>(key);

    if (cached) {
      return cached;
    }

    const info = await this.resolveInfo(id, idMal);

    if (info.videos) {
      const videos: AnimeVideoPayload[] = info.videos.map((v) => {
        return {
          url: v.url,
          title: v.title,
          thumbnail: v.thumbnail ?? undefined,
          artist: v.artist ?? undefined,
          type: v.type,
          source: this.name
        };
      });

      await Anime.upsert({ id, videos });
    }

    if (info.image) {
      await Anime.upsert({
        id,
        images: {
          url: info.image,
          large: info.image,
          type: 'poster',
          source: this.name
        }
      });
    }

    if (info.moreInfo) {
      await Anime.upsert({ id, moreinfo: info.moreInfo });
    }

    if (info.broadcast) {
      await Anime.upsert({ id, broadcast: info.broadcast });
    }

    await Redis.set(key, info);

    return info;
  }

  async resolveInfo(id: number, idMal?: number) {
    if (idMal) {
      const info = await this.scrape(idMal);

      await Anime.upsert({
        id,
        links: {
          link: parseString(idMal)!,
          label: this.name,
          type: 'mapping'
        }
      });

      return info;
    } else {
      const idMap = await Anime.map(id, this.name);

      if (idMap) {
        return this.scrape(idMap);
      } else {
        const al = await Anilist.getInfo(id);

        if (!al.idMal) {
          throw new Error('No MAL ID found');
        }

        const info = await this.scrape(al.idMal);

        await Anime.upsert({
          id,
          links: {
            link: parseString(al.idMal)!,
            label: this.name,
            type: 'mapping'
          }
        });

        return info;
      }
    }
  }

  async scrape(id: number | string): Promise<MyAnimeListInfo> {
    const [res, moreInfoRes, videoRes] = await Promise.all([
      fetch(`${this.url}/anime/${id}`),
      fetch(`${this.url}/anime/${id}/1/moreinfo`),
      fetch(`${this.url}/anime/${id}/1/video`)
    ]);
    const html = await res.text();
    const $ = load(html);

    const extractInfo = (text: string): string => {
      const el = $('div.spaceit_pad').filter((_, el) => $(el).find('span.dark_text').text().trim() === text);

      if (!el.length) return '';

      const fullText = el.text().trim();
      return fullText.replace(text, '').trim();
    };

    const image = $('div.leftside img').attr('data-src');

    const moreInfo$ = load(await moreInfoRes.text());
    const video$ = load(await videoRes.text());

    const moreInfo = moreInfo$("h2.mb8:contains('More Info')")
      .parent()
      .contents()
      .filter((_, el) => el.type === 'text')
      .map((_, el) => moreInfo$(el).text().trim())
      .get()
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    const broadcast = extractInfo('Broadcast:');

    const videos: MyAnimeListVideo[] = [];

    video$('div.video-block.promotional-video div.video-list-outer').each((_, el) => {
      const $el = $(el);
      const $a = $el.find('a.video-list');

      const url = $a.attr('href') ?? '';
      const thumbnail = $a.find('img.thumbs').attr('data-src') ?? null;
      const title = ($a.find('.title').text().trim() || $a.find('img').attr('data-title')) ?? '';

      if (url) {
        videos.push({
          title,
          url,
          thumbnail,
          artist: null,
          type: 'trailer'
        });
      }
    });

    video$('div.video-block.music-video div.video-list-outer').each((_, el) => {
      const $el = $(el);
      const $a = $el.find('a.video-list');

      const url = $a.attr('href') ?? '';
      const thumbnail = $a.find('img.thumbs').attr('data-src') ?? null;
      const title = ($a.find('.title').text().trim() || $a.find('img').attr('data-title')) ?? '';
      const artist = $el.find('> div').text().trim() || null;

      if (url) {
        videos.push({
          title,
          url,
          thumbnail,
          artist,
          type: 'music'
        });
      }
    });

    return {
      image,
      broadcast,
      moreInfo,
      videos
    };
  }
}

const MyAnimeList = new MyAnimeListModule();

export { MyAnimeList, MyAnimeListModule };
