import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvService {
  private readonly defaults: Record<string, any> = {
    DB_PORT: 3307,
    DB_RETRY_ATTEMPTS: 3,
    DB_RETRY_DELAY: 3000,
    DB_CONNECTION_LIMIT: 10,
    DB_CONNECT_TIMEOUT: 10000,
    DB_SYNCHRONIZE: false,
    NODE_ENV: 'development',
  };

  get(key: string): any {
    const value = process.env[key] ?? this.defaults[key];
    if (value === undefined) {
      throw new Error(`Environment variable ${key} is not defined`);
    }
    return this.parseValue(value);
  }

  getOptional(key: string, defaultValue?: any): any {
    const value = process.env[key] ?? this.defaults[key] ?? defaultValue;
    if (value === undefined) {
      return defaultValue;
    }
    return this.parseValue(value);
  }

  private parseValue(value: any): any {
    if (typeof value !== 'string') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(Number(value))) return Number(value);
    return value;
  }
}
