import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { VideosService } from '../videos.service';

@Injectable()
export class BelongsToUserGuard implements CanActivate {
  constructor(@Inject('VideosService') private readonly video: VideosService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { id } = request.params;
    const { id: userId } = request.user;

    const video = await this.video.findById(id);
    if (video.publishedById != userId) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
