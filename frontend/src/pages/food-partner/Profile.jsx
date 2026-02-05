import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/api'
import '../../styles/profile.css'

const Profile = () => {
  const { id } = useParams()

  const [profile, setProfile] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)

        const res = await api.get(`/food-partner/${id}`)
        const foodPartner = res.data.foodPartner

        setProfile(foodPartner)
        setVideos(foodPartner?.foodItems || [])
      } catch (err) {
        console.error(err)
        setError(
          err.response?.data?.message ||
          'Failed to load profile'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id])

  if (loading) {
    return <p style={{ padding: '24px' }}>Loading profile...</p>
  }

  if (error) {
    return <p style={{ padding: '24px', color: 'red' }}>{error}</p>
  }

  if (!profile) {
    return <p style={{ padding: '24px' }}>Profile not found</p>
  }

  return (
    <main className="profile-page">
      {/* HEADER */}
      <section className="profile-header">
        <div className="profile-meta">
          <img
            className="profile-avatar"
            src="https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60"
            alt={`${profile.name} logo`}
          />

          <div className="profile-info">
            <h1 className="profile-pill profile-business">
              {profile.name}
            </h1>
            <p className="profile-pill profile-address">
              {profile.address}
            </p>
          </div>
        </div>

        <div className="profile-stats" role="list" aria-label="Stats">
          <div className="profile-stat" role="listitem">
            <span className="profile-stat-label">total meals</span>
            <span className="profile-stat-value">
              {profile.totalMeals ?? videos.length}
            </span>
          </div>
          <div className="profile-stat" role="listitem">
            <span className="profile-stat-label">customers served</span>
            <span className="profile-stat-value">
              {profile.customersServed ?? 0}
            </span>
          </div>
        </div>
      </section>

      <hr className="profile-sep" />

      {/* VIDEOS GRID */}
      <section className="profile-grid" aria-label="Videos">
        {videos.length === 0 && (
          <p style={{ padding: '16px' }}>No videos yet</p>
        )}

        {videos.map((v) => (
          <div key={v.id} className="profile-grid-item">
            <video
              className="profile-grid-video"
              src={v.video}
              muted
              loop
              playsInline
            />
          </div>
        ))}
      </section>
    </main>
  )
}

export default Profile
