import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Req, Query, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { PhotoType, User as UserSchema } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoService } from 'src/photo/photo.service';
import { TournamentFilter } from './enums/tournament-filter.enum';

@Controller('tournaments')
export class TournamentsController {
  constructor(
    private readonly tournamentsService: TournamentsService,
    private readonly photoService: PhotoService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('File'))
  async create(
    @Body() createTournamentDto: CreateTournamentDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: UserSchema | null) {
    if (user) {
      const photo = await this.photoService.createAndUploadPhoto(file, user, PhotoType.TOURNAMENT_BANNER);
      return this.tournamentsService.create(createTournamentDto, user, photo.id);
    } else {
      throw new UnauthorizedException('Sem autorização.');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('filter') filter: TournamentFilter,
    @Req() req,
    @User() user: UserSchema | null
  ) {
    const userId = user !== null ? user.id : undefined;
    return this.tournamentsService.findAll(filter, userId);
  }

  @Get(':id')
  public async findTournamentById(@Param('id') id: string) {
    return this.tournamentsService.findTournamentById(id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get(':id/voting')
  // async getVotingImages(
  //   @Param('id') tournamentId: string,
  //   @Query('mode') mode: string,
  //   @User() user: UserSchema
  // ) {
  //   // Verifica se o torneio existe
  //   const tournament = await this.tournamentsService.findTournamentById(tournamentId);
  //   if (!tournament) {
  //     throw new BadRequestException('Torneio não encontrado');
  //   }

  //   // Verifica se o usuário já votou nesse torneio
  //   const userHasVoted = await this.tournamentsService.checkIfUserVoted(tournamentId, user.id);
  //   if (userHasVoted) {
  //     throw new BadRequestException('Você já participou da votação deste torneio');
  //   }

  //   // Busca todas as fotos do torneio
  //   const photos = await this.tournamentsService.getTournamentPhotos(tournamentId);
  //   if (!photos.length) {
  //     throw new BadRequestException('Nenhuma foto disponível para votação');
  //   }

  //   // Seleciona as imagens com base no modo
  //   let selectedPhotos = [];
  //   const totalPhotos = photos.length;

  //   switch (Number(mode)) {
  //     case 1:
  //       selectedPhotos = this.getRandomPhotos(photos, Math.min(10, totalPhotos));
  //       break;
  //     case 2:
  //       selectedPhotos = this.getRandomPhotos(photos, 2);
  //       break;
  //     case 3:
  //       selectedPhotos = [this.getRandomPhotos(photos, 1)[0]];
  //       break;
  //     case 4:
  //       selectedPhotos = this.getRandomPhotos(photos, Math.min(40, totalPhotos));
  //       break;
  //     default:
  //       throw new BadRequestException('Modo de votação inválido');
  //   }

  //   return {
  //     tournamentId,
  //     mode,
  //     photos: selectedPhotos,
  //   };
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ) {
    return this.tournamentsService.update(+id, updateTournamentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentsService.remove(+id);
  }
}
