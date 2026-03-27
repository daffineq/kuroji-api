import { Module } from 'src/helpers/module';
import { getKey, Redis } from 'src/helpers/redis.util';
import { ZerochanArtwork } from './types';
import { Anilist } from '../anilist';
import { AnimeUtils, ArtworkType } from '../../helpers';
import { ZerochanFetch } from './helpers/zerochan.fetch';
import { ExpectAnime, findBestMatch, getSearchTitle } from 'src/helpers/mapper';
import { parseString } from 'src/helpers/parsers';
import { NotFoundError } from 'src/helpers/errors';
import { Anime } from '../../anime';
import { AnimeArtworkPayload } from '../../types';

class ZerochanModule extends Module {
  override readonly name = 'Zerochan';

  private imageUrl = 'https://static.zerochan.net';

  async getImages(id: number): Promise<ZerochanArtwork[]> {
    const key = getKey(this.name, 'info', id);

    const cached = await Redis.get<ZerochanArtwork[]>(key);

    if (cached) {
      return cached;
    }

    const images = await this.resolveImages(id);

    const artworks: AnimeArtworkPayload[] = images.map((i) => {
      return {
        url: i.md5,
        width: i.width,
        height: i.height,
        large: this.getImage(i),
        medium: i.thumbnail,
        type: this.getType(i),
        source: this.name,
        is_adult: this.isAdultContent(i.tags)
      };
    });

    await Anime.upsert({
      id,
      artworks
    });

    await Redis.set(key, images);

    return images;
  }

  private async resolveImages(id: number) {
    const idMap = await Anime.map(id, this.name);

    if (idMap) {
      return ZerochanFetch.searchImages(idMap);
    } else {
      const result = await this.find(id);

      await Anime.upsert({
        id,
        links: {
          link: result.q,
          label: this.name,
          type: 'mapping'
        }
      });

      return result.results;
    }
  }

  private async find(id: number): Promise<{
    q: string;
    results: ZerochanArtwork[];
  }> {
    const al = await Anilist.getInfo(id);

    if (!al) {
      throw new Error('Anilist not found');
    }

    const title = AnimeUtils.pickBestTitle(al);

    if (!title) {
      throw new Error('No title found');
    }

    const suggestions = await ZerochanFetch.fetchSuggestions(getSearchTitle(title));

    const results: ExpectAnime[] = suggestions
      .filter((s) => s.type === 'Series')
      .map((result) => {
        return {
          titles: [result.value],
          id: result.value
        };
      });

    const searchCriteria: ExpectAnime = {
      titles: [al.title?.romaji, al.title?.english, al.title?.native, ...al.synonyms]
    };

    const bestMatch = findBestMatch(searchCriteria, results);
    const bestMatchId = parseString(bestMatch?.id);

    if (bestMatchId) {
      const data = await ZerochanFetch.searchImages(bestMatchId);
      return {
        q: bestMatchId,
        results: data
      };
    }

    throw new NotFoundError('Images not found');
  }

  private getImage(i: ZerochanArtwork) {
    if (i.source.endsWith('.webp')) {
      return `${this.imageUrl}/${i.tag.replace(/\s+/g, '.')}.full.${i.id}.webp`;
    }

    return `${this.imageUrl}/${i.tag.replace(/\s+/g, '.')}.full.${i.id}.jpg`;
  }

  private getType(i: ZerochanArtwork): ArtworkType {
    if (i.width > i.height) {
      return ArtworkType.BACKGROUND;
    }

    return ArtworkType.PHOTO;
  }

  private isAdultContent(tags: string[]): boolean {
    const adultTags = ['Ecchi', 'NSFW', 'R-18', 'Nude'];

    return tags.some((tag) => adultTags.some((adultTag) => tag.toLowerCase() === adultTag.toLowerCase()));
  }
}

const Zerochan = new ZerochanModule();

export { Zerochan, ZerochanModule };
