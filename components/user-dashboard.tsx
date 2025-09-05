"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeAwareChart } from "@/components/theme-aware-chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { BookOpen, Clock, Trophy, TrendingUp, Calendar, Play, CheckCircle, ActivityIcon } from "lucide-react"

interface EnrolledCourse {
  id: string
  title: string
  instructor: string
  progress: number
  totalLessons: number
  completedLessons: number
  lastAccessed: string
  thumbnail: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  timeSpent: string
}

interface CourseActivity {
  id: string
  type: "completed" | "started" | "achievement"
  title: string
  description: string
  timestamp: string
  course?: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
}

const enrolledCourses: EnrolledCourse[] = [
  {
    id: "1",
    title: "Introduction to React Development",
    instructor: "Sarah Johnson",
    progress: 75,
    totalLessons: 24,
    completedLessons: 18,
    lastAccessed: "2 hours ago",
    thumbnail: "/react-development-course-thumbnail.jpg",
    category: "Web Development",
    difficulty: "Beginner",
    timeSpent: "12h 30m",
  },
  {
    id: "2",
    title: "Advanced JavaScript Patterns",
    instructor: "Michael Chen",
    progress: 45,
    totalLessons: 32,
    completedLessons: 14,
    lastAccessed: "1 day ago",
    thumbnail: "/javascript-patterns-course-thumbnail.jpg",
    category: "Programming",
    difficulty: "Advanced",
    timeSpent: "8h 15m",
  },
  {
    id: "3",
    title: "UI/UX Design Fundamentals",
    instructor: "Emma Rodriguez",
    progress: 90,
    totalLessons: 20,
    completedLessons: 18,
    lastAccessed: "3 hours ago",
    thumbnail: "/ui-ux-design-course-thumbnail.jpg",
    category: "Design",
    difficulty: "Intermediate",
    timeSpent: "15h 45m",
  },
]

const recentActivities: CourseActivity[] = [
  {
    id: "1",
    type: "completed",
    title: "Completed Lesson: React Hooks Deep Dive",
    description: "Mastered useState, useEffect, and custom hooks",
    timestamp: "2 hours ago",
    course: "Introduction to React Development",
  },
  {
    id: "2",
    type: "achievement",
    title: "Earned Achievement: Quick Learner",
    description: "Completed 5 lessons in one day",
    timestamp: "1 day ago",
  },
  {
    id: "3",
    type: "started",
    title: "Started New Course: UI/UX Design Fundamentals",
    description: "Beginning your design journey",
    timestamp: "2 days ago",
    course: "UI/UX Design Fundamentals",
  },
  {
    id: "4",
    type: "completed",
    title: "Completed Quiz: JavaScript Closures",
    description: "Scored 95% on advanced concepts",
    timestamp: "3 days ago",
    course: "Advanced JavaScript Patterns",
  },
]

const achievements: Achievement[] = [
  {
    id: "1",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "🎯",
    earned: true,
    earnedDate: "2 weeks ago",
  },
  {
    id: "2",
    title: "Quick Learner",
    description: "Complete 5 lessons in one day",
    icon: "⚡",
    earned: true,
    earnedDate: "1 day ago",
  },
  {
    id: "3",
    title: "Consistent Student",
    description: "Study for 7 consecutive days",
    icon: "📅",
    earned: true,
    earnedDate: "5 days ago",
  },
  {
    id: "4",
    title: "Course Master",
    description: "Complete your first course",
    icon: "🏆",
    earned: false,
  },
  {
    id: "5",
    title: "Knowledge Seeker",
    description: "Enroll in 5 different courses",
    icon: "📚",
    earned: false,
  },
  {
    id: "6",
    title: "Perfect Score",
    description: "Get 100% on any quiz",
    icon: "⭐",
    earned: false,
  },
]

const weeklyProgressData = [
  { day: "Mon", hours: 2.5, lessons: 3 },
  { day: "Tue", hours: 1.8, lessons: 2 },
  { day: "Wed", hours: 3.2, lessons: 4 },
  { day: "Thu", hours: 2.1, lessons: 2 },
  { day: "Fri", hours: 4.0, lessons: 5 },
  { day: "Sat", hours: 1.5, lessons: 1 },
  { day: "Sun", hours: 2.8, lessons: 3 },
]

const categoryData = [
  { name: "Web Development", value: 40, color: "#0891b2" },
  { name: "Programming", value: 30, color: "#84cc16" },
  { name: "Design", value: 20, color: "#ea580c" },
  { name: "Data Science", value: 10, color: "#8b5cf6" },
]

const monthlyProgressData = [
  { month: "Jan", completed: 12, enrolled: 15 },
  { month: "Feb", completed: 18, enrolled: 20 },
  { month: "Mar", completed: 25, enrolled: 28 },
  { month: "Apr", completed: 32, enrolled: 35 },
  { month: "May", completed: 28, enrolled: 32 },
  { month: "Jun", completed: 35, enrolled: 38 },
]

export function UserDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")

  const totalCoursesEnrolled = enrolledCourses.length
  const totalLessonsCompleted = enrolledCourses.reduce((sum, course) => sum + course.completedLessons, 0)
  const totalTimeSpent = "36h 30m"
  const averageProgress = Math.round(
    enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length,
  )

  const getDifficultyColor = (difficulty: EnrolledCourse["difficulty"]) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-accent/10 text-accent border-accent/20"
      case "Intermediate":
        return "bg-primary/10 text-primary border-primary/20"
      case "Advanced":
        return "bg-destructive/10 text-destructive border-destructive/20"
    }
  }

  const getActivityIcon = (type: CourseActivity["type"]) => {
    switch (type) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-accent" />
      case "started":
        return <Play className="h-4 w-4 text-primary" />
      case "achievement":
        return <Trophy className="h-4 w-4 text-secondary" />
    }
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 ease-in-out">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Avatar className="h-16 w-16 ring-2 ring-border">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="User avatar" />
              <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, John!</h1>
              <p className="text-muted-foreground">Ready to continue your learning journey?</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="transition-colors duration-300 ease-in-out bg-transparent">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button size="sm" className="transition-colors duration-300 ease-in-out">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Courses
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card text-card-foreground border-border transition-colors duration-300 ease-in-out">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Courses Enrolled</p>
                  <p className="text-2xl font-bold">{totalCoursesEnrolled}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground border-border transition-colors duration-300 ease-in-out">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Lessons Completed</p>
                  <p className="text-2xl font-bold">{totalLessonsCompleted}</p>
                </div>
                <div className="p-2 bg-accent/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground border-border transition-colors duration-300 ease-in-out">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
                  <p className="text-2xl font-bold">{totalTimeSpent}</p>
                </div>
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground border-border transition-colors duration-300 ease-in-out">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Progress</p>
                  <p className="text-2xl font-bold">{averageProgress}%</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="overview" className="transition-colors duration-300 ease-in-out">
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="transition-colors duration-300 ease-in-out">
              My Courses
            </TabsTrigger>
            <TabsTrigger value="analytics" className="transition-colors duration-300 ease-in-out">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="achievements" className="transition-colors duration-300 ease-in-out">
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Continue Learning */}
              <div className="lg:col-span-2">
                <Card className="bg-card text-card-foreground border-border transition-colors duration-300 ease-in-out">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Play className="h-5 w-5 mr-2 text-primary" />
                      Continue Learning
                    </CardTitle>
                    <CardDescription>Pick up where you left off</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {enrolledCourses.slice(0, 2).map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center space-x-4 p-4 border border-border rounded-lg bg-card/50 transition-colors duration-300 ease-in-out"
                      >
                        <img
                          src={course.thumbnail || "/placeholder.svg"}
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{course.title}</h4>
                          <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Progress value={course.progress} className="flex-1" />
                            <span className="text-sm font-medium">{course.progress}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {course.completedLessons} of {course.totalLessons} lessons • Last accessed{" "}
                            {course.lastAccessed}
                          </p>
                        </div>
                        <Button size="sm" className="transition-colors duration-300 ease-in-out">
                          Continue
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-card text-card-foreground border-border transition-colors duration-300 ease-in-out">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ActivityIcon className="h-5 w-5 mr-2 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.slice(0, 4).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 transition-colors duration-300 ease-in-out"
                      >
                        <div className="mt-1">{getActivityIcon(activity.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Progress Chart */}
            <Card className="bg-card text-card-foreground border-border transition-colors duration-300 ease-in-out">
              <CardHeader>
                <CardTitle>This Week's Progress</CardTitle>
                <CardDescription>Your daily learning activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeAwareChart>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={weeklyProgressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="hours"
                        stackId="1"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ThemeAwareChart>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <Card
                  key={course.id}
                  className="overflow-hidden bg-card text-card-foreground border-border transition-colors duration-300 ease-in-out"
                >
                  <div className="relative">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className={`absolute top-2 right-2 ${getDifficultyColor(course.difficulty)}`}>
                      {course.difficulty}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">by {course.instructor}</p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                      </div>

                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          {course.completedLessons}/{course.totalLessons} lessons
                        </span>
                        <span>{course.timeSpent}</span>
                      </div>

                      <Button
                        className="w-full transition-colors duration-300 ease-in-out"
                        variant={course.progress === 100 ? "outline" : "default"}
                      >
                        {course.progress === 100 ? "Review Course" : "Continue Learning"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-card text-card-foreground border-border transition-colors duration-300 ease-in-out">
                <CardHeader>
                  <CardTitle>Learning Categories</CardTitle>
                  <CardDescription>Distribution of your enrolled courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ThemeAwareChart>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--popover-foreground))",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ThemeAwareChart>
                </CardContent>
              </Card>

              <Card className="bg-card text-card-foreground border-border transition-colors duration-300 ease-in-out">
                <CardHeader>
                  <CardTitle>Monthly Progress</CardTitle>
                  <CardDescription>Course completion over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ThemeAwareChart>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyProgressData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--popover-foreground))",
                          }}
                        />
                        <Line type="monotone" dataKey="completed" stroke="hsl(var(--primary))" strokeWidth={2} />
                        <Line type="monotone" dataKey="enrolled" stroke="hsl(var(--accent))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ThemeAwareChart>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card text-card-foreground border-border transition-colors duration-300 ease-in-out">
              <CardHeader>
                <CardTitle>Weekly Learning Hours</CardTitle>
                <CardDescription>Your study time throughout the week</CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeAwareChart>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyProgressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                      />
                      <Bar dataKey="hours" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ThemeAwareChart>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`bg-card text-card-foreground border-border transition-colors duration-300 ease-in-out ${achievement.earned ? "ring-2 ring-accent/20" : "opacity-60"}`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{achievement.icon}</div>
                    <h3 className="font-semibold mb-2">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                    {achievement.earned ? (
                      <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                        Earned {achievement.earnedDate}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-muted-foreground/20">
                        Not earned yet
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
