import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { fromEnv } from '@aws-sdk/credential-provider-env';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
    private s3: S3Client;
    private bucketName: string; // Adicionando a variável para o bucket

    constructor() {
        console.log('Carregando o cliente S3...');
        this.s3 = new S3Client({
            region: process.env.AWS_REGION, // Região do S3
            credentials: fromEnv(), // Carrega as credenciais do ambiente
        });

        const bucketName = process.env.AWS_S3_BUCKET;
        console.log('Bucket:', bucketName);
        if (!bucketName) {
            throw new Error('AWS_S3_BUCKET is not defined in environment variables');
        }
        this.bucketName = bucketName;
    }

    // Função de upload de arquivo para o S3
    async uploadFile(file: Express.Multer.File): Promise<string> {
        console.log('Iniciando o upload do arquivo...');
        const uniqueKey = `${uuidv4()}.${file.mimetype.split('/')[1]}`; // Gerando uma chave única para o arquivo
        const params = {
            Bucket: this.bucketName, // Usando o bucket name carregado do .env
            Key: uniqueKey, // Caminho no bucket S3
            Body: file.buffer, // Arquivo que foi enviado
            ContentType: file.mimetype, // Tipo de conteúdo do arquivo
        };

        const command = new PutObjectCommand(params);
        try {
            // Enviando o arquivo para o S3
            await this.s3.send(command);
            console.log('Upload concluído com sucesso.');
            // Retornando o uniqueKey após o upload
            return uniqueKey;
        } catch (error) {
            console.error('Erro no upload:', error);
            throw error; // Re-throw the error to handle it at a higher level if needed
        }
    }

    // Gerar URL presigned
    async generatePresignedUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName, // Usando o bucket name carregado do .env
            Key: key,
        });

        // Gerando URL presigned com tempo de expiração
        return getSignedUrl(this.s3, command, { expiresIn: 300 }); // 300 segundos = 5 minutos
    }

    // Função para excluir um arquivo
    async deleteFile(key: string): Promise<any> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName, // Usando o bucket name carregado do .env
            Key: key,
        });

        return this.s3.send(command); // Exclui o arquivo
    }
}
