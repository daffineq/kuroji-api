import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma.service';
import { CustomHttpService } from '../../../../../http/http.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TvdbHelper } from '../../utils/tvdb-helper';
import { TvdbLogin } from '@prisma/client';
import { TVDB } from '../../../../../configs/tvdb.config'

export interface LoginResponse {
  status: string;
  data: {
    token: string;
  };
}

@Injectable()
export class TvdbTokenService {
  private readonly logger = new Logger(TvdbTokenService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: TvdbHelper,
    private readonly customHttpService: CustomHttpService,
  ) {}

  async getToken(): Promise<string> {
    const login = await this.prisma.tvdbLogin.findFirst({
      where: { expired: false },
      orderBy: { createDate: 'desc' },
    });
    if (!login) {
      await this.check();
      const newLogin = await this.prisma.tvdbLogin.findFirst({
        where: { expired: false },
        orderBy: { createDate: 'desc' },
      });
      if (!newLogin) {
        throw new Error('No token available');
      }
      return newLogin.token;
    }
    return login.token;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async check(): Promise<void> {
    const count = await this.prisma.tvdbLogin.count();
    if (count === 0) {
      this.logger.log("No tokens found");
      await this.createToken();
      return;
    }

    const login = await this.prisma.tvdbLogin.findFirst({
      where: { expired: false },
      orderBy: { createDate: 'desc' },
    });

    if (login) {
      const expiryDate = new Date(login.createDate);
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      if (new Date() > expiryDate) {
        await this.prisma.tvdbLogin.update({
          where: { id: login.id },
          data: { expired: true },
        });
        this.logger.log("Token expired");
        await this.createToken();
      } else {
        this.logger.log(`Token valid until: ${expiryDate.toISOString()}`);
      }
    } else {
      await this.createToken();
    }
  }

  async createToken(): Promise<void> {
    const response = await this.customHttpService.postResponse<LoginResponse>(
      TVDB.getLoginUrl(),
      { apikey: TVDB.API_KEY }
    );
    const token = response.data.token;

    const tokenData = this.helper.getTvdbLoginData({
      token,
      createDate: new Date(),
      expired: false,
    } as TvdbLogin);

    const existingLogin = await this.prisma.tvdbLogin.findFirst({
      where: { token },
    });
    
    if (existingLogin) {
      await this.prisma.tvdbLogin.update({
        where: { id: existingLogin.id },
        data: tokenData,
      });
    } else {
      await this.prisma.tvdbLogin.create({
        data: tokenData,
      });
    }
  }
}
