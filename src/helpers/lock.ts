type LockType = 'indexer' | 'update' | 'embeddings';

class Lock {
  private locks: Set<string> = new Set();

  acquire(name: LockType): boolean {
    if (this.locks.has(name)) return false;
    this.locks.add(name);
    return true;
  }

  release(name: LockType): void {
    this.locks.delete(name);
  }

  isLocked(name: LockType): boolean {
    return this.locks.has(name);
  }
}

export default new Lock();
