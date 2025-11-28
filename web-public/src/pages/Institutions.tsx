import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star, Shield, MapPin, Filter, School, GraduationCap, Landmark, BookOpen, Library, Briefcase, Baby, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const institutionTypes = [
  { value: "all", label: "All", icon: Filter },
  { value: "school", label: "Schools", icon: School },
  { value: "college", label: "Colleges", icon: GraduationCap },
  { value: "university", label: "Universities", icon: Landmark },
  { value: "coaching", label: "Coaching", icon: BookOpen },
  { value: "society", label: "Societies", icon: Library },
  { value: "vocational", label: "Vocational", icon: Briefcase },
  { value: "preschool", label: "Preschools", icon: Baby },
  { value: "online", label: "Online", icon: Monitor },
];

const institutions = [
  { id: "1", name: "Delhi Public School", type: "school", location: "Hyderabad", state: "Telangana", rating: 4.8, reviews: 234, board: "CBSE", etiScore: 92, fees: "₹1,50,000/year" },
  { id: "2", name: "IIT Bombay", type: "university", location: "Mumbai", state: "Maharashtra", rating: 4.9, reviews: 1250, board: "UGC", etiScore: 98, fees: "₹2,00,000/year" },
  { id: "3", name: "St. Xavier's College", type: "college", location: "Kolkata", state: "West Bengal", rating: 4.7, reviews: 890, board: "NAAC A+", etiScore: 91, fees: "₹50,000/year" },
  { id: "4", name: "ALLEN Career Institute", type: "coaching", location: "Kota", state: "Rajasthan", rating: 4.5, reviews: 3450, board: "JEE/NEET", etiScore: 88, fees: "₹1,80,000/year" },
  { id: "5", name: "Pratham Education Foundation", type: "society", location: "Mumbai", state: "Maharashtra", rating: 4.8, reviews: 156, board: "NGO", etiScore: 95, fees: "Free" },
  { id: "6", name: "ITI Bangalore", type: "vocational", location: "Bangalore", state: "Karnataka", rating: 4.2, reviews: 234, board: "NCVT", etiScore: 82, fees: "₹15,000/year" },
  { id: "7", name: "Oakridge International", type: "school", location: "Bangalore", state: "Karnataka", rating: 4.7, reviews: 189, board: "IB", etiScore: 89, fees: "₹3,50,000/year" },
  { id: "8", name: "BITS Pilani", type: "university", location: "Pilani", state: "Rajasthan", rating: 4.8, reviews: 2100, board: "UGC", etiScore: 96, fees: "₹4,50,000/year" },
  { id: "9", name: "Kidzee", type: "preschool", location: "Multiple Cities", state: "Pan India", rating: 4.3, reviews: 5600, board: "Private", etiScore: 78, fees: "₹60,000/year" },
  { id: "10", name: "BYJU'S", type: "online", location: "Bangalore", state: "Karnataka", rating: 4.0, reviews: 15000, board: "EdTech", etiScore: 75, fees: "₹30,000/year" },
  { id: "11", name: "Resonance", type: "coaching", location: "Kota", state: "Rajasthan", rating: 4.4, reviews: 2800, board: "JEE/NEET", etiScore: 86, fees: "₹1,50,000/year" },
  { id: "12", name: "Christ University", type: "university", location: "Bangalore", state: "Karnataka", rating: 4.6, reviews: 1800, board: "UGC", etiScore: 90, fees: "₹1,20,000/year" },
];

const typeColors: Record<string, string> = {
  school: "bg-blue-100 text-blue-800",
  college: "bg-purple-100 text-purple-800",
  university: "bg-indigo-100 text-indigo-800",
  coaching: "bg-orange-100 text-orange-800",
  society: "bg-green-100 text-green-800",
  vocational: "bg-yellow-100 text-yellow-800",
  preschool: "bg-pink-100 text-pink-800",
  online: "bg-cyan-100 text-cyan-800",
};

export function Institutions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const filteredInstitutions = institutions.filter((inst) => {
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inst.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || inst.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type: string) => {
    const typeInfo = institutionTypes.find(t => t.value === type);
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[type] || "bg-gray-100 text-gray-800"}`}>
        {typeInfo?.label || type}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Educational Institutions</h1>
        <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
          Discover schools, colleges, universities, coaching centers, and more across India
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
          <Input
            placeholder="Search by name or location..."
            className="pl-12 h-12 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Type Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {institutionTypes.map((type) => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type.value)}
            className="flex items-center gap-2"
          >
            <type.icon className="h-4 w-4" />
            {type.label}
          </Button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6 text-center">
        Showing {filteredInstitutions.length} institutions
      </p>

      {/* Institution Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstitutions.map((inst) => (
          <Link key={inst.id} to={`/institution/${inst.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="aspect-video bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/5 flex items-center justify-center relative">
                {(() => {
                  const TypeIcon = institutionTypes.find(t => t.value === inst.type)?.icon || School;
                  return <TypeIcon className="h-16 w-16 text-[hsl(var(--primary))]/40" />;
                })()}
                <div className="absolute top-3 left-3">
                  {getTypeBadge(inst.type)}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg line-clamp-1">{inst.name}</h3>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] flex items-center mb-1">
                  <MapPin className="h-4 w-4 mr-1 shrink-0" /> {inst.location}, {inst.state}
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
                  <Badge variant="outline" className="mr-2">{inst.board}</Badge>
                  {inst.fees}
                </p>
                <div className="flex justify-between items-center pt-3 border-t">
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

      {filteredInstitutions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[hsl(var(--muted-foreground))]">No institutions found matching your criteria.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setSelectedType("all"); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
