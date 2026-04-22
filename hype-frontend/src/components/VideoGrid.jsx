import VideoCard from './VideoCard';

function VideoGrid({ videos }) {
  if (!videos.length) return null;

  const [jewel, ...rest] = videos;

  return (
    <div className="grid-wrapper">
      <VideoCard video={jewel} isJewel={true} />
      <div className="line"></div>
      <p className="section-title">Más videos para explorar</p>
      <div className="grid">
        {rest.map((video) => (
          <VideoCard key={video.id} video={video} isJewel={false} />
        ))}
      </div>
    </div>
  );
}

export default VideoGrid;