import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
  media: {
    title: r.one.mediaTitle({
      from: r.media.id,
      to: r.mediaTitle.media_id
    }),
    poster: r.one.mediaPoster({
      from: r.media.id,
      to: r.mediaPoster.media_id
    }),
    start_date: r.one.mediaStartDate({
      from: r.media.id,
      to: r.mediaStartDate.media_id
    }),
    end_date: r.one.mediaEndDate({
      from: r.media.id,
      to: r.mediaEndDate.media_id
    }),
    broadcast: r.one.mediaBroadcast({
      from: r.media.id,
      to: r.mediaBroadcast.media_id
    }),
    age_rating: r.one.mediaAgeRating({
      from: r.media.id,
      to: r.mediaAgeRating.media_id
    }),
    genres: r.many.mediaGenre({
      from: r.media.id.through(r.mediaToGenre.A),
      to: r.mediaGenre.id.through(r.mediaToGenre.B)
    }),
    airing_schedule: r.many.mediaAiringSchedule({
      from: r.media.id,
      to: r.mediaAiringSchedule.media_id
    }),
    latest_airing_episode: r.one.mediaLatestAiringEpisode({
      from: r.media.id,
      to: r.mediaLatestAiringEpisode.media_id
    }),
    next_airing_episode: r.one.mediaNextAiringEpisode({
      from: r.media.id,
      to: r.mediaNextAiringEpisode.media_id
    }),
    last_airing_episode: r.one.mediaLastAiringEpisode({
      from: r.media.id,
      to: r.mediaLastAiringEpisode.media_id
    }),
    characters: r.many.mediaToCharacter({
      from: r.media.id,
      to: r.mediaToCharacter.media_id
    }),
    studios: r.many.mediaToStudio({
      from: r.media.id,
      to: r.mediaToStudio.media_id
    }),
    tags: r.many.mediaToTag({
      from: r.media.id,
      to: r.mediaToTag.media_id
    }),
    score_distribution: r.many.mediaScoreDistribution({
      from: r.media.id,
      to: r.mediaScoreDistribution.media_id
    }),
    status_distribution: r.many.mediaStatusDistribution({
      from: r.media.id,
      to: r.mediaStatusDistribution.media_id
    }),
    local_score_distribution: r.many.mediaLocalScoreDistribution({
      from: r.media.id,
      to: r.mediaLocalScoreDistribution.media_id
    }),
    local_status_distribution: r.many.mediaLocalStatusDistribution({
      from: r.media.id,
      to: r.mediaLocalStatusDistribution.media_id
    }),
    statistics: r.many.mediaStatistic({
      from: r.media.id,
      to: r.mediaStatistic.media_id
    }),
    links: r.many.mediaLink({
      from: r.media.id.through(r.mediaToLink.A),
      to: r.mediaLink.id.through(r.mediaToLink.B)
    }),
    chronology: r.many.mediaChronology({
      from: r.media.id,
      to: r.mediaChronology.media_id
    }),
    recommendations: r.many.mediaRecommendation({
      from: r.media.id,
      to: r.mediaRecommendation.media_id
    }),
    relations: r.many.mediaRelation({
      from: r.media.id,
      to: r.mediaRelation.media_id
    }),
    alt_titles: r.many.mediaAltTitle({
      from: r.media.id.through(r.mediaToAltTitle.A),
      to: r.mediaAltTitle.id.through(r.mediaToAltTitle.B)
    }),
    alt_descriptions: r.many.mediaAltDescription({
      from: r.media.id.through(r.mediaToAltDescription.A),
      to: r.mediaAltDescription.id.through(r.mediaToAltDescription.B)
    }),
    images: r.many.mediaImage({
      from: r.media.id.through(r.mediaToImage.A),
      to: r.mediaImage.id.through(r.mediaToImage.B)
    }),
    videos: r.many.mediaVideo({
      from: r.media.id.through(r.mediaToVideo.A),
      to: r.mediaVideo.id.through(r.mediaToVideo.B)
    }),
    screenshots: r.many.mediaScreenshot({
      from: r.media.id.through(r.mediaToScreenshot.A),
      to: r.mediaScreenshot.id.through(r.mediaToScreenshot.B)
    }),
    artworks: r.many.mediaArtwork({
      from: r.media.id.through(r.mediaToArtwork.A),
      to: r.mediaArtwork.id.through(r.mediaToArtwork.B)
    }),
    translation: r.many.mediaTranslation({
      from: r.media.id.through(r.mediaToTranslation.A),
      to: r.mediaTranslation.id.through(r.mediaToTranslation.B)
    }),
    episodes: r.many.mediaEpisode({
      from: r.media.id,
      to: r.mediaEpisode.media_id
    }),
    embedding: r.one.mediaEmbedding({
      from: r.media.id,
      to: r.mediaEmbedding.media_id
    })
  },

  mediaEmbedding: {
    media: r.one.media({
      from: r.mediaEmbedding.media_id,
      to: r.media.id
    })
  },

  mediaTitle: {
    media: r.one.media({
      from: r.mediaTitle.media_id,
      to: r.media.id
    })
  },

  mediaPoster: {
    media: r.one.media({
      from: r.mediaPoster.media_id,
      to: r.media.id
    })
  },

  mediaStartDate: {
    media: r.one.media({
      from: r.mediaStartDate.media_id,
      to: r.media.id
    })
  },

  mediaEndDate: {
    media: r.one.media({
      from: r.mediaEndDate.media_id,
      to: r.media.id
    })
  },

  mediaBroadcast: {
    media: r.one.media({
      from: r.mediaBroadcast.media_id,
      to: r.media.id
    })
  },

  mediaAgeRating: {
    media: r.one.media({
      from: r.mediaAgeRating.media_id,
      to: r.media.id
    })
  },

  mediaGenre: {
    media: r.many.media({
      from: r.mediaGenre.id.through(r.mediaToGenre.B),
      to: r.media.id.through(r.mediaToGenre.A)
    })
  },

  mediaToGenre: {
    media: r.one.media({
      from: r.mediaToGenre.A,
      to: r.media.id
    }),
    genre: r.one.mediaGenre({
      from: r.mediaToGenre.B,
      to: r.mediaGenre.id
    })
  },

  mediaAiringSchedule: {
    media: r.one.media({
      from: r.mediaAiringSchedule.media_id,
      to: r.media.id
    })
  },

  mediaLatestEpisode: {
    media: r.one.media({
      from: r.mediaLatestAiringEpisode.media_id,
      to: r.media.id
    })
  },

  mediaNextEpisode: {
    media: r.one.media({
      from: r.mediaNextAiringEpisode.media_id,
      to: r.media.id
    })
  },

  mediaLastEpisode: {
    media: r.one.media({
      from: r.mediaLastAiringEpisode.media_id,
      to: r.media.id
    })
  },

  mediaStatistic: {
    media: r.one.media({
      from: r.mediaStatistic.media_id,
      to: r.media.id
    })
  },

  mediaCharacter: {
    date_of_birth: r.one.mediaCharacterBirthDate({
      from: r.mediaCharacter.id,
      to: r.mediaCharacterBirthDate.character_id
    }),
    name: r.one.mediaCharacterName({
      from: r.mediaCharacter.id,
      to: r.mediaCharacterName.character_id
    }),
    image: r.one.mediaCharacterImage({
      from: r.mediaCharacter.id,
      to: r.mediaCharacterImage.character_id
    }),
    connections: r.many.mediaToCharacter({
      from: r.mediaCharacter.id,
      to: r.mediaToCharacter.character_id
    })
  },

  mediaCharacterBirthDate: {
    character: r.one.mediaCharacter({
      from: r.mediaCharacterBirthDate.character_id,
      to: r.mediaCharacter.id
    })
  },

  mediaToCharacter: {
    media: r.one.media({
      from: r.mediaToCharacter.media_id,
      to: r.media.id
    }),
    character: r.one.mediaCharacter({
      from: r.mediaToCharacter.character_id,
      to: r.mediaCharacter.id
    }),
    voice_actors: r.many.mediaVoiceActor({
      from: r.mediaToCharacter.id.through(r.characterToVoiceActor.A),
      to: r.mediaVoiceActor.id.through(r.characterToVoiceActor.B)
    })
  },

  mediaCharacterName: {
    character: r.one.mediaCharacter({
      from: r.mediaCharacterName.character_id,
      to: r.mediaCharacter.id
    })
  },

  mediaCharacterImage: {
    character: r.one.mediaCharacter({
      from: r.mediaCharacterImage.character_id,
      to: r.mediaCharacter.id
    })
  },

  mediaVoiceActor: {
    date_of_birth: r.one.mediaVoiceBirthDate({
      from: r.mediaVoiceActor.id,
      to: r.mediaVoiceBirthDate.voice_actor_id
    }),
    date_of_death: r.one.mediaVoiceDeathDate({
      from: r.mediaVoiceActor.id,
      to: r.mediaVoiceDeathDate.voice_actor_id
    }),
    name: r.one.mediaVoiceName({
      from: r.mediaVoiceActor.id,
      to: r.mediaVoiceName.voice_actor_id
    }),
    image: r.one.mediaVoiceImage({
      from: r.mediaVoiceActor.id,
      to: r.mediaVoiceImage.voice_actor_id
    }),
    connections: r.many.mediaToCharacter({
      from: r.mediaVoiceActor.id.through(r.characterToVoiceActor.B),
      to: r.mediaToCharacter.id.through(r.characterToVoiceActor.A)
    })
  },

  mediaVoiceBirthDate: {
    voice_actor: r.one.mediaVoiceActor({
      from: r.mediaVoiceBirthDate.voice_actor_id,
      to: r.mediaVoiceActor.id
    })
  },

  mediaVoiceDeathDate: {
    voice_actor: r.one.mediaVoiceActor({
      from: r.mediaVoiceDeathDate.voice_actor_id,
      to: r.mediaVoiceActor.id
    })
  },

  characterToVoiceActor: {
    connection: r.one.mediaToCharacter({
      from: r.characterToVoiceActor.A,
      to: r.mediaToCharacter.id
    }),
    voice_actor: r.one.mediaVoiceActor({
      from: r.characterToVoiceActor.B,
      to: r.mediaVoiceActor.id
    })
  },

  mediaVoiceName: {
    voice_actor: r.one.mediaVoiceActor({
      from: r.mediaVoiceName.voice_actor_id,
      to: r.mediaVoiceActor.id
    })
  },

  mediaVoiceImage: {
    voice_actor: r.one.mediaVoiceActor({
      from: r.mediaVoiceImage.voice_actor_id,
      to: r.mediaVoiceActor.id
    })
  },

  mediaStudio: {
    connections: r.many.mediaToStudio({
      from: r.mediaStudio.id,
      to: r.mediaToStudio.studio_id
    })
  },

  mediaToStudio: {
    media: r.one.media({
      from: r.mediaToStudio.media_id,
      to: r.media.id
    }),
    studio: r.one.mediaStudio({
      from: r.mediaToStudio.studio_id,
      to: r.mediaStudio.id
    })
  },

  mediaTag: {
    connections: r.many.mediaToTag({
      from: r.mediaTag.id,
      to: r.mediaToTag.tag_id
    })
  },

  mediaToTag: {
    media: r.one.media({
      from: r.mediaToTag.media_id,
      to: r.media.id
    }),
    tag: r.one.mediaTag({
      from: r.mediaToTag.tag_id,
      to: r.mediaTag.id
    })
  },

  mediaScoreDistribution: {
    media: r.one.media({
      from: r.mediaScoreDistribution.media_id,
      to: r.media.id
    })
  },

  mediaStatusDistribution: {
    media: r.one.media({
      from: r.mediaStatusDistribution.media_id,
      to: r.media.id
    })
  },

  mediaLocalScoreDistribution: {
    media: r.one.media({
      from: r.mediaLocalScoreDistribution.media_id,
      to: r.media.id
    })
  },

  mediaLocalStatusDistribution: {
    media: r.one.media({
      from: r.mediaLocalStatusDistribution.media_id,
      to: r.media.id
    })
  },

  mediaLink: {
    media: r.one.media({
      from: r.mediaLink.id.through(r.mediaToLink.B),
      to: r.media.id.through(r.mediaToLink.A)
    })
  },

  mediaToLink: {
    media: r.one.media({
      from: r.mediaToLink.A,
      to: r.media.id
    }),
    link: r.one.mediaLink({
      from: r.mediaToLink.B,
      to: r.mediaLink.id
    })
  },

  mediaChronology: {
    media: r.one.media({
      from: r.mediaChronology.media_id,
      to: r.media.id
    }),
    chronology: r.one.media({
      from: r.mediaChronology.related_id,
      to: r.media.id
    })
  },

  mediaRecommendation: {
    media: r.one.media({
      from: r.mediaRecommendation.media_id,
      to: r.media.id
    }),
    recommendation: r.one.media({
      from: r.mediaRecommendation.related_id,
      to: r.media.id
    })
  },

  mediaRelation: {
    media: r.one.media({
      from: r.mediaRelation.media_id,
      to: r.media.id
    }),
    related: r.one.media({
      from: r.mediaRelation.related_id,
      to: r.media.id
    })
  },

  mediaAltTitle: {
    media: r.many.media({
      from: r.mediaAltTitle.id.through(r.mediaToAltTitle.B),
      to: r.media.id.through(r.mediaToAltTitle.A)
    })
  },

  mediaToAltTitle: {
    media: r.one.media({
      from: r.mediaToAltTitle.A,
      to: r.media.id
    }),
    alt_title: r.one.mediaAltTitle({
      from: r.mediaToAltTitle.B,
      to: r.mediaAltTitle.id
    })
  },

  mediaAltDescription: {
    media: r.many.media({
      from: r.mediaAltDescription.id.through(r.mediaToAltDescription.B),
      to: r.media.id.through(r.mediaToAltDescription.A)
    })
  },

  mediaToAltDescription: {
    media: r.one.media({
      from: r.mediaToAltDescription.A,
      to: r.media.id
    }),
    alt_description: r.one.mediaAltDescription({
      from: r.mediaToAltDescription.B,
      to: r.mediaAltDescription.id
    })
  },

  mediaImage: {
    media: r.many.media({
      from: r.mediaImage.id.through(r.mediaToImage.B),
      to: r.media.id.through(r.mediaToImage.A)
    })
  },

  mediaToImage: {
    media: r.one.media({
      from: r.mediaToImage.A,
      to: r.media.id
    }),
    image: r.one.mediaImage({
      from: r.mediaToImage.B,
      to: r.mediaImage.id
    })
  },

  mediaVideo: {
    media: r.many.media({
      from: r.mediaVideo.id.through(r.mediaToVideo.B),
      to: r.media.id.through(r.mediaToVideo.A)
    })
  },

  mediaToVideo: {
    media: r.one.media({
      from: r.mediaToVideo.A,
      to: r.media.id
    }),
    video: r.one.mediaVideo({
      from: r.mediaToVideo.B,
      to: r.mediaVideo.id
    })
  },

  mediaScreenshot: {
    media: r.many.media({
      from: r.mediaScreenshot.id.through(r.mediaToScreenshot.B),
      to: r.media.id.through(r.mediaToScreenshot.A)
    })
  },

  mediaToScreenshot: {
    media: r.one.media({
      from: r.mediaToScreenshot.A,
      to: r.media.id
    }),
    screenshot: r.one.mediaScreenshot({
      from: r.mediaToScreenshot.B,
      to: r.mediaScreenshot.id
    })
  },

  mediaArtwork: {
    media: r.many.media({
      from: r.mediaArtwork.id.through(r.mediaToArtwork.B),
      to: r.media.id.through(r.mediaToArtwork.A)
    })
  },

  mediaToArtwork: {
    media: r.one.media({
      from: r.mediaToArtwork.A,
      to: r.media.id
    }),
    artwork: r.one.mediaArtwork({
      from: r.mediaToArtwork.B,
      to: r.mediaArtwork.id
    })
  },

  mediaTranslation: {
    media: r.many.media({
      from: r.mediaTranslation.id.through(r.mediaToTranslation.B),
      to: r.media.id.through(r.mediaToTranslation.A)
    })
  },

  mediaToTranslation: {
    media: r.one.media({
      from: r.mediaToTranslation.A,
      to: r.media.id
    }),
    translation: r.one.mediaTranslation({
      from: r.mediaToTranslation.B,
      to: r.mediaTranslation.id
    })
  },

  mediaEpisode: {
    media: r.one.media({
      from: r.mediaEpisode.media_id,
      to: r.media.id
    }),
    image: r.one.mediaEpisodeImage({
      from: r.mediaEpisode.id,
      to: r.mediaEpisodeImage.episode_id
    })
  },

  mediaEpisodeImage: {
    episode: r.one.mediaEpisode({
      from: r.mediaEpisodeImage.episode_id,
      to: r.mediaEpisode.id
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
