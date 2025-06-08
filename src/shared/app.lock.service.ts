import { Injectable } from '@nestjs/common';

@Injectable()
export class AppLockService {
  private locks: Set<string> = new Set();

  acquire(name: string): boolean {
    if (this.locks.has(name)) return false;
    this.locks.add(name);
    return true;
  }

  release(name: string): void {
    this.locks.delete(name);
  }

  isLocked(name: string): boolean {
    return this.locks.has(name);
  }
}
