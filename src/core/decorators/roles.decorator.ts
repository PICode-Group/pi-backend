// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { TipoUsuario } from 'src/domain/entities';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: TipoUsuario[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
