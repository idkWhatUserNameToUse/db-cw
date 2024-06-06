import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './RoleRepository';

@Injectable()
export class RoleByIdPipe implements PipeTransform {
  constructor (
    private readonly roleRepository: RoleRepository,
  ) {}

  async transform(roleId: string) {
    const role = await this.roleRepository.findById(roleId);

    if (!role) throw new NotFoundException('Role with such id is not found');
    return roleId;
  }
}