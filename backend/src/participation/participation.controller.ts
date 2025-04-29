import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { UpdateParticipationDto } from './dto/update-participation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { PhotosService } from 'src/photo/photos.service';
import { PhotoType, User as UserSchema } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('participation')
export class ParticipationController {
  constructor(
    private readonly participationService: ParticipationService,
    private readonly photosService: PhotosService,  // Injetando o serviço de foto
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('File')) // 'File' é o nome do campo que conterá o arquivo
  async create(
    @Body() createParticipationDto: CreateParticipationDto,
    @UploadedFile() file: Express.Multer.File,  // Recebe o arquivo enviado
    @User() user: UserSchema
  ) {
    createParticipationDto.tournamentId = parseInt(createParticipationDto.tournamentId as unknown as string, 10);
    // Envia o arquivo para o serviço de foto
    const photo = await this.photosService.createAndUploadPhoto(file, user, PhotoType.TOURNAMENT_PARTICIPATION);
    
    // Cria a participação, passando o ID da foto
    return this.participationService.create(createParticipationDto, user, photo.id);
  }

  @Get()
  findAll() {
    return this.participationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParticipationDto: UpdateParticipationDto) {
    return this.participationService.update(+id, updateParticipationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participationService.remove(+id);
  }
}
