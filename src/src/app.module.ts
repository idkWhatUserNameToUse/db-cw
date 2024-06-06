import { Module } from '@nestjs/common';
import { RoleController } from './RoleController';
import { RoleService } from './RoleService';
import { RoleRepository } from './RoleRepository';
import { PrismaService } from './PrismaService';
import { RoleByIdPipe } from './RoleByIdPipe';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleRepository, PrismaService, RoleByIdPipe],
})
export class AppModule {}
