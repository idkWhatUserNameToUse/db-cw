import { Injectable } from '@nestjs/common';
import { PrismaService } from './PrismaService';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoleRepository {
  constructor (
    private readonly prismaService: PrismaService,
  ) {}

  create (data: Prisma.RoleUncheckedCreateInput) {
    return this.prismaService.role.create({ data });
  }

  findMany (where: Prisma.RoleWhereInput) {
    return this.prismaService.role.findMany({ where });
  }

  findById (id: string) {
    return this.prismaService.role.findUnique({ where: { id} });
  }

  updateById (id: string, data: Prisma.RoleUncheckedUpdateInput) {
    return this.prismaService.role.update({
      where: { id },
      data,
    })
  }

  deleteById (id: string) {
    return this.prismaService.role.delete({ where: { id } });
  }
}