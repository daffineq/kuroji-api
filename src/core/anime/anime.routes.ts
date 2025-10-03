import { Hono } from 'hono';
import anime from './anime';
import { parseNumber } from 'src/helpers/parsers';
import { createErrorResponse, createMetaResponse, createSuccessResponse } from 'src/helpers/response';
import { Prisma } from '@prisma/client';
import mappings from './mappings/mappings';
import animeIndexer from './helpers/anime.indexer';

const animeRoute = new Hono();

animeRoute.post('/initOrGet/:id', async (c) => {
  const { id } = c.req.param();

  const json = await c.req.json();

  return c.json(
    createSuccessResponse({
      data: await anime.initOrGet(parseNumber(id)!, json as Prisma.AnimeDefaultArgs),
      message: 'Fetched info'
    })
  );
});

animeRoute.post('/many', async (c) => {
  const json = await c.req.json();

  const data = await anime.many(json as Prisma.AnimeFindManyArgs);

  return c.json(
    createMetaResponse({
      data: data.data,
      meta: data.meta,
      message: 'Fetched data'
    })
  );
});

animeRoute.post('/first', async (c) => {
  const json = await c.req.json();

  return c.json(
    createSuccessResponse({
      data: await anime.first(json as Prisma.AnimeFindFirstArgs),
      message: 'Fetched data'
    })
  );
});

animeRoute.post('/indexer/start', async (c) => {
  const delay = c.req.query('delay');

  const start = await animeIndexer.start(parseNumber(delay));

  return c.json(
    createSuccessResponse({
      message: start
    })
  );
});

animeRoute.post('/indexer/stop', async (c) => {
  animeIndexer.stop();

  return c.json(
    createSuccessResponse({
      message: 'Stopped indexer'
    })
  );
});

animeRoute.post('/mappings/initOrGet/:id', async (c) => {
  const { id } = c.req.param();

  const json = await c.req.json();

  return c.json(
    createSuccessResponse({
      data: await mappings.initOrGet(parseNumber(id)!, json as Prisma.MappingsDefaultArgs),
      message: 'Fetched mappings'
    })
  );
});

animeRoute.post('/mappings/many', async (c) => {
  const json = await c.req.json();

  return c.json(
    createSuccessResponse({
      data: await mappings.many(json as Prisma.MappingsFindManyArgs),
      message: 'Fetched mappings'
    })
  );
});

animeRoute.post('/mappings/first', async (c) => {
  const json = await c.req.json();

  return c.json(
    createSuccessResponse({
      data: await mappings.first(json as Prisma.MappingsFindFirstArgs),
      message: 'Fetched mappings'
    })
  );
});

export default animeRoute;
