import { Injectable } from '@nestjs/common';
import { RoleRepository } from './RoleRepository';
import { CreateRoleDto } from './CreateRoleDto';
import { UpdateRoleDto } from './UpdateRoleDto';

@Injectable()
export class RoleService {
  constructor (
    private readonly roleRepository: RoleRepository,
  ) {}

  create (body: CreateRoleDto) {
    return this.roleRepository.create(body);
  }

  getAll () {
    return this.roleRepository.findMany({});
  }

  getById (roleId: string) {
    return this.roleRepository.findById(roleId);
  }

  update (roleId: string, body: UpdateRoleDto) {
    return this.roleRepository.updateById(roleId, body);
  }

  delete (roleId: string) {
    return this.roleRepository.deleteById(roleId);
  }
}