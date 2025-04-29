import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Importando o PrismaService
import { S3Service } from 'src/s3/s3.service';
import { User } from '@prisma/client';
import { Photo, PhotoType } from '.prisma/client';

@Injectable()
export class PhotosService {
  constructor(
    private readonly s3Service: S3Service, // Injetando o S3Service
    private readonly prisma: PrismaService, // Injetando o PrismaService
  ) {}

  // Função para fazer o upload de uma foto
  async createAndUploadPhoto(
    file: Express.Multer.File,
    user: User,
    type: PhotoType,
  ): Promise<Photo> {
    // Fazendo o upload para o S3 e recebendo o resultado
    const key = await this.s3Service.uploadFile(file);

    // Salvando a key e URL da foto no banco de dados usando Prisma
    const photo = await this.prisma.photo.create({
      data: {
        key: key, // Armazena a key do arquivo
        url: '', // Armazena a URL gerada pelo S3
        type: type, // Tipo do arquivo (jpg, png, etc.)
        user: {
          connect: { id: user.id }, // Conecta a foto ao usuário utilizando o userId
        },
        // Aqui você pode adicionar outras informações, se necessário
      },
    });

    return photo;
  }

  // Função para obter as fotos do banco
  async getPhotos(): Promise<any> {
    return await this.prisma.photo.findMany();
  }

  async getUserPhotos(userId: string): Promise<Photo[]> {
    try {
      const photos = await this.prisma.photo.findMany({
        where: { userId: Number(userId) },
      });
      return Promise.all(
        photos.map(async (photo) => {
          let photoUrl: string = '';
          if (photo.key) {
            photoUrl = await this.s3Service.generatePresignedUrl(photo.key);
          }

          return {
            ...photo,
            url: photoUrl, // URL da foto gerada pelo S3
          };
        }),
      );

      // photos || []; // Retorna um array vazio se não houver fotos
    } catch (error) {
      throw new Error('Erro ao buscar fotos');
    }
  }

  // Função para excluir uma foto
  async deletePhoto(photoId: number): Promise<void> {
    // Encontrando a foto no banco de dados
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new Error('Foto não encontrada');
    }

    // Excluindo o arquivo do S3
    await this.s3Service.deleteFile(photo.key);

    // Excluindo a foto do banco de dados
    await this.prisma.photo.delete({
      where: { id: photoId },
    });
  }
}
