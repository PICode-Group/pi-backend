import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvService {
  private readonly defaults: Record<string, any> = {
    DB_PORT: process.env.DB_PORT,
    DB_RETRY_ATTEMPTS: process.env.DB_RETRY_ATTEMPTS,
    DB_RETRY_DELAY: process.env.DB_RETRY_DELAY,
    DB_CONNECTION_LIMIT: process.env.DB_CONNECTION_LIMIT,
    DB_CONNECT_TIMEOUT: process.env.DB_CONNECT_TIMEOUT,
    DB_SYNCHRONIZE: process.env.DB_SYNCHRONIZE,
    NODE_ENV: process.env.NODE_ENV,
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
