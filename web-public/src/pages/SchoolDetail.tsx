import { useParams, Link } from "react-router-dom";
import { Star, Shield, MapPin, Phone, Mail, Globe, Award, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data
const schoolData = {
  id: "1",
  name: "Delhi Public School",
  location: "Jubilee Hills, Hyderabad",
  rating: 4.8,
  reviews: 234,
  board: "CBSE",
  type: "Co-ed",
  established: 1995,
  etiScore: 92,
  description: "Delhi Public School, Hyderabad is one of the premier educational institutions in the city, known for its academic excellence and holistic development approach.",
  fees: { nursery: "₹1,20,000", primary: "₹1,50,000", secondary: "₹1,80,000" },
  facilities: ["Smart Classrooms", "Science Labs", "Computer Lab", "Library", "Sports Complex", "Swimming Pool", "Auditorium", "Cafeteria"],
  contact: { phone: "+91 40 2355 1234", email: "info@dpshyderabad.com", website: "www.dpshyderabad.com" },
  timing: "8:00 AM - 3:30 PM",
  studentTeacherRatio: "20:1",
};

const reviews = [
  { id: 1, author: "Priya S.", rating: 5, date: "2 weeks ago", text: "Excellent school with great faculty. My child has shown tremendous improvement." },
  { id: 2, author: "Rahul M.", rating: 4, date: "1 month ago", text: "Good infrastructure and teaching methods. Could improve on extracurricular activities." },
  { id: 3, author: "Anita K.", rating: 5, date: "2 months ago", text: "Best decision we made for our child's education. Highly recommended!" },
];

export function SchoolDetail() {
  const { id: _id } = useParams(); // Will be used for API calls

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/schools" className="inline-flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Schools
      </Link>

      {/* Header */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="aspect-video bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/5 rounded-lg flex items-center justify-center mb-6">
            <Award className="h-24 w-24 text-[hsl(var(--primary))]/40" />
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>{schoolData.board}</Badge>
            <Badge variant="secondary">{schoolData.type}</Badge>
            <Badge variant="outline">Est. {schoolData.established}</Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">{schoolData.name}</h1>
          <p className="text-[hsl(var(--muted-foreground))] flex items-center mb-4">
            <MapPin className="h-4 w-4 mr-1" /> {schoolData.location}
          </p>
          <p className="text-[hsl(var(--muted-foreground))]">{schoolData.description}</p>
        </div>

        {/* Quick Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[hsl(var(--muted-foreground))]">Rating</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="font-semibold">{schoolData.rating}</span>
                <span className="text-sm text-[hsl(var(--muted-foreground))] ml-1">({schoolData.reviews})</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[hsl(var(--muted-foreground))]">ETI Score</span>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-[hsl(var(--primary))] mr-1" />
                <span className="font-semibold">{schoolData.etiScore}/100</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[hsl(var(--muted-foreground))]">Student:Teacher</span>
              <span className="font-semibold">{schoolData.studentTeacherRatio}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[hsl(var(--muted-foreground))]">Timing</span>
              <span className="font-semibold">{schoolData.timing}</span>
            </div>
            <div className="pt-4 border-t space-y-2">
              <Button className="w-full">Contact School</Button>
              <Button variant="outline" className="w-full">Write a Review</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Fees */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fee Structure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[hsl(var(--muted-foreground))]">Nursery</span>
              <span className="font-medium">{schoolData.fees.nursery}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[hsl(var(--muted-foreground))]">Primary</span>
              <span className="font-medium">{schoolData.fees.primary}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[hsl(var(--muted-foreground))]">Secondary</span>
              <span className="font-medium">{schoolData.fees.secondary}</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-[hsl(var(--muted-foreground))]" />
              <span>{schoolData.contact.phone}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-[hsl(var(--muted-foreground))]" />
              <span>{schoolData.contact.email}</span>
            </div>
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-[hsl(var(--muted-foreground))]" />
              <span>{schoolData.contact.website}</span>
            </div>
          </CardContent>
        </Card>

        {/* Facilities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {schoolData.facilities.map((facility) => (
                <Badge key={facility} variant="secondary">{facility}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Parent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium">{review.author}</span>
                    <span className="text-sm text-[hsl(var(--muted-foreground))] ml-2">{review.date}</span>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[hsl(var(--muted-foreground))]">{review.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
