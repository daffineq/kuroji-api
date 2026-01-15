type Entry = {
  value: number | string;
  expiresAt?: number;
};

class LocalStore {
  private store = new Map<string, Entry>();

  private isExpired(key: string) {
    const entry = this.store.get(key);
    if (!entry) return true;

    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return true;
    }

    return false;
  }

  async set(key: string, value: string | number, ttlSeconds?: number) {
    const entry: Entry = { value };
    if (ttlSeconds) {
      entry.expiresAt = Date.now() + ttlSeconds * 1000;
    }
    this.store.set(key, entry);
    return 'OK';
  }

  async get(key: string) {
    if (this.isExpired(key)) return null;
    return this.store.get(key)!.value.toString();
  }

  async del(key: string) {
    this.store.delete(key);
    return 1;
  }

  async incr(key: string) {
    if (this.isExpired(key)) {
      this.store.set(key, { value: 1 });
      return 1;
    }

    const entry = this.store.get(key)!;
    if (typeof entry.value !== 'number') {
      entry.value = Number(entry.value) || 0;
    }
    entry.value = Number(entry.value) + 1;
    return entry.value;
  }

  async expire(key: string, ttlSeconds: number) {
    const entry = this.store.get(key);
    if (!entry || this.isExpired(key)) return 0;
    entry.expiresAt = Date.now() + ttlSeconds * 1000;
    return 1;
  }

  async ttl(key: string) {
    const entry = this.store.get(key);
    if (!entry || this.isExpired(key)) return -2;
    if (!entry.expiresAt) return -1;
    return Math.max(0, Math.floor((entry.expiresAt - Date.now()) / 1000));
  }
}

export const localStore = new LocalStore();
