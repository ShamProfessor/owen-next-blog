import React, { useEffect, useRef, useState } from 'react'
import { animated, useTransition } from 'react-spring'
import {
  animationFrameScheduler,
  distinctUntilChanged,
  fromEvent,
  map,
  startWith,
  throttleTime,
} from 'rxjs'
import { HiArrowSmUp } from 'react-icons/hi'

const BackToTop = () => {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const transitions = useTransition(visible, {
    from: { opacity: 0, y: 100 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 100 },
    config: { tension: 280, friction: 20 },
  })

  useEffect(() => {
    const el = window
    const sub = fromEvent(el, 'scroll')
      .pipe(
        throttleTime(0, animationFrameScheduler),
        startWith(null),
        map(() => el.scrollY > 500),
        distinctUntilChanged(),
      )
      .subscribe(bool => {
        setVisible(bool)
      })
    return () => sub.unsubscribe()
  }, [])

  function backToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return transitions(
    (styles, item) =>
      item && (
        <animated.div
          ref={ref}
          className="fixed right-8 bottom-8 sm:right-16 sm:bottom-16 flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-800/80 text-zinc-50 text-xl shadow cursor-pointer z-50"
          onClick={backToTop}
          style={styles}
        >
          <HiArrowSmUp className="text-2xl" />
        </animated.div>
      ),
  )
}

export default BackToTop
