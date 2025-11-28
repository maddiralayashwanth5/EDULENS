import { useState } from "react";
import { Search, Plus, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const schools = [
  { id: 1, name: "Delhi Public School", city: "Hyderabad", board: "CBSE", status: "verified", students: 3500, rating: 4.8 },
  { id: 2, name: "Oakridge International", city: "Bangalore", board: "IB", status: "verified", students: 2800, rating: 4.7 },
  { id: 3, name: "The Heritage School", city: "Mumbai", board: "ICSE", status: "pending", students: 2200, rating: 4.6 },
  { id: 4, name: "Kendriya Vidyalaya", city: "Delhi", board: "CBSE", status: "verified", students: 4500, rating: 4.5 },
  { id: 5, name: "Ryan International", city: "Pune", board: "CBSE", status: "rejected", students: 1800, rating: 4.4 },
  { id: 6, name: "Modern Academy", city: "Chennai", board: "State", status: "pending", students: 1500, rating: 4.3 },
];

export function Schools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSchools = schools.filter((school) => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         school.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || school.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Schools</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Manage all registered schools</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add School
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
              <Input
                placeholder="Search schools..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Schools Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Schools ({filteredSchools.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">School</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">City</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Board</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Students</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Rating</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchools.map((school) => (
                  <tr key={school.id} className="border-b hover:bg-[hsl(var(--muted))]/50">
                    <td className="py-4 px-4">
                      <p className="font-medium">{school.name}</p>
                    </td>
                    <td className="py-4 px-4">{school.city}</td>
                    <td className="py-4 px-4"><Badge variant="outline">{school.board}</Badge></td>
                    <td className="py-4 px-4">{school.students.toLocaleString()}</td>
                    <td className="py-4 px-4">{school.rating}</td>
                    <td className="py-4 px-4">{getStatusBadge(school.status)}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
