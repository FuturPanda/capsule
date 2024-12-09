import { Injectable, Logger } from '@nestjs/common';
import { BASE64 } from '../_utils/constants/primitives.constant';
import { ConfigService } from '@nestjs/config';
import { ApiKeysRepository } from './api-keys.repository';
import { ApiKeyTypeEnum } from './_utils/enum/api-key-type.enum';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  private readonly logger = new Logger();
  private readonly algorithm = 'aes-256-cbc';
  private readonly encryptionKey =
    '5ebe2294ecd0e0f08eab7690d2a6ee69f9e5da618d6fea5dd341e00e46bc0f05';
  private readonly encryptionIV = '7f2d46c69cd1c0f3988e0c7a69647a29';

  constructor(
    private readonly configService: ConfigService,
    private readonly apiKeysRepository: ApiKeysRepository,
  ) {}

  encode = <T>(obj: T): string =>
    Buffer.from(JSON.stringify(obj)).toString(BASE64);

  decode = <T>(str: string): T =>
    JSON.parse(Buffer.from(str, 'base64').toString());

  encrypt = (password: string): string => {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.encryptionKey, 'hex'),
      Buffer.from(this.encryptionIV, 'hex'),
    );

    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
  };
  decrypt = (encryptedData: string) => {
    try {
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        Buffer.from(this.encryptionKey, 'hex'),
        Buffer.from(this.encryptionIV, 'hex'),
      );

      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error('Decryption failed');
    }
  };

  createApiKeyIfNotExists(ownerEmail: string, password: string) {
    const baseUrl = this.configService.get('BASE_URL');
    const apiContent = {
      baseUrl,
      email: ownerEmail,
      password: this.encrypt(password),
    };
    const existingApiKey = this.apiKeysRepository.getApiKeyByType(
      ApiKeyTypeEnum.OWNER_UI,
    );
    if (!existingApiKey) {
      const apiKey = this.encode(apiContent);
      this.logger.log(`API Key: ${apiKey}`);
      this.apiKeysRepository.createApiKey(apiKey, ApiKeyTypeEnum.OWNER_UI);
      return apiKey;
    }
    return existingApiKey;
  }
}
