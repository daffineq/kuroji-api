import { Module } from 'src/helpers/module';

class MangaModule extends Module {
  override readonly name = 'Manga';

  // Nothing to add here tho
}

const Manga = new MangaModule();

export { Manga, MangaModule };
