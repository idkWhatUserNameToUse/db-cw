import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RoleService } from './RoleService';
import { CreateRoleDto } from './CreateRoleDto';
import { UpdateRoleDto } from './UpdateRoleDto';
import {RoleByIdPipe} from "./RoleByIdPipe";

@Controller('/roles')
export class RoleController {
  constructor (
    private readonly roleService: RoleService,
  ) {}

  @Post()
  create (
    @Body() body: CreateRoleDto,
  ) {
    return this.roleService.create(body);
  }

  @Get()
  getAll () {
    return this.roleService.getAll();
  }

  @Get('/:roleId')
  getById (
    @Param('roleId', RoleByIdPipe) roleId: string,
  ) {
    return this.roleService.getById(roleId);
  }

  @Patch('/:roleId')
  update (
    @Param('roleId', RoleByIdPipe) roleId: string,
    @Body() body: UpdateRoleDto,
  ) {
    return this.roleService.update(roleId, body);
  }

  @Delete('/:roleId')
  delete (
    @Param('roleId', RoleByIdPipe) roleId: string,
  ) {
    return this.roleService.delete(roleId);
  }
}