function VideoCard({ video, isJewel }) {
  const hypePercent = Math.round(video.hypeLevel * 100);

  return (
    <div className={`video-card ${isJewel ? 'jewel' : ''}`}>
      {isJewel && (
        <div className="jewel-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gem-icon lucide-gem"><path d="M10.5 3 8 9l4 13 4-13-2.5-6"/><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"/><path d="M2 9h20"/></svg>
          Joya de la Corona
        </div>
      )}
      <img
        src={video.thumbnail}
        alt={video.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://loremflickr.com/300/200/technology,coding?lock=${video.id}`;
        }}
      />
      <div className="card-body">
        <h3>{video.title}</h3>
        <div className="card-body-meta">
          <p className="author">{video.author} • </p>
          <p className="date">{video.publishedAt}</p>
        </div>
        <div className="hype-bar">
          <span className="hype-label">Nivel de Hype:</span>
          <span className={`hype-value ${isJewel ? 'hype-jewel' : ''}`}>
            🔥 {hypePercent}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;