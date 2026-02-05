import { useEffect, useRef, memo } from 'react'
import { Link } from 'react-router-dom'

// Reusable vertical reels feed
const ReelFeed = ({
  items = [],
  onLike,
  onSave,
  emptyMessage = 'No videos yet.'
}) => {
  const videoRefs = useRef(new Map())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target
          if (!(video instanceof HTMLVideoElement)) return

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: [0, 0.25, 0.6, 1] }
    )

    videoRefs.current.forEach((video) => observer.observe(video))

    return () => {
      videoRefs.current.forEach((video) => observer.unobserve(video))
      observer.disconnect()
    }
  }, [items])

  const setVideoRef = (id) => (el) => {
    if (!el) {
      videoRefs.current.delete(id)
      return
    }
    videoRefs.current.set(id, el)
  }

  return (
    <div className="reels-page">
      <div className="reels-feed" role="list">
        {items.length === 0 && (
          <div className="empty-state">
            <p>{emptyMessage}</p>
          </div>
        )}

        {items.map((item) => {
          const reelId = item._id || item.id

          return (
            <section key={reelId} className="reel" role="listitem">
              <video
                ref={setVideoRef(reelId)}
                className="reel-video"
                src={item.video}
                muted
                loop
                playsInline
                preload="metadata"
              />

              <div className="reel-overlay">
                <div className="reel-overlay-gradient" aria-hidden="true" />

                <div className="reel-actions">
                  {/* Like */}
                  <div className="reel-action-group">
                    <button
                      className="reel-action"
                      aria-label="Like"
                      onClick={onLike ? () => onLike(item) : undefined}
                    >
                      ❤️
                    </button>
                    <div className="reel-action__count">
                      {item.likeCount ?? item.likesCount ?? item.likes ?? 0}
                    </div>
                  </div>

                  {/* Save */}
                  <div className="reel-action-group">
                    <button
                      className="reel-action"
                      aria-label="Save"
                      onClick={onSave ? () => onSave(item) : undefined}
                    >
                      🔖
                    </button>
                    <div className="reel-action__count">
                      {item.savesCount ?? item.bookmarks ?? item.saves ?? 0}
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="reel-action-group">
                    <button className="reel-action" aria-label="Comments">
                      💬
                    </button>
                    <div className="reel-action__count">
                      {item.commentsCount ??
                        (Array.isArray(item.comments) ? item.comments.length : 0)}
                    </div>
                  </div>
                </div>

                <div className="reel-content">
                  {item.description && (
                    <p className="reel-description" title={item.description}>
                      {item.description}
                    </p>
                  )}

                  {item.foodPartner && (
                    <Link
                      className="reel-btn"
                      to={`/food-partner/${item.foodPartner}`}
                    >
                      Visit store
                    </Link>
                  )}
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default memo(ReelFeed)
