import { HttpModule } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { UrlConfig } from '../../../../configs/url.config';
import { CustomHttpService } from '../../../../http/http.service';
import AnilistQL from './AnilistQL';
import AnilistQueryBuilder from './query/AnilistQueryBuilder';

describe('AnilistQL', () => {
  let httpService: CustomHttpService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [CustomHttpService],
    }).compile();

    httpService = moduleRef.get<CustomHttpService>(CustomHttpService);
  });

  it('should include required fields in query', async () => {
    const queryBuilder = new AnilistQueryBuilder();
    queryBuilder.setId(21).setPage(1).setPerPage(1);

    const query = AnilistQL.getQuery();

    // Make the actual API call
    const result = await httpService.getGraphQL(
      UrlConfig.ANILIST_GRAPHQL,
      query,
      queryBuilder.build(),
    );

    expect(result).toBeDefined();
  });
});
