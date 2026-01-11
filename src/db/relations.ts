import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
  anime: {
    title: r.one.animeTitle({
      from: r.anime.id,
      to: r.animeTitle.anime_id
    }),
    poster: r.one.animePoster({
      from: r.anime.id,
      to: r.animePoster.anime_id
    }),
    start_date: r.one.animeStartDate({
      from: r.anime.id,
      to: r.animeStartDate.anime_id
    }),
    end_date: r.one.animeEndDate({
      from: r.anime.id,
      to: r.animeEndDate.anime_id
    }),
    genres: r.many.animeGenre({
      from: r.anime.id.through(r.animeToGenre.A),
      to: r.animeGenre.id.through(r.animeToGenre.B)
    }),
    airing_schedule: r.many.animeAiringSchedule({
      from: r.anime.id,
      to: r.animeAiringSchedule.anime_id
    }),
    characters: r.many.animeCharacterEdge({
      from: r.anime.id,
      to: r.animeCharacterEdge.anime_id
    }),
    studios: r.many.animeStudioEdge({
      from: r.anime.id,
      to: r.animeStudioEdge.anime_id
    }),
    tags: r.many.animeTagEdge({
      from: r.anime.id,
      to: r.animeTagEdge.anime_id
    }),
    external_links: r.many.animeExternalLink({
      from: r.anime.id,
      to: r.animeExternalLink.anime_id
    }),
    score_distribution: r.many.animeScoreDistribution({
      from: r.anime.id,
      to: r.animeScoreDistribution.anime_id
    }),
    status_distribution: r.many.animeStatusDistribution({
      from: r.anime.id,
      to: r.animeStatusDistribution.anime_id
    }),
    meta: r.one.meta({
      from: r.anime.id,
      to: r.meta.anime_id
    })
  },

  animeTitle: {
    anime: r.one.anime({
      from: r.animeTitle.anime_id,
      to: r.anime.id
    })
  },

  animePoster: {
    anime: r.one.anime({
      from: r.animePoster.anime_id,
      to: r.anime.id
    })
  },

  animeStartDate: {
    anime: r.one.anime({
      from: r.animeStartDate.anime_id,
      to: r.anime.id
    })
  },

  animeEndDate: {
    anime: r.one.anime({
      from: r.animeEndDate.anime_id,
      to: r.anime.id
    })
  },

  animeGenre: {
    anime: r.many.anime({
      from: r.animeGenre.id.through(r.animeToGenre.B),
      to: r.anime.id.through(r.animeToGenre.A)
    })
  },

  animeToGenre: {
    anime: r.one.anime({
      from: r.animeToGenre.A,
      to: r.anime.id
    }),
    genre: r.one.animeGenre({
      from: r.animeToGenre.B,
      to: r.animeGenre.id
    })
  },

  animeAiringSchedule: {
    anime: r.one.anime({
      from: r.animeAiringSchedule.anime_id,
      to: r.anime.id
    })
  },

  animeCharacter: {
    name: r.one.animeCharacterName({
      from: r.animeCharacter.id,
      to: r.animeCharacterName.character_id
    }),
    image: r.one.animeCharacterImage({
      from: r.animeCharacter.id,
      to: r.animeCharacterImage.character_id
    }),
    edges: r.many.animeCharacterEdge({
      from: r.animeCharacter.id,
      to: r.animeCharacterEdge.character_id
    })
  },

  animeCharacterEdge: {
    anime: r.one.anime({
      from: r.animeCharacterEdge.anime_id,
      to: r.anime.id
    }),
    character: r.one.animeCharacter({
      from: r.animeCharacterEdge.character_id,
      to: r.animeCharacter.id
    }),
    voice_actors: r.many.animeVoiceActor({
      from: r.animeCharacterEdge.id.through(r.characterToVoiceActor.A),
      to: r.animeVoiceActor.id.through(r.characterToVoiceActor.B)
    })
  },

  animeCharacterName: {
    character: r.one.animeCharacter({
      from: r.animeCharacterName.character_id,
      to: r.animeCharacter.id
    })
  },

  animeCharacterImage: {
    character: r.one.animeCharacter({
      from: r.animeCharacterImage.character_id,
      to: r.animeCharacter.id
    })
  },

  animeVoiceActor: {
    name: r.one.animeVoiceName({
      from: r.animeVoiceActor.id,
      to: r.animeVoiceName.voice_actor_id
    }),
    image: r.one.animeVoiceImage({
      from: r.animeVoiceActor.id,
      to: r.animeVoiceImage.voice_actor_id
    }),
    character_edges: r.many.animeCharacterEdge({
      from: r.animeVoiceActor.id.through(r.characterToVoiceActor.B),
      to: r.animeCharacterEdge.id.through(r.characterToVoiceActor.A)
    })
  },

  characterToVoiceActor: {
    character_edge: r.one.animeCharacterEdge({
      from: r.characterToVoiceActor.A,
      to: r.animeCharacterEdge.id
    }),
    voice_actor: r.one.animeVoiceActor({
      from: r.characterToVoiceActor.B,
      to: r.animeVoiceActor.id
    })
  },

  animeVoiceName: {
    voice_actor: r.one.animeVoiceActor({
      from: r.animeVoiceName.voice_actor_id,
      to: r.animeVoiceActor.id
    })
  },

  animeVoiceImage: {
    voice_actor: r.one.animeVoiceActor({
      from: r.animeVoiceImage.voice_actor_id,
      to: r.animeVoiceActor.id
    })
  },

  animeStudio: {
    edges: r.many.animeStudioEdge({
      from: r.animeStudio.id,
      to: r.animeStudioEdge.studio_id
    })
  },

  animeStudioEdge: {
    anime: r.one.anime({
      from: r.animeStudioEdge.anime_id,
      to: r.anime.id
    }),
    studio: r.one.animeStudio({
      from: r.animeStudioEdge.studio_id,
      to: r.animeStudio.id
    })
  },

  animeTag: {
    edges: r.many.animeTagEdge({
      from: r.animeTag.id,
      to: r.animeTagEdge.tag_id
    })
  },

  animeTagEdge: {
    anime: r.one.anime({
      from: r.animeTagEdge.anime_id,
      to: r.anime.id
    }),
    tag: r.one.animeTag({
      from: r.animeTagEdge.tag_id,
      to: r.animeTag.id
    })
  },

  animeExternalLink: {
    anime: r.one.anime({
      from: r.animeExternalLink.anime_id,
      to: r.anime.id
    })
  },

  animeScoreDistribution: {
    anime: r.one.anime({
      from: r.animeScoreDistribution.anime_id,
      to: r.anime.id
    })
  },

  animeStatusDistribution: {
    anime: r.one.anime({
      from: r.animeStatusDistribution.anime_id,
      to: r.anime.id
    })
  },

  // Meta relations
  meta: {
    anime: r.one.anime({
      from: r.meta.anime_id,
      to: r.anime.id
    }),
    mappings: r.many.metaMapping({
      from: r.meta.id,
      to: r.metaMapping.meta_id
    }),
    chronology: r.many.metaChronology({
      from: r.meta.id,
      to: r.metaChronology.meta_id
    }),
    titles: r.many.metaTitle({
      from: r.meta.id.through(r.metaToTitle.A),
      to: r.metaTitle.id.through(r.metaToTitle.B)
    }),
    descriptions: r.many.metaDescription({
      from: r.meta.id.through(r.metaToDescription.A),
      to: r.metaDescription.id.through(r.metaToDescription.B)
    }),
    images: r.many.metaImage({
      from: r.meta.id.through(r.metaToImage.A),
      to: r.metaImage.id.through(r.metaToImage.B)
    }),
    videos: r.many.metaVideo({
      from: r.meta.id.through(r.metaToVideo.A),
      to: r.metaVideo.id.through(r.metaToVideo.B)
    }),
    screenshots: r.many.metaScreenshot({
      from: r.meta.id.through(r.metaToScreenshot.A),
      to: r.metaScreenshot.id.through(r.metaToScreenshot.B)
    }),
    artworks: r.many.metaArtwork({
      from: r.meta.id.through(r.metaToArtwork.A),
      to: r.metaArtwork.id.through(r.metaToArtwork.B)
    })
  },

  metaMapping: {
    meta: r.one.meta({
      from: r.metaMapping.meta_id,
      to: r.meta.id
    })
  },

  metaChronology: {
    meta: r.one.meta({
      from: r.metaChronology.meta_id,
      to: r.meta.id
    })
  },

  metaTitle: {
    metas: r.many.meta({
      from: r.metaTitle.id.through(r.metaToTitle.B),
      to: r.meta.id.through(r.metaToTitle.A)
    })
  },

  metaToTitle: {
    meta: r.one.meta({
      from: r.metaToTitle.A,
      to: r.meta.id
    }),
    title: r.one.metaTitle({
      from: r.metaToTitle.B,
      to: r.metaTitle.id
    })
  },

  metaDescription: {
    metas: r.many.meta({
      from: r.metaDescription.id.through(r.metaToDescription.B),
      to: r.meta.id.through(r.metaToDescription.A)
    })
  },

  metaToDescription: {
    meta: r.one.meta({
      from: r.metaToDescription.A,
      to: r.meta.id
    }),
    description: r.one.metaDescription({
      from: r.metaToDescription.B,
      to: r.metaDescription.id
    })
  },

  metaImage: {
    metas: r.many.meta({
      from: r.metaImage.id.through(r.metaToImage.B),
      to: r.meta.id.through(r.metaToImage.A)
    })
  },

  metaToImage: {
    meta: r.one.meta({
      from: r.metaToImage.A,
      to: r.meta.id
    }),
    image: r.one.metaImage({
      from: r.metaToImage.B,
      to: r.metaImage.id
    })
  },

  metaVideo: {
    metas: r.many.meta({
      from: r.metaVideo.id.through(r.metaToVideo.B),
      to: r.meta.id.through(r.metaToVideo.A)
    })
  },

  metaToVideo: {
    meta: r.one.meta({
      from: r.metaToVideo.A,
      to: r.meta.id
    }),
    video: r.one.metaVideo({
      from: r.metaToVideo.B,
      to: r.metaVideo.id
    })
  },

  metaScreenshot: {
    metas: r.many.meta({
      from: r.metaScreenshot.id.through(r.metaToScreenshot.B),
      to: r.meta.id.through(r.metaToScreenshot.A)
    })
  },

  metaToScreenshot: {
    meta: r.one.meta({
      from: r.metaToScreenshot.A,
      to: r.meta.id
    }),
    screenshot: r.one.metaScreenshot({
      from: r.metaToScreenshot.B,
      to: r.metaScreenshot.id
    })
  },

  metaArtwork: {
    metas: r.many.meta({
      from: r.metaArtwork.id.through(r.metaToArtwork.B),
      to: r.meta.id.through(r.metaToArtwork.A)
    })
  },

  metaToArtwork: {
    meta: r.one.meta({
      from: r.metaToArtwork.A,
      to: r.meta.id
    }),
    artwork: r.one.metaArtwork({
      from: r.metaToArtwork.B,
      to: r.metaArtwork.id
    })
  },

  // API Key relations
  apiKey: {
    usage: r.many.apiKeyUsage({
      from: r.apiKey.id,
      to: r.apiKeyUsage.api_key_id
    })
  },

  apiKeyUsage: {
    api_key: r.one.apiKey({
      from: r.apiKeyUsage.api_key_id,
      to: r.apiKey.id
    })
  }
}));
