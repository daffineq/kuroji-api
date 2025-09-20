import { Hono } from 'hono';
import anime from './anime';
import { parseNumber } from 'src/helpers/parsers';
import { createErrorResponse, createSuccessResponse } from 'src/helpers/response';
import { Prisma } from '@prisma/client';
import mappings from './mappings/mappings';

const animeRoute = new Hono();

animeRoute.post('/initOrGet/:id', async (c) => {
  const { id } = c.req.param();

  const json = await c.req.json();

  return c.json(
    createSuccessResponse(await anime.initOrGet(parseNumber(id)!, json as Prisma.AnimeDefaultArgs), 'Fetched info')
  );
});

animeRoute.post('/findMany', async (c) => {
  const json = await c.req.json();

  return c.json(createSuccessResponse(await anime.findMany(json as Prisma.AnimeFindManyArgs), 'Fetched data'));
});

animeRoute.post('/findFirst', async (c) => {
  const json = await c.req.json();

  return c.json(createSuccessResponse(await anime.findFirst(json as Prisma.AnimeFindFirstArgs), 'Fetched data'));
});

animeRoute.post('/mappings/initOrGet/:id', async (c) => {
  const { id } = c.req.param();

  const json = await c.req.json();

  return c.json(
    createSuccessResponse(
      await mappings.initOrGet(parseNumber(id)!, json as Prisma.MappingsDefaultArgs),
      'Fetched mappings'
    )
  );
});

animeRoute.post('/mappings/findMany', async (c) => {
  const json = await c.req.json();

  return c.json(
    createSuccessResponse(await mappings.findMany(json as Prisma.MappingsFindManyArgs), 'Fetched data')
  );
});

animeRoute.post('/mappings/findFirst', async (c) => {
  const json = await c.req.json();

  return c.json(
    createSuccessResponse(await mappings.findFirst(json as Prisma.MappingsFindFirstArgs), 'Fetched data')
  );
});

export default animeRoute;
