import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import '../../styles/create-food.css'

const CreateFood = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [videoURL, setVideoURL] = useState('')
  const [fileError, setFileError] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!videoFile) {
      setVideoURL('')
      return
    }
    const url = URL.createObjectURL(videoFile)
    setVideoURL(url)
    return () => URL.revokeObjectURL(url)
  }, [videoFile])

  const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return resetFile()

    if (!file.type.startsWith('video/')) {
      setFileError('Please select a valid video file')
      return
    }

    setFileError('')
    setVideoFile(file)
  }

  const onDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer?.files?.[0]
    if (!file) return

    if (!file.type.startsWith('video/')) {
      setFileError('Please drop a valid video file')
      return
    }

    setFileError('')
    setVideoFile(file)
  }

  const resetFile = () => {
    setVideoFile(null)
    setFileError('')
  }

  const openFileDialog = () => fileInputRef.current?.click()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !videoFile) {
      setError('Food name and video are required')
      return
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('video', videoFile) // 🔴 confirm backend field name

    try {
      setLoading(true)

      const res = await api.post('/food', formData)

      console.log('Food created:', res.data)
      navigate('/')
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message ||
        'Failed to upload food. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = useMemo(
    () => loading || !name.trim() || !videoFile,
    [loading, name, videoFile]
  )

  return (
    <div className="create-food-page">
      <div className="create-food-card">
        <header className="create-food-header">
          <h1 className="create-food-title">Create Food</h1>
          <p className="create-food-subtitle">
            Upload a short video, give it a name, and add a description.
          </p>
        </header>

        <form className="create-food-form" onSubmit={onSubmit}>
          {/* VIDEO UPLOAD */}
          <div className="field-group">
            <label>Food Video</label>

            <input
              ref={fileInputRef}
              className="file-input-hidden"
              type="file"
              accept="video/*"
              onChange={onFileChange}
            />

            <div
              className="file-dropzone"
              role="button"
              tabIndex={0}
              onClick={openFileDialog}
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="file-dropzone-inner">
                <strong>Tap to upload</strong> or drag & drop
                <div className="file-hint">
                  MP4, WebM, MOV • Max ~100MB
                </div>
              </div>
            </div>

            {fileError && <p className="error-text">{fileError}</p>}

            {videoFile && (
              <div className="file-chip">
                <span>{videoFile.name}</span>
                <span>{(videoFile.size / 1024 / 1024).toFixed(1)} MB</span>
                <button type="button" onClick={resetFile}>
                  Remove
                </button>
              </div>
            )}
          </div>

          {videoURL && (
            <div className="video-preview">
              <video src={videoURL} controls playsInline />
            </div>
          )}

          {/* NAME */}
          <div className="field-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Spicy Paneer Wrap"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="field-group">
            <label>Description</label>
            <textarea
              rows={4}
              placeholder="Ingredients, taste, spice level..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="form-actions">
            <button className="btn-primary" type="submit" disabled={isDisabled}>
              {loading ? 'Uploading...' : 'Save Food'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateFood
