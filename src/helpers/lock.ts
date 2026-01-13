class Lock {
  private locks: Set<string> = new Set();

  acquire(name: 'indexer' | 'update'): boolean {
    if (this.locks.has(name)) return false;
    this.locks.add(name);
    return true;
  }

  release(name: 'indexer' | 'update'): void {
    this.locks.delete(name);
  }

  isLocked(name: 'indexer' | 'update'): boolean {
    return this.locks.has(name);
  }
}

export default new Lock();
