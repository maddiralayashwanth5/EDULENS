import { Link } from "react-router-dom";
import { Search, Star, Shield, Users, BookOpen, Award, ArrowRight, MapPin, School, GraduationCap, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const stats = [
  { value: "15,000+", label: "Institutions Listed" },
  { value: "75,000+", label: "Reviews" },
  { value: "200+", label: "Cities Covered" },
  { value: "4.7/5", label: "Average Rating" },
];

const features = [
  { icon: Shield, title: "Verified Information", description: "All institution data is verified and regularly updated" },
  { icon: Star, title: "Authentic Reviews", description: "Real reviews from verified students and parents" },
  { icon: Users, title: "Community Driven", description: "Join thousands making informed education decisions" },
  { icon: BookOpen, title: "Comprehensive Data", description: "Detailed information on courses, fees, and facilities" },
];

const categories = [
  { icon: School, label: "Schools", count: "8,000+", href: "/institutions?type=school" },
  { icon: GraduationCap, label: "Colleges", count: "3,500+", href: "/institutions?type=college" },
  { icon: Landmark, label: "Universities", count: "800+", href: "/institutions?type=university" },
  { icon: BookOpen, label: "Coaching", count: "2,500+", href: "/institutions?type=coaching" },
];

const topInstitutions = [
  { id: "1", name: "Delhi Public School", type: "School", location: "Hyderabad", rating: 4.8, reviews: 234, board: "CBSE", etiScore: 92 },
  { id: "2", name: "IIT Bombay", type: "University", location: "Mumbai", rating: 4.9, reviews: 1250, board: "UGC", etiScore: 98 },
  { id: "3", name: "ALLEN Career Institute", type: "Coaching", location: "Kota", rating: 4.5, reviews: 3450, board: "JEE/NEET", etiScore: 88 },
];

export function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[hsl(var(--primary))]/10 via-white to-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Trusted by 75,000+ Users</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Find the Perfect Educational Institution
            </h1>
            <p className="text-xl text-[hsl(var(--muted-foreground))] mb-8">
              Discover schools, colleges, universities, coaching centers, and more. 
              Make informed decisions with verified information and real reviews.
            </p>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                <Input 
                  placeholder="Search institutions by name or location..." 
                  className="pl-10 h-12"
                />
              </div>
              <Link to="/institutions">
                <Button size="lg" className="w-full sm:w-auto h-12">
                  Explore All
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-[hsl(var(--muted))]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))]">{stat.value}</div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose EduLens?</h2>
            <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
              We provide the most comprehensive and reliable school information platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-[hsl(var(--primary))]" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-[hsl(var(--muted))]/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Explore by Category</h2>
            <p className="text-[hsl(var(--muted-foreground))]">Find the right institution for your needs</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.label} to={cat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer text-center p-6">
                  <cat.icon className="h-12 w-12 mx-auto mb-3 text-[hsl(var(--primary))]" />
                  <h3 className="font-semibold mb-1">{cat.label}</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{cat.count}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Institutions Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Top Rated Institutions</h2>
              <p className="text-[hsl(var(--muted-foreground))]">Highest rated across all categories</p>
            </div>
            <Link to="/institutions">
              <Button variant="outline">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {topInstitutions.map((inst) => (
              <Link key={inst.id} to={`/institution/${inst.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/5 flex items-center justify-center">
                    <Award className="h-16 w-16 text-[hsl(var(--primary))]/40" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{inst.name}</h3>
                      <Badge variant="secondary">{inst.type}</Badge>
                    </div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] flex items-center mb-1">
                      <MapPin className="h-4 w-4 mr-1" /> {inst.location}
                    </p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
                      <Badge variant="outline" className="text-xs">{inst.board}</Badge>
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-medium">{inst.rating}</span>
                        <span className="text-sm text-[hsl(var(--muted-foreground))] ml-1">({inst.reviews.toLocaleString()})</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-[hsl(var(--primary))] mr-1" />
                        <span className="text-sm font-medium">ETI: {inst.etiScore}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[hsl(var(--primary))] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find the Perfect School?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of parents who have found the right school for their children using EduLens.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/schools">
              <Button size="lg" variant="secondary">Browse Schools</Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[hsl(var(--primary))]">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
