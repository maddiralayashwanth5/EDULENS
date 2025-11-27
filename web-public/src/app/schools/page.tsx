"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Star, Shield, Filter, SlidersHorizontal, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Mock data - will be replaced with API calls
const schools = [
  {
    id: "1",
    name: "Delhi Public School",
    location: "Hyderabad, Telangana",
    address: "Survey No. 123, Jubilee Hills",
    board: "CBSE",
    type: "Private",
    rating: 4.8,
    reviewCount: 245,
    etiScore: 92,
    fees: "₹1,50,000/year",
    grades: "Nursery - 12th",
    established: 1995,
  },
  {
    id: "2",
    name: "Oakridge International School",
    location: "Bangalore, Karnataka",
    address: "Sarjapur Road, Bangalore",
    board: "IB",
    type: "Private",
    rating: 4.7,
    reviewCount: 189,
    etiScore: 89,
    fees: "₹3,50,000/year",
    grades: "Pre-K - 12th",
    established: 2002,
  },
  {
    id: "3",
    name: "The Heritage School",
    location: "Mumbai, Maharashtra",
    address: "Andheri West, Mumbai",
    board: "ICSE",
    type: "Private",
    rating: 4.6,
    reviewCount: 312,
    etiScore: 87,
    fees: "₹2,00,000/year",
    grades: "Nursery - 10th",
    established: 1988,
  },
  {
    id: "4",
    name: "Kendriya Vidyalaya",
    location: "Delhi, NCR",
    address: "R.K. Puram, New Delhi",
    board: "CBSE",
    type: "Government",
    rating: 4.5,
    reviewCount: 567,
    etiScore: 85,
    fees: "₹5,000/year",
    grades: "1st - 12th",
    established: 1963,
  },
  {
    id: "5",
    name: "Ryan International School",
    location: "Pune, Maharashtra",
    address: "Hinjewadi, Pune",
    board: "CBSE",
    type: "Private",
    rating: 4.4,
    reviewCount: 198,
    etiScore: 82,
    fees: "₹1,20,000/year",
    grades: "Nursery - 12th",
    established: 2005,
  },
  {
    id: "6",
    name: "Vidya Niketan School",
    location: "Chennai, Tamil Nadu",
    address: "T. Nagar, Chennai",
    board: "State Board",
    type: "Aided",
    rating: 4.3,
    reviewCount: 156,
    etiScore: 78,
    fees: "₹25,000/year",
    grades: "1st - 12th",
    established: 1972,
  },
];

const boards = ["All", "CBSE", "ICSE", "IB", "State Board", "IGCSE"];
const types = ["All", "Private", "Government", "Aided"];

export default function SchoolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  const filteredSchools = schools.filter((school) => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBoard = selectedBoard === "All" || school.board === selectedBoard;
    const matchesType = selectedType === "All" || school.type === selectedType;
    return matchesSearch && matchesBoard && matchesType;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Schools</h1>
        <p className="text-muted-foreground">
          Discover the best schools in your area
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by school name or location..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Desktop Filters */}
        <div className="hidden md:flex gap-2">
          <select
            className="px-4 py-2 border rounded-md bg-background"
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
          >
            {boards.map((board) => (
              <option key={board} value={board}>
                {board === "All" ? "All Boards" : board}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-md bg-background"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type === "All" ? "All Types" : type}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Filter Sheet */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Filter schools by board and type
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Board</label>
                <select
                  className="w-full px-4 py-2 border rounded-md bg-background"
                  value={selectedBoard}
                  onChange={(e) => setSelectedBoard(e.target.value)}
                >
                  {boards.map((board) => (
                    <option key={board} value={board}>
                      {board === "All" ? "All Boards" : board}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <select
                  className="w-full px-4 py-2 border rounded-md bg-background"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type === "All" ? "All Types" : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredSchools.length} schools
        </p>
      </div>

      {/* Schools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchools.map((school) => (
          <Card key={school.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Award className="h-12 w-12 text-primary/40" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-1">{school.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{school.location}</span>
                  </CardDescription>
                </div>
                <Badge variant="secondary">{school.board}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Ratings Row */}
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-semibold">{school.rating}</span>
                    <span className="text-muted-foreground ml-1">({school.reviewCount})</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-primary mr-1" />
                    <span className="font-semibold">{school.etiScore}</span>
                    <span className="text-muted-foreground ml-1">ETI</span>
                  </div>
                </div>

                {/* Info Row */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{school.grades}</span>
                  <span>{school.fees}</span>
                </div>

                {/* Tags */}
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">{school.type}</Badge>
                  <Badge variant="outline" className="text-xs">Est. {school.established}</Badge>
                </div>

                <Button className="w-full" variant="outline" asChild>
                  <Link href={`/schools/${school.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSchools.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No schools found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
