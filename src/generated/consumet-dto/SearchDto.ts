import { ApiProperty } from "@nestjs/swagger";

export class SearchDto {
    @ApiProperty()
    currentPage: number | undefined;
    @ApiProperty()
    hasNextPage: boolean | undefined;
    @ApiProperty()
    totalPages: number | undefined;
    @ApiProperty()
    totalResults: number | undefined;
    @ApiProperty()
    results: any[] | undefined;
}
