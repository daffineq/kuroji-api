import { Hono } from 'hono';
import anime from './anime';
import { parseDto, parseJson, parseNumber } from 'src/helpers/parsers';
import { createMetaResponse, createSuccessResponse } from 'src/helpers/response';
import { Prisma } from '@prisma/client';
import mappings from './mappings/mappings';
import animeIndexer from './helpers/anime.indexer';
import animeFilter from './helpers/anime.filter';
import { FilterDto } from './helpers/anime.filter.dto';
import animeUpdate from './helpers/anime.update';
import logger from 'src/helpers/logger';

const animeRoute = new Hono().basePath('/anime');

animeRoute.post('/initOrGet/:id', async (c) => {
  const { id } = c.req.param();

  const json = await parseJson(c.req);

  return c.json(
    createSuccessResponse({
      data: await anime.initOrGet(parseNumber(id)!, json as Prisma.AnimeDefaultArgs),
      message: 'Fetched info'
    })
  );
});

animeRoute.post('/many', async (c) => {
  const json = await parseJson(c.req);

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
  const json = await parseJson(c.req);

  return c.json(
    createSuccessResponse({
      data: await anime.first(json as Prisma.AnimeFindFirstArgs),
      message: 'Fetched data'
    })
  );
});

animeRoute.post('/filter', async (c) => {
  const query = await parseDto(FilterDto, c.req.query());
  const json = await parseJson(c.req);

  const data = await animeFilter.filter(query, json as Prisma.AnimeDefaultArgs);

  return c.json(
    createMetaResponse({
      data: data.data,
      meta: data.meta,
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

animeRoute.put('/update/process', async (c) => {
  animeUpdate.processQueue().catch((error) => {
    logger.error('Error processing update queue:', error);
  });

  return c.json(
    createSuccessResponse({
      message: 'Processing update queue'
    })
  );
});

animeRoute.post('/mappings/initOrGet/:id', async (c) => {
  const { id } = c.req.param();

  const json = await parseJson(c.req);

  return c.json(
    createSuccessResponse({
      data: await mappings.initOrGet(parseNumber(id)!, json as Prisma.MappingsDefaultArgs),
      message: 'Fetched mappings'
    })
  );
});

animeRoute.post('/mappings/many', async (c) => {
  const json = await parseJson(c.req);

  return c.json(
    createSuccessResponse({
      data: await mappings.many(json as Prisma.MappingsFindManyArgs),
      message: 'Fetched mappings'
    })
  );
});

animeRoute.post('/mappings/first', async (c) => {
  const json = await parseJson(c.req);

  return c.json(
    createSuccessResponse({
      data: await mappings.first(json as Prisma.MappingsFindFirstArgs),
      message: 'Fetched mappings'
    })
  );
});

export default animeRoute;
