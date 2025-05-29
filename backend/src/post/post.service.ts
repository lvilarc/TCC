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
            },
        });

        const photosWithUrls = await Promise.all(
            post.photos.map(async (photo) => ({
                ...photo,
                url: await this.s3Service.generatePresignedUrl(photo.key),
            }))
        );

        return {
            ...post,
            photos: photosWithUrls,
        };
    }

    async createComment(postId: number, content: string, user: UserSchema) {
        return this.prisma.comment.create({
            data: {
                content,
                postId,
                authorId: user.id,
            },
            include: {
                author: true,
            },
        });
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
            },
        });

        const postsWithUrls = await Promise.all(posts.map(async (post) => {
            const authorAvatarKey = post.author.photos[0]?.key;
            const authorAvatarUrl = authorAvatarKey
                ? await this.s3Service.generatePresignedUrl(authorAvatarKey)
                : null;

            const photosWithUrls = await Promise.all(
                post.photos.map(async (photo) => ({
                    ...photo,
                    url: await this.s3Service.generatePresignedUrl(photo.key),
                }))
            );

            const commentsWithAvatars = await Promise.all(post.comments.map(async (comment) => {
                const commentAvatarKey = comment.author.photos[0]?.key;
                const commentAvatarUrl = commentAvatarKey
                    ? await this.s3Service.generatePresignedUrl(commentAvatarKey)
                    : null;

                return {
                    ...comment,
                    author: {
                        id: comment.author.id,
                        name: comment.author.name,
                        avatarUrl: commentAvatarUrl,
                    },
                };
            }));

            return {
                ...post,
                author: {
                    id: post.author.id,
                    name: post.author.name,
                    avatarUrl: authorAvatarUrl,
                },
                photos: photosWithUrls,
                comments: commentsWithAvatars,
            };
        }));

        return postsWithUrls;
    }

    async findAllByAuthor(authorId: number) {
        const posts = await this.prisma.post.findMany({
            where: {
                authorId,
            },
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
            },
        });

        const postsWithExtras = await Promise.all(posts.map(async (post) => {
            const authorAvatarKey = post.author.photos[0]?.key;
            const authorAvatarUrl = authorAvatarKey
                ? await this.s3Service.generatePresignedUrl(authorAvatarKey)
                : null;

            const photosWithUrls = await Promise.all(
                post.photos.map(async (photo) => ({
                    ...photo,
                    url: await this.s3Service.generatePresignedUrl(photo.key),
                }))
            );

            const commentsWithAvatars = await Promise.all(
                post.comments.map(async (comment) => {
                    const commentAvatarKey = comment.author.photos[0]?.key;
                    const commentAvatarUrl = commentAvatarKey
                        ? await this.s3Service.generatePresignedUrl(commentAvatarKey)
                        : null;

                    return {
                        ...comment,
                        author: {
                            id: comment.author.id,
                            name: comment.author.name,
                            avatarUrl: commentAvatarUrl,
                        },
                    };
                })
            );

            return {
                ...post,
                author: {
                    id: post.author.id,
                    name: post.author.name,
                    avatarUrl: authorAvatarUrl,
                },
                photos: photosWithUrls,
                comments: commentsWithAvatars,
            };
        }));

        return postsWithExtras;
    }


}
