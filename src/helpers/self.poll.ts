import { KurojiClient } from 'src/lib/http';
import { ClientModule } from './client';
import { EnableSchedule, Schedule, Scheduled } from './schedule';
import { Config } from 'src/config/config';

@EnableSchedule
class SelfPollModule extends ClientModule {
  protected override readonly client = new KurojiClient(Config.public_url);

  @Scheduled(Schedule.every5Minutes(), Config.render)
  async poll() {
    try {
      await this.client.get('');
      console.log('Self Polled!');
    } catch {
      console.log(`Self Poll failed :(`);
    }
  }
}

const SelfPoll = new SelfPollModule();

export { SelfPoll, SelfPollModule };
