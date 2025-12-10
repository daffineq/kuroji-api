import { KurojiClient } from 'src/lib/http';

export abstract class ClientModule {
  protected abstract readonly client: KurojiClient;
}
