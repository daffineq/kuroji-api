import Elysia from 'elysia';

const animeRoute = () => {
  return (app: Elysia) => app.group('/anime', { tags: ['Anime'] }, (app) => app);
};

export { animeRoute };
