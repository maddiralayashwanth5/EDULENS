"use client";

import { use } from "react";
import Link from "next/link";
import { 
  MapPin, Star, Shield, Phone, Mail, Globe, Clock, Users, 
  BookOpen, Award, Building, Calendar, ChevronLeft, Heart,
  Share2, Flag, MessageSquare, ThumbsUp, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data - will be replaced with API calls
const schoolData = {
  id: "1",
  name: "Delhi Public School",
  tagline: "Excellence in Education Since 1995",
  location: "Hyderabad, Telangana",
  address: "Survey No. 123, Jubilee Hills, Hyderabad - 500033",
  board: "CBSE",
  type: "Private",
  rating: 4.8,
  reviewCount: 245,
  etiScore: 92,
  fees: {
    nursery: "₹1,20,000/year",
    primary: "₹1,35,000/year",
    secondary: "₹1,50,000/year",
    senior: "₹1,65,000/year",
  },
  grades: "Nursery - 12th",
  established: 1995,
  students: 3500,
  teachers: 180,
  ratio: "1:20",
  phone: "+91 40 2355 1234",
  email: "info@dpshyderabad.edu.in",
  website: "www.dpshyderabad.edu.in",
  timing: "8:00 AM - 3:30 PM",
  facilities: [
    "Smart Classrooms", "Science Labs", "Computer Lab", "Library",
    "Sports Complex", "Swimming Pool", "Auditorium", "Cafeteria",
    "Transport", "Medical Room", "Playground", "Art Room"
  ],
  achievements: [
    "Ranked #1 in Hyderabad by Education Today 2024",
    "100% pass rate in Class 12 Board Exams",
    "National Science Olympiad Winners 2023",
    "Best Infrastructure Award 2022"
  ],
  description: `Delhi Public School, Hyderabad is one of the premier educational institutions in the city, 
    committed to providing holistic education that nurtures young minds. With state-of-the-art infrastructure 
    and a dedicated faculty, we strive to create an environment that fosters academic excellence, 
    creativity, and character development.`,
};

const reviews = [
  {
    id: 1,
    author: "Priya Sharma",
    rating: 5,
    date: "2 weeks ago",
    title: "Excellent school with great faculty",
    content: "My daughter has been studying here for 3 years and we are extremely happy with the school. The teachers are dedicated and the infrastructure is top-notch.",
    helpful: 24,
    verified: true,
  },
  {
    id: 2,
    author: "Rajesh Kumar",
    rating: 4,
    date: "1 month ago",
    title: "Good academics but fees are high",
    content: "The academic standards are excellent and my son has shown great improvement. However, the fees are on the higher side compared to other schools in the area.",
    helpful: 18,
    verified: true,
  },
  {
    id: 3,
    author: "Anita Reddy",
    rating: 5,
    date: "2 months ago",
    title: "Best decision for our child",
    content: "We moved from another city and choosing DPS was the best decision. The transition was smooth and the staff was very supportive.",
    helpful: 12,
    verified: false,
  },
];

export default function SchoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const school = schoolData; // In real app, fetch based on id

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Back Navigation */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <Link href="/schools" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Schools
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* School Image */}
            <div className="lg:w-1/3">
              <div className="aspect-video lg:aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Award className="h-24 w-24 text-primary/40" />
              </div>
            </div>

            {/* School Info */}
            <div className="lg:w-2/3">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge>{school.board}</Badge>
                <Badge variant="secondary">{school.type}</Badge>
                <Badge variant="outline">{school.grades}</Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{school.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">{school.tagline}</p>
              
              <div className="flex items-center text-muted-foreground mb-6">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{school.address}</span>
              </div>

              {/* Ratings */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center">
                  <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500 mr-1" />
                    <span className="font-bold text-lg">{school.rating}</span>
                  </div>
                  <span className="text-muted-foreground ml-2">({school.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full">
                    <Shield className="h-5 w-5 mr-1" />
                    <span className="font-bold text-lg">{school.etiScore}</span>
                  </div>
                  <span className="text-muted-foreground ml-2">ETI Score</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button size="lg">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact School
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  About the School
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{school.description}</p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Quick Facts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <Calendar className="h-8 w-8 mx-auto text-primary mb-2" />
                    <div className="font-bold text-xl">{school.established}</div>
                    <div className="text-sm text-muted-foreground">Established</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-8 w-8 mx-auto text-primary mb-2" />
                    <div className="font-bold text-xl">{school.students.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </div>
                  <div className="text-center">
                    <Award className="h-8 w-8 mx-auto text-primary mb-2" />
                    <div className="font-bold text-xl">{school.teachers}</div>
                    <div className="text-sm text-muted-foreground">Teachers</div>
                  </div>
                  <div className="text-center">
                    <BookOpen className="h-8 w-8 mx-auto text-primary mb-2" />
                    <div className="font-bold text-xl">{school.ratio}</div>
                    <div className="text-sm text-muted-foreground">Student:Teacher</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Facilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {school.facilities.map((facility) => (
                    <Badge key={facility} variant="secondary" className="text-sm py-1 px-3">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {facility}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {school.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Reviews ({school.reviewCount})
                  </CardTitle>
                  <Button>Write a Review</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback>{review.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <span className="font-semibold">{review.author}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified Parent
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="ml-2">{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-semibold mb-2">{review.title}</h4>
                    <p className="text-muted-foreground mb-3">{review.content}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center text-muted-foreground hover:text-primary">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful ({review.helpful})
                      </button>
                      <button className="flex items-center text-muted-foreground hover:text-primary">
                        <Flag className="h-4 w-4 mr-1" />
                        Report
                      </button>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  View All Reviews
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Fee Structure */}
            <Card>
              <CardHeader>
                <CardTitle>Fee Structure</CardTitle>
                <CardDescription>Annual fees by grade level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nursery - KG</span>
                  <span className="font-semibold">{school.fees.nursery}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class 1-5</span>
                  <span className="font-semibold">{school.fees.primary}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class 6-10</span>
                  <span className="font-semibold">{school.fees.secondary}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class 11-12</span>
                  <span className="font-semibold">{school.fees.senior}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-primary mr-3" />
                  <span>{school.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-primary mr-3" />
                  <span className="text-sm">{school.email}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-primary mr-3" />
                  <a href={`https://${school.website}`} className="text-primary hover:underline">
                    {school.website}
                  </a>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-3" />
                  <span>{school.timing}</span>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-muted-foreground" />
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            {/* Report */}
            <Card>
              <CardContent className="pt-6">
                <Button variant="ghost" className="w-full text-muted-foreground">
                  <Flag className="h-4 w-4 mr-2" />
                  Report incorrect information
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
