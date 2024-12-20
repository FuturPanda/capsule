export class BaseResponseDto {
  metadata: ResponseMetadata;
  data: unknown;
}

export class ResponseMetadata {
  timestamp: Date;
  table: string;
  fields: string[];
}
