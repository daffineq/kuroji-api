import { ApiProperty } from "@nestjs/swagger";
import { Intro, ISubtitle, IVideo } from '@consumet/extensions';

export class SourceDto {
    @ApiProperty()
    headers: { [k: string]: string; } | undefined;
    @ApiProperty()
    intro: Intro | undefined;
    @ApiProperty()
    outro: Intro | undefined;
    @ApiProperty()
    subtitles: ISubtitle[] | undefined;
    @ApiProperty()
    sources: IVideo[] | undefined;
    @ApiProperty()
    download: string | { url?: string | undefined; quality?: string | undefined; }[] | undefined;
    @ApiProperty()
    embedURL: string | undefined;
}
