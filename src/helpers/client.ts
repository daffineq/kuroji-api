import { KurojiClient, ProxyConfig } from 'src/lib/http';

export class Client {
  protected client: KurojiClient;
  protected proxyConfig?: ProxyConfig;
  protected baseUrl?: string;

  constructor(baseUrl?: string, proxyConfig?: ProxyConfig) {
    this.baseUrl = baseUrl;
    this.proxyConfig = proxyConfig;
    this.client = new KurojiClient(baseUrl, proxyConfig);
  }
}
