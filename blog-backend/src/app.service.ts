import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }
  getHello(): string {
    return 'Hello World!';
  }

  async getCache(key: string) {
    return this.cacheManager.get(key);
  }

  async setCache(key: string, value: any, ttl?: number) {
    await this.cacheManager.set(key, value, ttl);
  }

  async deleteCache(key: string) {
    await this.cacheManager.del(key);
  }
}
