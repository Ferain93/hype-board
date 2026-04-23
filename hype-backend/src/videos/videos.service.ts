import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { YoutubeVideoRaw, VideoClean } from './video.interface';

@Injectable()
export class VideosService {
  getVideos(): VideoClean[] {
    const rawData = this.loadMockData();
    return rawData.items
      .map((item) => this.transform(item))
      .sort((a, b) => b.hypeLevel - a.hypeLevel);
  }

  private loadMockData(): { items: YoutubeVideoRaw[] } {
    const filePath = path.join(__dirname, '..', 'mock-youtube-api.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  }

  private transform(item: YoutubeVideoRaw): VideoClean {
    return {
      id: item.id,
      title: this.getTitle(item.snippet.title),
      author: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: this.getRelativeTime(item.snippet.publishedAt),
      hypeLevel: this.calculateHype(item),
    };
  }

  private getTitle(title: string): string {
    return title.replace(/tutorial/gi, 'Tutorial');
  }

  private calculateHype(item: YoutubeVideoRaw): number {
    const { statistics, snippet } = item;

    // Sin commentCount = comentarios desactivados → Hype 0
    if (statistics.commentCount === undefined) {
      return 0;
    }

    const views = parseInt(statistics.viewCount, 10);
    const likes = parseInt(statistics.likeCount, 10);
    const comments = parseInt(statistics.commentCount, 10);

    // Sin vistas → evitamos división por cero
    if (views === 0) {
      return 0;
    }

    let hype = (likes + comments) / views;

    // Si el título contiene "tutorial" (cualquier casing) → x2
    if (/tutorial/i.test(snippet.title)) {
      hype *= 2;
    }
    // Necesitamos ajustar el hype
    return Math.round(hype * 10000) / 10000;
  }

  private getRelativeTime(isoDate: string): string {
    const publishedDate = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - publishedDate.getTime();

    if (diffMs < 0) return 'Recientemente';

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) return 'Hace unos segundos';
    if (diffMinutes < 60) return diffMinutes === 1 ? 'Hace 1 minuto' : `Hace ${diffMinutes} minutos`;
    if (diffHours < 24) return diffHours === 1 ? 'Hace 1 hora' : `Hace ${diffHours} horas`;
    if (diffDays < 7) return diffDays === 1 ? 'Hace 1 día' : `Hace ${diffDays} días`;
    if (diffWeeks < 4) return diffWeeks === 1 ? 'Hace 1 semana' : `Hace ${diffWeeks} semanas`;
    if (diffMonths < 12) return diffMonths === 1 ? 'Hace 1 mes' : `Hace ${diffMonths} meses`;
    return diffYears === 1 ? 'Hace 1 año' : `Hace ${diffYears} años`;
  }
}