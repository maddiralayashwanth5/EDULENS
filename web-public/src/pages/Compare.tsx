import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, X, Star, MapPin, Award, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const allSchools = [
  { id: "1", name: "Delhi Public School", location: "Hyderabad", board: "CBSE", rating: 4.8, etiScore: 92, fees: "₹1,50,000", students: 3500, ratio: "1:20", established: 1995, facilities: ["Smart Classrooms", "Science Labs", "Sports Complex", "Swimming Pool", "Library", "Cafeteria"] },
  { id: "2", name: "Oakridge International", location: "Bangalore", board: "IB", rating: 4.7, etiScore: 89, fees: "₹3,50,000", students: 2800, ratio: "1:15", established: 2002, facilities: ["Smart Classrooms", "Science Labs", "Sports Complex", "Swimming Pool", "Library", "Auditorium"] },
  { id: "3", name: "The Heritage School", location: "Mumbai", board: "ICSE", rating: 4.6, etiScore: 87, fees: "₹2,00,000", students: 2200, ratio: "1:18", established: 1988, facilities: ["Smart Classrooms", "Science Labs", "Library", "Playground", "Art Room"] },
  { id: "4", name: "Kendriya Vidyalaya", location: "Delhi", board: "CBSE", rating: 4.5, etiScore: 85, fees: "₹5,000", students: 4500, ratio: "1:35", established: 1963, facilities: ["Science Labs", "Library", "Playground", "Computer Lab"] },
];

const allFacilities = ["Smart Classrooms", "Science Labs", "Sports Complex", "Swimming Pool", "Library", "Cafeteria", "Auditorium", "Playground", "Art Room", "Computer Lab"];

type School = typeof allSchools[0];

export function Compare() {
  const [selectedSchools, setSelectedSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filteredSchools = allSchools.filter(
    (school) =>
      !selectedSchools.find((s) => s.id === school.id) &&
      (school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addSchool = (school: School) => {
    if (selectedSchools.length < 3) {
      setSelectedSchools([...selectedSchools, school]);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const removeSchool = (schoolId: string) => {
    setSelectedSchools(selectedSchools.filter((s) => s.id !== schoolId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Compare Schools</h1>
        <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
          Select up to 3 schools to compare them side by side.
        </p>
      </div>

      {/* School Selection */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[0, 1, 2].map((index) => (
          <div key={index}>
            {selectedSchools[index] ? (
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{selectedSchools[index].name}</CardTitle>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {selectedSchools[index].location}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeSchool(selectedSchools[index].id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Badge>{selectedSchools[index].board}</Badge>
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      {selectedSchools[index].rating}
                    </div>
                  </div>
                  <div className="aspect-video bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/5 rounded-lg flex items-center justify-center">
                    <Award className="h-12 w-12 text-[hsl(var(--primary))]/40" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card
                className="h-full border-dashed cursor-pointer hover:border-[hsl(var(--primary))] transition-colors"
                onClick={() => setShowSearch(true)}
              >
                <CardContent className="h-full min-h-[250px] flex flex-col items-center justify-center text-[hsl(var(--muted-foreground))]">
                  <Plus className="h-12 w-12 mb-4" />
                  <p className="font-medium">Add School {index + 1}</p>
                  <p className="text-sm">Click to select a school</p>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Select a School</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <Input
                  placeholder="Search schools..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {filteredSchools.map((school) => (
                  <div
                    key={school.id}
                    className="p-3 rounded-lg border hover:bg-[hsl(var(--muted))] cursor-pointer transition-colors"
                    onClick={() => addSchool(school)}
                  >
                    <div className="font-medium">{school.name}</div>
                    <div className="text-sm text-[hsl(var(--muted-foreground))] flex items-center justify-between">
                      <span>{school.location} • {school.board}</span>
                      <span className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                        {school.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Comparison Table */}
      {selectedSchools.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Criteria</th>
                    {selectedSchools.map((school) => (
                      <th key={school.id} className="text-left py-3 px-4 font-semibold">{school.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Rating</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="py-4 px-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="font-semibold">{school.rating}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">ETI Score</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="py-4 px-4">
                        <Badge variant="secondary">{school.etiScore}/100</Badge>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Board</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="py-4 px-4"><Badge>{school.board}</Badge></td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Annual Fees</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="py-4 px-4 font-semibold">{school.fees}</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Student:Teacher</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="py-4 px-4">{school.ratio}</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Established</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="py-4 px-4">{school.established}</td>
                    ))}
                  </tr>
                  {allFacilities.map((facility) => (
                    <tr key={facility} className="border-b">
                      <td className="py-3 px-4 text-sm">{facility}</td>
                      {selectedSchools.map((school) => (
                        <td key={school.id} className="py-3 px-4">
                          {school.facilities.includes(facility) ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-300" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedSchools.length < 2 && (
        <Card className="text-center py-12">
          <CardContent>
            <Award className="h-16 w-16 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Select at least 2 schools</h3>
            <p className="text-[hsl(var(--muted-foreground))] mb-6">Add schools above to start comparing</p>
            <Link to="/schools">
              <Button variant="outline">Browse Schools</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
