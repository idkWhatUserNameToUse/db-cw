# Реалізація інформаційного та програмного забезпечення

В рамках проєкту розробляється:
## SQL-скрипт для створення на початкового наповнення бази даних

```sql

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('COMPLETED', 'IN_PROGRESS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "member)id" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grants" (
    "id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "grants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "price" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partipicants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,

    CONSTRAINT "partipicants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_member)id_key" ON "roles"("member)id");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_member)id_fkey" FOREIGN KEY ("member)id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grants" ADD CONSTRAINT "grants_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partipicants" ADD CONSTRAINT "partipicants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partipicants" ADD CONSTRAINT "partipicants_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

```

## RESTfull система управління проектами

### Схема бази даних (ORM Prisma)

```
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}


model User {
  id         String      @id @default(uuid())
  username   String      @unique
  email      String      @unique
  password   String
  fullNmae   String      @map("full_name")
  members    Member[]

  @@map("users")
}

enum Status {
  COMPLETED
  IN_PROGRESS
}

model Project {
  id          String   @id @default(uuid())
  name        String
  description String
  status      Status
  members     Member[]
  tasks       Task[]

  @@map("projects")
}

model Member {
  id           String        @id @default(uuid())
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId       String        @map("user_id")
  project      Project       @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId    String        @map("project_id")
  role         Role?
  participants Partipicant[]

  @@map("members")
}

model Role {
  id       String  @id @default(uuid())
  name     String
  member   Member? @relation(fields: [memberId], references: [id], onDelete: Cascade)
  memberId String? @unique @map("member)id")
  grants   Grant[]

  @@map("roles")
}

model Grant {
  id          String       @id @default(uuid())
  roleId      String       @map("role_id")
  role        Role         @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permissions Permission[]

  @@map("grants")
}

model Permission {
  id         String @id @default(uuid())
  permission String
  grantId    String
  grant      Grant  @relation(fields: [grantId], references: [id], onDelete: Cascade)

  @@map("permissions")
}

model Task {
  id           String        @id @default(uuid())
  name         String
  description  String
  status       Status
  price        String
  deadline     DateTime
  project      Project       @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId    String        @map("project_id")
  participants Partipicant[]

  @@map("tasks")
}

model Partipicant {
  id       String @id @default(uuid())
  name     String
  member   Member @relation(fields: [memberId], references: [id], onDelete: Cascade)
  memberId String @map("user_id")
  task     Task   @relation(fields: [taskId], references: [id], onDelete: Cascade)
  taskId   String @map("task_id")

  @@map("partipicants")
}
```

### Модуль та сервіс підключення до бази даних

```ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

### Модуль та контролер для отримання запитів

```ts
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

```

```ts
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
```

### Сервіс для обробки запитів

```ts
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
```

### DTO для створення ролі

```ts
import {IsNotEmpty, IsString} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
```

### DTO для оновлення ролі

```ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name: string;
}
```

### Pipes для валідації даних і обробки помилок клієнта

```ts
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
```

### Головний модуль програми

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
```
