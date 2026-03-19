import { useState, useEffect, useCallback } from 'react'
import type { Video } from '../types'

export function useVideos(subjectId?: number) {
  const [videos, setVideos] = useState<Video[]>([])

  const load = useCallback(async () => {
    const data = await window.db.getVideos(subjectId ?? null)
    setVideos(data)
  }, [subjectId])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (title: string, filePath: string, totalMinutes: number) => {
    await window.db.createVideo(subjectId ?? null, title, filePath, totalMinutes)
    load()
  }, [subjectId, load])

  const updateProgress = useCallback(async (id: number, currentMinute: number) => {
    await window.db.updateVideoProgress(id, currentMinute)
    load()
  }, [load])

  const remove = useCallback(async (id: number) => {
    await window.db.deleteVideo(id)
    load()
  }, [load])

  return { videos, add, updateProgress, remove, reload: load }
}