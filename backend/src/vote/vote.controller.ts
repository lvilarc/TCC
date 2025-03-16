import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UnauthorizedException, BadRequestException, Query } from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { User as UserSchema } from '@prisma/client';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) { }

  @UseGuards(JwtAuthGuard)
  @Get('start')
  async create(
    @Query('tournamentId') tournamentId: number,
    @User() user: UserSchema | null
  ) {
    if (!user) {
      throw new UnauthorizedException('Sem autorização.');
    }
  
    if (!tournamentId) {
      throw new BadRequestException('tournamentId é obrigatório.');
    }
  
    return this.voteService.startVoting(user.id, Number(tournamentId));
  }

  // @Get()
  // findAll() {
  //   return this.voteService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.voteService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVoteDto: UpdateVoteDto) {
  //   return this.voteService.update(+id, updateVoteDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.voteService.remove(+id);
  // }
}
