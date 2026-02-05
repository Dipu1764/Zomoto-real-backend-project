import { useEffect, useState } from 'react'
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import api from '../../services/api'

const Saved = () => {
  const [videos, setVideos] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await api.get('/food/save')

        const savedFoods = (res.data.savedFoods || []).map((item) => {
          const food = item.food || {}

          return {
            id: food.id || food._id,
            video: food.video,
            description: food.description,
            likeCount: food.likeCount ?? 0,
            savesCount: food.savesCount ?? 0,
            commentsCount: food.commentsCount ?? 0,
            foodPartner: food.foodPartner,
          }
        })

        setVideos(savedFoods)
      } catch (err) {
        console.error(err)
        setError('Failed to load saved videos')
      }
    }

    fetchSaved()
  }, [])

  const removeSaved = async (item) => {
    const foodId = item.id || item._id

    try {
      const res = await api.post('/food/save', { foodId })

      // If API toggles save → remove from list
      if (res.data.save === false) {
        setVideos((prev) => prev.filter((v) => (v.id || v._id) !== foodId))
      }
    } catch (err) {
      console.error('Remove saved failed', err)
    }
  }

  if (error) {
    return <p style={{ padding: '16px', color: 'red' }}>{error}</p>
  }

  return (
    <ReelFeed
      items={videos}
      onSave={removeSaved}
      emptyMessage="No saved videos yet."
    />
  )
}

export default Saved
