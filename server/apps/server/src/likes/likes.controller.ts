import { Controller, Post, Body, UsePipes, Get, Query } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../pipe/validation.pipe';
import { Like } from '@app/db/models/like.model';
import { createDto } from './dto/like.dto';

@Controller('likes')
@ApiTags('点赞')
export class LikesController {}
