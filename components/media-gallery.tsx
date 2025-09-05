"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { useCart } from "@/contexts/cart-context"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Settings,
  BookOpen,
  Clock,
  Users,
  ShoppingCart,
} from "lucide-react"

interface Course {
  id: string
  title: string
  instructor: string
  duration: string
  students: number
  level: "Beginner" | "Intermediate" | "Advanced"
  thumbnail: string
  videoUrl: string
  description: string
  category: string
  price: number
  originalPrice?: number
}

const sampleCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to React Development",
    instructor: "Sarah Johnson",
    duration: "4h 30m",
    students: 1250,
    level: "Beginner",
    thumbnail: "/react-development-course-thumbnail.jpg",
    videoUrl: "/react-tutorial-video.jpg",
    description: "Learn the fundamentals of React including components, state management, and modern hooks.",
    category: "Web Development",
    price: 49.99,
    originalPrice: 79.99,
  },
  {
    id: "2",
    title: "Advanced JavaScript Patterns",
    instructor: "Michael Chen",
    duration: "6h 15m",
    students: 890,
    level: "Advanced",
    thumbnail: "/javascript-patterns-course-thumbnail.jpg",
    videoUrl: "/javascript-tutorial-video.jpg",
    description: "Master advanced JavaScript concepts including closures, prototypes, and design patterns.",
    category: "Programming",
    price: 69.99,
    originalPrice: 99.99,
  },
  {
    id: "3",
    title: "UI/UX Design Fundamentals",
    instructor: "Emma Rodriguez",
    duration: "5h 45m",
    students: 2100,
    level: "Intermediate",
    thumbnail: "/ui-ux-design-course-thumbnail.jpg",
    videoUrl: "/design-tutorial-video.jpg",
    description: "Create beautiful and functional user interfaces with modern design principles.",
    category: "Design",
    price: 59.99,
  },
  {
    id: "4",
    title: "Data Science with Python",
    instructor: "David Park",
    duration: "8h 20m",
    students: 1680,
    level: "Intermediate",
    thumbnail: "/data-science-python-course-thumbnail.jpg",
    videoUrl: "/python-data-science-video.jpg",
    description: "Analyze data and build machine learning models using Python and popular libraries.",
    category: "Data Science",
    price: 79.99,
    originalPrice: 119.99,
  },
]

interface VideoPlayerProps {
  course: Course
  onClose: () => void
}

function VideoPlayer({ course, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [])

  // Canvas overlay for interactive elements
  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const drawOverlay = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw progress indicator
      ctx.fillStyle = "rgba(8, 145, 178, 0.8)"
      ctx.fillRect(10, 10, 200, 4)
      ctx.fillStyle = "rgba(132, 204, 22, 1)"
      ctx.fillRect(10, 10, (currentTime / duration) * 200, 4)

      // Draw course title overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(10, canvas.height - 60, canvas.width - 20, 50)
      ctx.fillStyle = "white"
      ctx.font = "16px sans-serif"
      ctx.fillText(course.title, 20, canvas.height - 35)
      ctx.font = "12px sans-serif"
      ctx.fillText(`Instructor: ${course.instructor}`, 20, canvas.height - 15)
    }

    const interval = setInterval(drawOverlay, 100)
    return () => clearInterval(interval)
  }, [currentTime, duration, course])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0]
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const skip = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(duration, currentTime + seconds))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full aspect-video"
            poster={course.thumbnail}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <source src={course.videoUrl} type="video/mp4" />
            <track kind="captions" src="/captions.vtt" srcLang="en" label="English" />
          </video>

          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ mixBlendMode: "screen" }} />

          {showControls && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
                  aria-label="Video progress"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={togglePlay}
                      className="text-white hover:bg-white/20"
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => skip(-10)}
                      className="text-white hover:bg-white/20"
                      aria-label="Skip back 10 seconds"
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => skip(10)}
                      className="text-white hover:bg-white/20"
                      aria-label="Skip forward 10 seconds"
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="text-white hover:bg-white/20"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>

                      <Slider
                        value={[isMuted ? 0 : volume]}
                        max={1}
                        step={0.1}
                        onValueChange={handleVolumeChange}
                        className="w-20"
                        aria-label="Volume"
                      />
                    </div>

                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" aria-label="Settings">
                      <Settings className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" aria-label="Fullscreen">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:bg-white/20"
          aria-label="Close video player"
        >
          ✕
        </Button>
      </div>
    </div>
  )
}

export function MediaGallery() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [filter, setFilter] = useState<string>("All")
  const { addItem, state } = useCart()

  const categories = ["All", "Web Development", "Programming", "Design", "Data Science"]

  const filteredCourses =
    filter === "All" ? sampleCourses : sampleCourses.filter((course) => course.category === filter)

  const getLevelColor = (level: Course["level"]) => {
    switch (level) {
      case "Beginner":
        return "bg-accent/10 text-accent"
      case "Intermediate":
        return "bg-primary/10 text-primary"
      case "Advanced":
        return "bg-destructive/10 text-destructive"
    }
  }

  const handleAddToCart = (course: Course) => {
    addItem({
      id: course.id,
      title: course.title,
      instructor: course.instructor,
      price: course.price,
      originalPrice: course.originalPrice,
      thumbnail: course.thumbnail,
      category: course.category,
      level: course.level,
      duration: course.duration,
    })
  }

  const isInCart = (courseId: string) => {
    return state.items.some((item) => item.id === courseId)
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Featured Courses</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our interactive multimedia courses designed to enhance your learning experience
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={`${course.title} course thumbnail`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    onClick={() => setSelectedCourse(course)}
                    className="bg-primary hover:bg-primary/90"
                    aria-label={`Play ${course.title} course preview`}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Preview Course
                  </Button>
                </div>
                <Badge className={`absolute top-2 right-2 ${getLevelColor(course.level)}`}>{course.level}</Badge>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {course.instructor}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </span>
                  <span className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {course.students.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {course.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">${course.originalPrice}</span>
                    )}
                    <span className="text-lg font-bold text-primary">${course.price}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    className="flex-1 bg-transparent"
                    variant="outline"
                    onClick={() => handleAddToCart(course)}
                    disabled={isInCart(course.id)}
                  >
                    {isInCart(course.id) ? (
                      "In Cart"
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedCourse && <VideoPlayer course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
      </div>
    </section>
  )
}
