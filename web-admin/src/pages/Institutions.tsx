import { useState } from "react";
import { Search, Plus, Eye, Edit, Trash2, CheckCircle, XCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const institutionTypes = [
  { value: "all", label: "All Types" },
  { value: "school", label: "Schools" },
  { value: "college", label: "Colleges" },
  { value: "university", label: "Universities" },
  { value: "coaching", label: "Coaching Centers" },
  { value: "society", label: "Educational Societies" },
  { value: "vocational", label: "Vocational Institutes" },
  { value: "preschool", label: "Preschools & Daycare" },
  { value: "special", label: "Special Education" },
  { value: "online", label: "Online Learning Platforms" },
];

const institutions = [
  { id: 1, name: "Delhi Public School", type: "school", city: "Hyderabad", state: "Telangana", board: "CBSE", status: "verified", students: 3500, rating: 4.8, established: 1995 },
  { id: 2, name: "IIT Bombay", type: "university", city: "Mumbai", state: "Maharashtra", board: "UGC", status: "verified", students: 12000, rating: 4.9, established: 1958 },
  { id: 3, name: "St. Xavier's College", type: "college", city: "Kolkata", state: "West Bengal", board: "NAAC A+", status: "verified", students: 8000, rating: 4.7, established: 1860 },
  { id: 4, name: "ALLEN Career Institute", type: "coaching", city: "Kota", state: "Rajasthan", board: "Private", status: "verified", students: 150000, rating: 4.5, established: 1988 },
  { id: 5, name: "Pratham Education Foundation", type: "society", city: "Mumbai", state: "Maharashtra", board: "NGO", status: "verified", students: 500000, rating: 4.8, established: 1995 },
  { id: 6, name: "ITI Bangalore", type: "vocational", city: "Bangalore", state: "Karnataka", board: "NCVT", status: "pending", students: 2000, rating: 4.2, established: 1972 },
  { id: 7, name: "Oakridge International", type: "school", city: "Bangalore", state: "Karnataka", board: "IB", status: "verified", students: 2800, rating: 4.7, established: 2002 },
  { id: 8, name: "BITS Pilani", type: "university", city: "Pilani", state: "Rajasthan", board: "UGC", status: "verified", students: 15000, rating: 4.8, established: 1964 },
  { id: 9, name: "Kidzee Preschool", type: "preschool", city: "Multiple", state: "Pan India", board: "Private", status: "verified", students: 200000, rating: 4.3, established: 2003 },
  { id: 10, name: "BYJU'S", type: "online", city: "Bangalore", state: "Karnataka", board: "EdTech", status: "verified", students: 15000000, rating: 4.0, established: 2011 },
  { id: 11, name: "National Institute for Empowerment", type: "special", city: "Secunderabad", state: "Telangana", board: "Govt", status: "verified", students: 500, rating: 4.6, established: 1984 },
  { id: 12, name: "Resonance Eduventures", type: "coaching", city: "Kota", state: "Rajasthan", board: "Private", status: "pending", students: 80000, rating: 4.4, established: 2001 },
];

const typeColors: Record<string, string> = {
  school: "bg-blue-100 text-blue-800",
  college: "bg-purple-100 text-purple-800",
  university: "bg-indigo-100 text-indigo-800",
  coaching: "bg-orange-100 text-orange-800",
  society: "bg-green-100 text-green-800",
  vocational: "bg-yellow-100 text-yellow-800",
  preschool: "bg-pink-100 text-pink-800",
  special: "bg-teal-100 text-teal-800",
  online: "bg-cyan-100 text-cyan-800",
};

export function Institutions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInstitutions = institutions.filter((inst) => {
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inst.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || inst.type === typeFilter;
    const matchesStatus = statusFilter === "all" || inst.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
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

  const getTypeBadge = (type: string) => {
    const label = institutionTypes.find(t => t.value === type)?.label || type;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[type] || "bg-gray-100 text-gray-800"}`}>
        {label}
      </span>
    );
  };

  const stats = [
    { label: "Total", value: institutions.length },
    { label: "Schools", value: institutions.filter(i => i.type === "school").length },
    { label: "Colleges", value: institutions.filter(i => i.type === "college").length },
    { label: "Universities", value: institutions.filter(i => i.type === "university").length },
    { label: "Coaching", value: institutions.filter(i => i.type === "coaching").length },
    { label: "Others", value: institutions.filter(i => !["school", "college", "university", "coaching"].includes(i.type)).length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">All Institutions</h1>
          <p className="text-[hsl(var(--muted-foreground))]">
            Manage schools, colleges, universities, coaching centers, and more
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Institution
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
              <Input
                placeholder="Search by name, city, or state..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-48">
              {institutionTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </Select>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Institutions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Institutions ({filteredInstitutions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Institution</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Board/Affiliation</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Students</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Rating</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstitutions.map((inst) => (
                  <tr key={inst.id} className="border-b hover:bg-[hsl(var(--muted))]/50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{inst.name}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">Est. {inst.established}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">{getTypeBadge(inst.type)}</td>
                    <td className="py-4 px-4">
                      <div>
                        <p>{inst.city}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">{inst.state}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4"><Badge variant="outline">{inst.board}</Badge></td>
                    <td className="py-4 px-4">{inst.students.toLocaleString()}</td>
                    <td className="py-4 px-4">{inst.rating}</td>
                    <td className="py-4 px-4">{getStatusBadge(inst.status)}</td>
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
