import { Controller, Get } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideoClean } from './video.interface';

@Controller('api/videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  getVideos(): VideoClean[] {
    return this.videosService.getVideos();
  }
}