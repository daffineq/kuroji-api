import { ApiProperty } from "@nestjs/swagger";
import { MediaStatus, MediaFormat, ITitle } from '@consumet/extensions';

export class AnimeResultDto {
    @ApiProperty()
    id: string | undefined;
    @ApiProperty()
    title: string | ITitle | undefined;
    @ApiProperty()
    url: string | undefined;
    @ApiProperty()
    image: string | undefined;
    @ApiProperty()
    imageHash: string | undefined;
    @ApiProperty()
    cover: string | undefined;
    @ApiProperty()
    coverHash: string | undefined;
    @ApiProperty()
    status: MediaStatus | undefined;
    @ApiProperty()
    rating: number | undefined;
    @ApiProperty()
    type: MediaFormat | undefined;
    @ApiProperty()
    releaseDate: string | undefined;
    @ApiProperty()
    relationType: string | undefined;
}
