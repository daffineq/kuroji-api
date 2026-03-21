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
      from: r.anime.id.through(r.animeToAiringSchedule.A),
      to: r.animeAiringSchedule.id.through(r.animeToAiringSchedule.B)
    }),
    characters: r.many.animeToCharacter({
      from: r.anime.id,
      to: r.animeToCharacter.anime_id
    }),
    studios: r.many.animeToStudio({
      from: r.anime.id,
      to: r.animeToStudio.anime_id
    }),
    tags: r.many.animeToTag({
      from: r.anime.id,
      to: r.animeToTag.anime_id
    }),
    score_distribution: r.many.animeScoreDistribution({
      from: r.anime.id,
      to: r.animeScoreDistribution.anime_id
    }),
    status_distribution: r.many.animeStatusDistribution({
      from: r.anime.id,
      to: r.animeStatusDistribution.anime_id
    }),
    links: r.many.animeLink({
      from: r.anime.id.through(r.animeToLink.A),
      to: r.animeLink.id.through(r.animeToLink.B)
    }),
    chronology: r.many.animeChronology({
      from: r.anime.id,
      to: r.animeChronology.anime_id
    }),
    recommendations: r.many.animeRecommendation({
      from: r.anime.id,
      to: r.animeRecommendation.anime_id
    }),
    other_titles: r.many.animeOtherTitle({
      from: r.anime.id.through(r.animeToOtherTitle.A),
      to: r.animeOtherTitle.id.through(r.animeToOtherTitle.B)
    }),
    other_descriptions: r.many.animeOtherDescription({
      from: r.anime.id.through(r.animeToOtherDescription.A),
      to: r.animeOtherDescription.id.through(r.animeToOtherDescription.B)
    }),
    images: r.many.animeImage({
      from: r.anime.id.through(r.animeToImage.A),
      to: r.animeImage.id.through(r.animeToImage.B)
    }),
    videos: r.many.animeVideo({
      from: r.anime.id.through(r.animeToVideo.A),
      to: r.animeVideo.id.through(r.animeToVideo.B)
    }),
    screenshots: r.many.animeScreenshot({
      from: r.anime.id.through(r.animeToScreenshot.A),
      to: r.animeScreenshot.id.through(r.animeToScreenshot.B)
    }),
    artworks: r.many.animeArtwork({
      from: r.anime.id.through(r.animeToArtwork.A),
      to: r.animeArtwork.id.through(r.animeToArtwork.B)
    }),
    episodes: r.many.animeEpisode({
      from: r.anime.id,
      to: r.animeEpisode.anime_id
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
      from: r.animeAiringSchedule.id.through(r.animeToAiringSchedule.B),
      to: r.anime.id.through(r.animeToAiringSchedule.A)
    })
  },

  animeToAiringSchedule: {
    anime: r.one.anime({
      from: r.animeToAiringSchedule.A,
      to: r.anime.id
    }),

    schedule: r.one.animeAiringSchedule({
      from: r.animeToAiringSchedule.B,
      to: r.animeAiringSchedule.id
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
    connections: r.many.animeToCharacter({
      from: r.animeCharacter.id,
      to: r.animeToCharacter.character_id
    })
  },

  animeCharacterConnection: {
    anime: r.one.anime({
      from: r.animeToCharacter.anime_id,
      to: r.anime.id
    }),
    character: r.one.animeCharacter({
      from: r.animeToCharacter.character_id,
      to: r.animeCharacter.id
    }),
    voice_actors: r.many.animeVoiceActor({
      from: r.animeToCharacter.id.through(r.characterToVoiceActor.A),
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
    connections: r.many.animeToCharacter({
      from: r.animeVoiceActor.id.through(r.characterToVoiceActor.B),
      to: r.animeToCharacter.id.through(r.characterToVoiceActor.A)
    })
  },

  characterToVoiceActor: {
    connection: r.one.animeToCharacter({
      from: r.characterToVoiceActor.A,
      to: r.animeToCharacter.id
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
    connections: r.many.animeToStudio({
      from: r.animeStudio.id,
      to: r.animeToStudio.studio_id
    })
  },

  animeStudioConnection: {
    anime: r.one.anime({
      from: r.animeToStudio.anime_id,
      to: r.anime.id
    }),
    studio: r.one.animeStudio({
      from: r.animeToStudio.studio_id,
      to: r.animeStudio.id
    })
  },

  animeTag: {
    connections: r.many.animeToTag({
      from: r.animeTag.id,
      to: r.animeToTag.tag_id
    })
  },

  animeTagConnection: {
    anime: r.one.anime({
      from: r.animeToTag.anime_id,
      to: r.anime.id
    }),
    tag: r.one.animeTag({
      from: r.animeToTag.tag_id,
      to: r.animeTag.id
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

  animeLink: {
    anime: r.one.anime({
      from: r.animeLink.id.through(r.animeToLink.B),
      to: r.anime.id.through(r.animeToLink.A)
    })
  },

  animeToLink: {
    anime: r.one.anime({
      from: r.animeToLink.A,
      to: r.anime.id
    }),
    link: r.one.animeLink({
      from: r.animeToLink.B,
      to: r.animeLink.id
    })
  },

  animeChronology: {
    anime: r.one.anime({
      from: r.animeChronology.anime_id,
      to: r.anime.id
    })
  },

  animeRecommendation: {
    anime: r.one.anime({
      from: r.animeRecommendation.anime_id,
      to: r.anime.id
    })
  },

  animeOtherTitle: {
    anime: r.many.anime({
      from: r.animeOtherTitle.id.through(r.animeToOtherTitle.B),
      to: r.anime.id.through(r.animeToOtherTitle.A)
    })
  },

  animeToOtherTitle: {
    anime: r.one.anime({
      from: r.animeToOtherTitle.A,
      to: r.anime.id
    }),
    other_title: r.one.animeOtherTitle({
      from: r.animeToOtherTitle.B,
      to: r.animeOtherTitle.id
    })
  },

  animeOtherDescription: {
    anime: r.many.anime({
      from: r.animeOtherDescription.id.through(r.animeToOtherDescription.B),
      to: r.anime.id.through(r.animeToOtherDescription.A)
    })
  },

  animeToOtherDescription: {
    anime: r.one.anime({
      from: r.animeToOtherDescription.A,
      to: r.anime.id
    }),
    other_description: r.one.animeOtherDescription({
      from: r.animeToOtherDescription.B,
      to: r.animeOtherDescription.id
    })
  },

  animeImage: {
    anime: r.many.anime({
      from: r.animeImage.id.through(r.animeToImage.B),
      to: r.anime.id.through(r.animeToImage.A)
    })
  },

  animeToImage: {
    anime: r.one.anime({
      from: r.animeToImage.A,
      to: r.anime.id
    }),
    image: r.one.animeImage({
      from: r.animeToImage.B,
      to: r.animeImage.id
    })
  },

  animeVideo: {
    anime: r.many.anime({
      from: r.animeVideo.id.through(r.animeToVideo.B),
      to: r.anime.id.through(r.animeToVideo.A)
    })
  },

  animeToVideo: {
    anime: r.one.anime({
      from: r.animeToVideo.A,
      to: r.anime.id
    }),
    video: r.one.animeVideo({
      from: r.animeToVideo.B,
      to: r.animeVideo.id
    })
  },

  animeScreenshot: {
    anime: r.many.anime({
      from: r.animeScreenshot.id.through(r.animeToScreenshot.B),
      to: r.anime.id.through(r.animeToScreenshot.A)
    })
  },

  animeToScreenshot: {
    anime: r.one.anime({
      from: r.animeToScreenshot.A,
      to: r.anime.id
    }),
    screenshot: r.one.animeScreenshot({
      from: r.animeToScreenshot.B,
      to: r.animeScreenshot.id
    })
  },

  animeArtwork: {
    anime: r.many.anime({
      from: r.animeArtwork.id.through(r.animeToArtwork.B),
      to: r.anime.id.through(r.animeToArtwork.A)
    })
  },

  animeToArtwork: {
    anime: r.one.anime({
      from: r.animeToArtwork.A,
      to: r.anime.id
    }),
    artwork: r.one.animeArtwork({
      from: r.animeToArtwork.B,
      to: r.animeArtwork.id
    })
  },

  animeEpisode: {
    anime: r.one.anime({
      from: r.animeEpisode.anime_id,
      to: r.anime.id
    }),
    image: r.one.animeEpisodeImage({
      from: r.animeEpisode.id,
      to: r.animeEpisodeImage.episode_id
    })
  },

  animeEpisodeImage: {
    episode: r.one.animeEpisode({
      from: r.animeEpisodeImage.episode_id,
      to: r.animeEpisode.id
    })
  },

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
