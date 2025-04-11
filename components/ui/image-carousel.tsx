"use client"

import { useState, useEffect } from "react"
import { Slide } from 'react-slideshow-image'
import Image from "next/image"
import 'react-slideshow-image/dist/styles.css'

interface ImageCarouselProps {
  images: string[]
  className?: string
  isHovered?: boolean
}

export function ImageCarousel({ images, className, isHovered = false }: ImageCarouselProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setIsPlaying(isHovered)
  }, [isHovered])

  return (
    <div className={className}>
      <Slide
        autoplay={isPlaying}
        duration={3000}
        transitionDuration={500}
        indicators={false}
        arrows={false}
        infinite={true}
        pauseOnHover={false}
      >
        {images.map((image, index) => (
          <div key={index} className="each-slide">
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover object-center"
            />
          </div>
        ))}
      </Slide>
    </div>
  )
}