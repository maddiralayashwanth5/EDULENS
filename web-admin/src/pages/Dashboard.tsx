import { School, Users, MessageSquare, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  { title: "Total Schools", value: "1,234", change: "+12%", trend: "up", icon: School },
  { title: "Active Users", value: "45,678", change: "+8%", trend: "up", icon: Users },
  { title: "Reviews", value: "12,456", change: "+23%", trend: "up", icon: MessageSquare },
  { title: "Pending Complaints", value: "23", change: "-5%", trend: "down", icon: FileText },
];

const recentActivity = [
  { type: "school", message: "New school added: Delhi Public School, Mumbai", time: "2 mins ago" },
  { type: "review", message: "New review submitted for Oakridge International", time: "5 mins ago" },
  { type: "complaint", message: "Complaint resolved: #12345", time: "10 mins ago" },
  { type: "user", message: "New admin user registered", time: "15 mins ago" },
  { type: "school", message: "School verified: The Heritage School", time: "20 mins ago" },
];

const pendingVerifications = [
  { name: "ABC Public School", city: "Bangalore", submitted: "2 days ago" },
  { name: "XYZ International", city: "Chennai", submitted: "3 days ago" },
  { name: "Modern Academy", city: "Hyderabad", submitted: "5 days ago" },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-[hsl(var(--muted-foreground))]">Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="text-[hsl(var(--muted-foreground))] ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-[hsl(var(--primary))] mt-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Verifications */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Verifications</CardTitle>
            <CardDescription>Schools awaiting verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVerifications.map((school, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{school.name}</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{school.city}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{school.submitted}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
