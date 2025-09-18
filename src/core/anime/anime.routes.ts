import { Hono } from 'hono';
import anime from './anime';
import { parseNumber } from 'src/helpers/parsers';
import { createErrorResponse, createSuccessResponse } from 'src/helpers/response';
import { Prisma } from '@prisma/client';
import mappings from './mappings/mappings';

const animeRoute = new Hono();

animeRoute.post('/info/:id', async (c) => {
  try {
    const { id } = c.req.param();

    const json = await c.req.json();

    return c.json(
      createSuccessResponse(await anime.getInfo(parseNumber(id)!, json as Prisma.AnimeSelect), 'Fetched info')
    );
  } catch (error) {
    if (error instanceof Error) {
      return c.json(createErrorResponse(400, error.message, error.stack), 400);
    }

    return c.json(createErrorResponse(400, 'Unknown error'), 400);
  }
});

animeRoute.post('/findMany', async (c) => {
  const json = await c.req.json();

  return c.json(createSuccessResponse(await anime.findMany(json as Prisma.AnimeFindManyArgs), 'Fetched data'));
});

animeRoute.post('/findFirst', async (c) => {
  const json = await c.req.json();

  return c.json(createSuccessResponse(await anime.findFirst(json as Prisma.AnimeFindFirstArgs), 'Fetched data'));
});

animeRoute.post('/mappings/info/:id', async (c) => {
  const { id } = c.req.param();

  const json = await c.req.json();

  return c.json(
    createSuccessResponse(
      await mappings.getMappings(parseNumber(id)!, json as Prisma.MappingsSelect),
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
