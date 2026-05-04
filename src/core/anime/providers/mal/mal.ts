import { getKey, Redis } from 'src/helpers/redis.util';
import { parseString } from 'src/helpers/parsers';
import { ProviderModule } from 'src/helpers/module';
import { Anime } from '../../anime';
import { AnimeVideoPayload } from '../../types';
import { load } from 'cheerio';
import { MyAnimeListInfo, MyAnimeListVideo } from './types';
import { Config } from 'src/config';

class MyAnimeListModule extends ProviderModule<MyAnimeListInfo> {
  override readonly name = 'MyAnimeList';

  override async getInfo(id: number, idMal?: number): Promise<MyAnimeListInfo> {
    if (!Config.use_myanimelist) {
      throw new Error(`${this.name} disabled`);
    }

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

      await Anime.save({ id, videos });
    }

    if (info.image) {
      await Anime.save({
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
      await Anime.save({ id, moreinfo: info.moreInfo });
    }

    if (info.broadcast) {
      await Anime.save({ id, broadcast: info.broadcast });
    }

    await Redis.set(key, info);

    return info;
  }

  private async resolveInfo(id: number, idMal?: number) {
    if (idMal) {
      const info = await this.scrape(idMal);

      await Anime.save({
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
        const al = await Anime.getBasicInfo(id);

        if (!al?.id_mal) {
          throw new Error('No MAL ID found');
        }

        const info = await this.scrape(al.id_mal);

        await Anime.save({
          id,
          links: {
            link: parseString(al.id_mal)!,
            label: this.name,
            type: 'mapping'
          }
        });

        return info;
      }
    }
  }

  private async scrape(id: number | string): Promise<MyAnimeListInfo> {
    const [res, moreInfoRes, videoRes] = await Promise.all([
      fetch(`${Config.myanimelist}/anime/${id}`),
      fetch(`${Config.myanimelist}/anime/${id}/1/moreinfo`),
      fetch(`${Config.myanimelist}/anime/${id}/1/video`)
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
