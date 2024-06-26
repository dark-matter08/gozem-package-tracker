import { Example, Get, Route, Tags } from 'tsoa';
import { Health } from '../../models';
import { HealthService } from '../../services';

@Route('/api/v1/health')
@Tags('Health Controller Operations')
export default class HealthController {
  /**
   * Test if API is available
   */
  @Example<Health[]>([
    {
      message: 'pong',
    },
  ])
  @Get('/')
  public async getHealth(): Promise<Health> {
    return new HealthService().getHealth();
  }
}
