export class ResourceModel {
  id: number;
  name: string;
  type: ResourceTypeEnum;
}

export enum ResourceTypeEnum {
  DATABASE = 'DATABASE',
  PERSON = 'PERSON',
  TASK = 'TASK',
  DOCUMENT = 'DOCUMENT',
}
