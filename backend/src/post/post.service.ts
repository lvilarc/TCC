import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { User as UserSchema } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly s3Service: S3Service,
    ) { }

    async create(createPostDto: CreatePostDto, user: UserSchema, photoIds: number[] = []) {
        const post = await this.prisma.post.create({
            data: {
                content: createPostDto.content,
                authorId: user.id,
                photos: photoIds.length
                    ? {
                        connect: photoIds.map((id) => ({ id })),
                    }
                    : undefined,
            },
            include: {
                author: true,
                photos: true,
                comments: true,
                likes: true,
            },
        });
    
        // Gerar URL assinada da(s) foto(s) do post
        for (const photo of post.photos) {
            photo.url = await this.s3Service.generatePresignedUrl(photo.key);
        }
    
        return post;
    }
    


    async findAll() {
        const posts = await this.prisma.post.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        photos: {
                            where: {
                                type: 'PROFILE_AVATAR',
                            },
                            select: {
                                key: true,
                            },
                            take: 1,
                        },
                    },
                },
                comments: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                photos: {
                                    where: {
                                        type: 'PROFILE_AVATAR',
                                    },
                                    select: {
                                        key: true,
                                    },
                                    take: 1,
                                },
                            },
                        },
                    },
                },
                photos: true,
                likes: true,
            },
        });

        for (const post of posts) {
            // Avatar do autor do post
            const authorAvatarKey = post.author.photos[0]?.key;
            const authorAvatarUrl = authorAvatarKey
                ? await this.s3Service.generatePresignedUrl(authorAvatarKey)
                : null;

            (post.author as any) = {
                id: post.author.id,
                name: post.author.name,
                avatarUrl: authorAvatarUrl,
            };

            // Avatares dos autores dos comentários
            for (const comment of post.comments) {
                const commentAvatarKey = comment.author.photos[0]?.key;
                const commentAvatarUrl = commentAvatarKey
                    ? await this.s3Service.generatePresignedUrl(commentAvatarKey)
                    : null;

                (comment.author as any) = {
                    id: comment.author.id,
                    name: comment.author.name,
                    avatarUrl: commentAvatarUrl,
                };
            }

            // Fotos anexadas ao post
            for (const photo of post.photos) {
                photo.url = await this.s3Service.generatePresignedUrl(photo.key);
            }
        }

        return posts;
    }
}
