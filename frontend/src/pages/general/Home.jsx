import { useEffect, useState } from 'react'
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import api from '../../services/api'

const Home = () => {
  const [videos, setVideos] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get('/food')
        setVideos(res.data.foodItems || [])
      } catch (err) {
        console.error(err)
        setError('Failed to load videos')
      }
    }

    fetchVideos()
  }, [])

  const likeVideo = async (item) => {
    const foodId = item.id || item._id

    try {
      const res = await api.post('/food/like', { foodId })

      setVideos((prev) =>
        prev.map((v) => {
          const vId = v.id || v._id
          if (vId !== foodId) return v

          const count = v.likeCount || 0
          return {
            ...v,
            likeCount: res.data.like
              ? count + 1
              : Math.max(count - 1, 0),
          }
        })
      )
    } catch (err) {
      console.error('Like failed', err)
    }
  }

  const saveVideo = async (item) => {
    const foodId = item.id || item._id

    try {
      const res = await api.post('/food/save', { foodId })

      setVideos((prev) =>
        prev.map((v) => {
          const vId = v.id || v._id
          if (vId !== foodId) return v

          const count = v.savesCount || 0
          return {
            ...v,
            savesCount: res.data.save
              ? count + 1
              : Math.max(count - 1, 0),
          }
        })
      )
    } catch (err) {
      console.error('Save failed', err)
    }
  }

  if (error) {
    return <p style={{ padding: '16px', color: 'red' }}>{error}</p>
  }

  return (
    <ReelFeed
      items={videos}
      onLike={likeVideo}
      onSave={saveVideo}
      emptyMessage="No videos available."
    />
  )
}

export default Home
