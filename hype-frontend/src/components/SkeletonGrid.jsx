import './SkeletonGrid.css';

function SkeletonCard({ isJewel }) {
  if (isJewel) {
    return (
      <div className="skeleton-card skeleton-jewel">
        <div className="skeleton-img skeleton-pulse" />
        <div className="skeleton-body">
          <div className="skeleton-badge skeleton-pulse" />
          <div className="skeleton-title skeleton-pulse" style={{ width: '85%' }} />
          <div className="skeleton-title skeleton-pulse" style={{ width: '60%' }} />
          <div className="skeleton-meta skeleton-pulse" style={{ width: '40%' }} />
          <div className="skeleton-hype skeleton-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="skeleton-card">
      <div className="skeleton-img skeleton-pulse" />
      <div className="skeleton-body">
        <div className="skeleton-title skeleton-pulse" style={{ width: '90%' }} />
        <div className="skeleton-title skeleton-pulse" style={{ width: '65%' }} />
        <div className="skeleton-meta skeleton-pulse" style={{ width: '45%' }} />
        <div className="skeleton-hype-row">
          <div className="skeleton-hype-label skeleton-pulse" />
          <div className="skeleton-hype-pill skeleton-pulse" />
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="skeleton-wrapper">
      {/* Joya skeleton */}
      <SkeletonCard isJewel={true} />

      {/* Divider */}
      <div className="skeleton-divider skeleton-pulse" />

      {/* Section title */}
      <div className="skeleton-section-title skeleton-pulse" />

      {/* Grid skeletons */}
      <div className="grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} isJewel={false} />
        ))}
      </div>
    </div>
  );
}

export default SkeletonGrid;
