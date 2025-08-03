import { ApiProperty } from '@nestjs/swagger';
import { ApiKeyType, UserRole } from '@prisma/client';

export class CreateUserPayloadDto {
  @ApiProperty() email: string;
  @ApiProperty() password: string;
  @ApiProperty() name: string;
}

export class LoginDto {
  @ApiProperty() email: string;
  @ApiProperty() password: string;
}

export class GiveRoleDto {
  @ApiProperty() userId: string;
  @ApiProperty({ enum: UserRole }) role: UserRole;
}

export class CreateApiKeyRequestPayloadDto {
  @ApiProperty({ enum: ApiKeyType }) type: ApiKeyType;
  @ApiProperty() whatFor: string;
}

export class DeclineApiKeyRequestPayloadDto {
  @ApiProperty() reason: string;
}
