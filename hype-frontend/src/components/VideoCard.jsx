import SmartImage from './SmartImage';

const HYPE_CATEGORIES = [
  { min: 0, max: 0, label: '💤 Sin Hype', className: 'category-zero' },
  { min: 0, max: 0.25, label: '🧊 Frío', className: 'category-low' },
  { min: 0.25, max: 0.5, label: '⚡ Trending', className: 'category-mid' },
  { min: 0.5, max: 0.75, label: '🔥 Viral', className: 'category-high' },
  { min: 0.75, max: 1, label: '💥 Hype Total', className: 'category-max' },
];

function getCategory(hypeLevel, maxHype) {
  if (hypeLevel === 0) return HYPE_CATEGORIES[0];
  const ratio = maxHype > 0 ? hypeLevel / maxHype : 0;
  if (ratio < 0.25) return HYPE_CATEGORIES[1];
  if (ratio < 0.5) return HYPE_CATEGORIES[2];
  if (ratio < 0.75) return HYPE_CATEGORIES[3];
  return HYPE_CATEGORIES[4];
}

function FlameRating({ hypeLevel, maxHype }) {
  const ratio = maxHype > 0 ? hypeLevel / maxHype : 0;
  const filled = hypeLevel === 0 ? 0 : Math.max(1, Math.round(ratio * 5));

  return (
    <div className="flame-rating" aria-label={`${filled} de 5 llamas de hype`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`flame ${i < filled ? 'flame-on' : 'flame-off'}`}>
          🔥
        </span>
      ))}
    </div>
  );
}

function VideoCard({ video, isJewel, maxHype }) {
  const category = getCategory(video.hypeLevel, maxHype);

  return (
    <div className={`video-card ${isJewel ? 'jewel' : ''}`}>
      {isJewel && (
        <div className="jewel-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 3 8 9l4 13 4-13-2.5-6" /><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z" /><path d="M2 9h20" /></svg>
          Joya de la Corona
        </div>
      )}
      <SmartImage src={video.thumbnail} alt={video.title} />
      <div className="card-body">
        <h3>{video.title}</h3>
        <div className="card-body-meta">
          <p className="author">{video.author} • </p>
          <p className="date">{video.publishedAt}</p>
        </div>
        <div className="hype-bar">
          <span className="hype-label">Nivel de Hype</span>
          <FlameRating hypeLevel={video.hypeLevel} maxHype={maxHype} />
        </div>
      </div>
    </div>
  );
}

export default VideoCard;