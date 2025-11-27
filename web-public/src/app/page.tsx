import Link from "next/link";
import { Search, Star, Shield, TrendingUp, MapPin, Users, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find schools by location, board, fees, and more with our advanced search filters.",
  },
  {
    icon: Star,
    title: "Verified Reviews",
    description: "Read authentic reviews from parents and students to make informed decisions.",
  },
  {
    icon: Shield,
    title: "ETI Score",
    description: "Our proprietary Education Trust Index helps you evaluate school quality objectively.",
  },
  {
    icon: TrendingUp,
    title: "Compare Schools",
    description: "Side-by-side comparison of schools based on academics, infrastructure, and more.",
  },
];

const stats = [
  { value: "10,000+", label: "Schools Listed" },
  { value: "50,000+", label: "Parent Reviews" },
  { value: "100+", label: "Cities Covered" },
  { value: "4.8/5", label: "User Rating" },
];

const topSchools = [
  {
    id: 1,
    name: "Delhi Public School",
    location: "Hyderabad, Telangana",
    board: "CBSE",
    rating: 4.8,
    etiScore: 92,
    image: "/schools/dps.jpg",
  },
  {
    id: 2,
    name: "Oakridge International",
    location: "Bangalore, Karnataka",
    board: "IB",
    rating: 4.7,
    etiScore: 89,
    image: "/schools/oakridge.jpg",
  },
  {
    id: 3,
    name: "The Heritage School",
    location: "Mumbai, Maharashtra",
    board: "ICSE",
    rating: 4.6,
    etiScore: 87,
    image: "/schools/heritage.jpg",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              🎓 Trusted by 50,000+ Parents
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Find the <span className="text-primary">Perfect School</span> for Your Child
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Discover, compare, and review schools in your area. Make informed decisions 
              about your child&apos;s education with our comprehensive school database.
            </p>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Enter your city or area..." 
                  className="pl-10 h-12"
                />
              </div>
              <Button size="lg" className="h-12">
                <Search className="mr-2 h-5 w-5" />
                Search Schools
              </Button>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                CBSE Schools
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                ICSE Schools
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                IB Schools
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                State Board
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose EduLens?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need to find the best school for your child.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Schools Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Top Rated Schools
              </h2>
              <p className="text-muted-foreground">
                Discover the highest-rated schools in your area
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/schools">
                View All <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topSchools.map((school) => (
              <Card key={school.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Award className="h-16 w-16 text-primary/40" />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-1">{school.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {school.location}
                      </CardDescription>
                    </div>
                    <Badge>{school.board}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-semibold">{school.rating}</span>
                      <span className="text-muted-foreground ml-1">rating</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-primary mr-1" />
                      <span className="font-semibold">{school.etiScore}</span>
                      <span className="text-muted-foreground ml-1">ETI</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline" asChild>
                    <Link href={`/schools/${school.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find the Perfect School?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of parents who have found the best schools for their children using EduLens.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/schools">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Schools
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link href="/register">
                  <Users className="mr-2 h-5 w-5" />
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
