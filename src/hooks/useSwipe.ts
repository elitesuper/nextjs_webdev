import { useEffect, useRef, useState } from 'react'

export const useSwipe = ({
  left,
  right,
  up,
  down,
}: {
  left?: () => void
  right?: () => void
  up?: () => void
  down?: () => void
}) => {
  const [isDragging, setDragging] = useState(false)
  const touchCoordsRef = useRef({
    touchStart: { x: 0, y: 0, time: Date.now() },
    touchEnd: { x: 0, y: 0 },
  })
  const fnsRef = useRef({ up, down, left, right })
  fnsRef.current = {
    up,
    left,
    down,
    right,
  }
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent | MouseEvent) => {
      setDragging(false)
      if (e instanceof TouchEvent) {
        touchCoordsRef.current.touchStart.x = e.targetTouches[0].clientX
        touchCoordsRef.current.touchStart.y = e.targetTouches[0].clientY
      }
      if (e instanceof MouseEvent) {
        touchCoordsRef.current.touchStart.x = e.screenX
        touchCoordsRef.current.touchStart.y = e.screenY
      }
      touchCoordsRef.current.touchStart.time = Date.now()
      document.addEventListener('touchmove', handleTouchMove)
      // document.addEventListener('mousemove', handleTouchMove)
    }
    const handleTouchMove = (e: TouchEvent | MouseEvent) => {
      let x = 0,
        y = 0
      if (e instanceof MouseEvent) {
        x = e.screenX
        y = e.screenY
      }
      if (e instanceof TouchEvent) {
        x = e.targetTouches[0].clientX
        y = e.targetTouches[0].clientY
      }
      if (!isDragging) {
        setDragging(true)
      }
      touchCoordsRef.current.touchEnd.x = x
      touchCoordsRef.current.touchEnd.y = y
    }
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove)
      // document.removeEventListener('mousemove', handleTouchMove)
      setDragging(false)
      const threshold = 150
      const swipeSpeed = 1 // sec;
      const touchEndX = touchCoordsRef.current.touchEnd.x
      const touchEndY = touchCoordsRef.current.touchEnd.y
      const touchStartX = touchCoordsRef.current.touchStart.x
      const touchStartY = touchCoordsRef.current.touchStart.y
      const elapsedTime =
        (Date.now() - touchCoordsRef.current.touchStart.time) / 1000
      if (elapsedTime > swipeSpeed) {
        return
      }
      const xDistance = touchStartX - touchEndX
      const yDistance = touchStartY - touchEndY

      if (Math.abs(xDistance) < threshold && Math.abs(yDistance) < threshold) {
        return
      }

      if (Math.abs(xDistance) >= Math.abs(yDistance)) {
        xDistance > 0 ? fnsRef.current.right?.() : fnsRef.current.left?.()
      } else {
        yDistance > 0 ? fnsRef.current.down?.() : fnsRef.current.up?.()
      }
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)
    // document.addEventListener('mousedown', handleTouchStart)
    // document.addEventListener('mouseleave', handleTouchEnd)
    // document.addEventListener('mouseup', handleTouchEnd)
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
      // document.removeEventListener('mousedown', handleTouchStart)
      // document.removeEventListener('mouseleave', handleTouchEnd)
      // document.removeEventListener('mouseup', handleTouchEnd)
    }
  })

  return { isDragging }
}
