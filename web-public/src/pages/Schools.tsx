import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star, Shield, MapPin, Filter, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const schools = [
  { id: "1", name: "Delhi Public School", location: "Hyderabad", rating: 4.8, reviews: 234, board: "CBSE", type: "Co-ed", fees: "₹1,50,000/year", etiScore: 92 },
  { id: "2", name: "Oakridge International", location: "Bangalore", rating: 4.7, reviews: 189, board: "IB", type: "Co-ed", fees: "₹3,50,000/year", etiScore: 89 },
  { id: "3", name: "The Heritage School", location: "Mumbai", rating: 4.6, reviews: 156, board: "ICSE", type: "Co-ed", fees: "₹2,00,000/year", etiScore: 87 },
  { id: "4", name: "Kendriya Vidyalaya", location: "Delhi", rating: 4.5, reviews: 312, board: "CBSE", type: "Co-ed", fees: "₹5,000/year", etiScore: 85 },
  { id: "5", name: "Ryan International", location: "Pune", rating: 4.4, reviews: 198, board: "CBSE", type: "Co-ed", fees: "₹1,20,000/year", etiScore: 82 },
  { id: "6", name: "Presidency School", location: "Chennai", rating: 4.3, reviews: 145, board: "State", type: "Co-ed", fees: "₹80,000/year", etiScore: 80 },
];

const boards = ["All", "CBSE", "ICSE", "IB", "State"];

export function Schools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("All");
  
  const filteredSchools = schools.filter((school) => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         school.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBoard = selectedBoard === "All" || school.board === selectedBoard;
    return matchesSearch && matchesBoard;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Schools</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Discover the best schools in your area
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
          <Input
            placeholder="Search by school name or location..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <span className="text-sm text-[hsl(var(--muted-foreground))]">Board:</span>
            {boards.map((board) => (
              <Button
                key={board}
                variant={selectedBoard === board ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBoard(board)}
              >
                {board}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
        Showing {filteredSchools.length} schools
      </p>

      {/* School Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchools.map((school) => (
          <Link key={school.id} to={`/schools/${school.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="aspect-video bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/5 flex items-center justify-center">
                <Award className="h-16 w-16 text-[hsl(var(--primary))]/40" />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{school.name}</h3>
                  <Badge variant="secondary">{school.board}</Badge>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] flex items-center mb-2">
                  <MapPin className="h-4 w-4 mr-1 shrink-0" /> {school.location}
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
                  {school.type} • {school.fees}
                </p>
                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-medium">{school.rating}</span>
                    <span className="text-sm text-[hsl(var(--muted-foreground))] ml-1">({school.reviews})</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-[hsl(var(--primary))] mr-1" />
                    <span className="text-sm font-medium">ETI: {school.etiScore}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredSchools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[hsl(var(--muted-foreground))]">No schools found matching your criteria.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setSelectedBoard("All"); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
