import { Controller, Put, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { UpdateService } from './update.service.js';
import { SecretKeyGuard } from '../../shared/secret-key.guard.js';

@ApiExcludeController()
@Controller('Anime')
export class UpdateController {
  constructor(private readonly update: UpdateService) {}

  @Put('update/recent')
  @UseGuards(SecretKeyGuard)
  updateRecent() {
    this.update
      .queueRecentAnime()
      .catch((err) => console.error('Recent update failed:', err)); // just in case it blows up

    return {
      status: 'Recent update started',
    };
  }

  @Put('update/today')
  @UseGuards(SecretKeyGuard)
  updateToday() {
    this.update
      .queueTodayAnime()
      .catch((err) => console.error('Today update failed:', err)); // just in case it blows up

    return {
      status: 'Today update started',
    };
  }

  @Put('update/week')
  @UseGuards(SecretKeyGuard)
  updateWeek() {
    this.update
      .queueWeekAgoAnime()
      .catch((err) => console.error('Week update failed:', err)); // just in case it blows up

    return {
      status: 'Week update started',
    };
  }
}
