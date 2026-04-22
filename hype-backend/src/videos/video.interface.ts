// Forma cruda que viene del JSON de YouTube (simulado)
export interface YoutubeVideoRaw {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount?: string;
  };
}

// Forma limpia que devuelve nuestro endpoint
export interface VideoClean {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  publishedAt: string;
  hypeLevel: number;
}