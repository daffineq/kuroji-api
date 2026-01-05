export abstract class Module {
  abstract readonly name: string;
}

export abstract class ProviderModule<T = unknown> extends Module {
  abstract getInfo(id: number, idMal?: number): Promise<T>;
}
