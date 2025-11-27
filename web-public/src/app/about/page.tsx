import Link from "next/link";
import { 
  GraduationCap, Target, Eye, Heart, Users, Shield, 
  Award, CheckCircle, ArrowRight, Mail, MapPin, Phone 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const values = [
  {
    icon: Shield,
    title: "Transparency",
    description: "We believe in providing honest, unbiased information to help parents make informed decisions.",
  },
  {
    icon: Heart,
    title: "Trust",
    description: "Building trust through verified reviews and accurate school data is at our core.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We foster a community where parents can share experiences and support each other.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in everything we do, from data accuracy to user experience.",
  },
];

const team = [
  { name: "Rahul Sharma", role: "Founder & CEO", initials: "RS" },
  { name: "Priya Patel", role: "Chief Product Officer", initials: "PP" },
  { name: "Amit Kumar", role: "Head of Engineering", initials: "AK" },
  { name: "Sneha Reddy", role: "Head of Operations", initials: "SR" },
];

const milestones = [
  { year: "2020", title: "Founded", description: "EduLens was born with a mission to simplify school discovery" },
  { year: "2021", title: "1,000 Schools", description: "Reached our first milestone of listing 1,000 schools" },
  { year: "2022", title: "ETI Score Launch", description: "Introduced our proprietary Education Trust Index" },
  { year: "2023", title: "50,000 Users", description: "Crossed 50,000 active parents on our platform" },
  { year: "2024", title: "Pan-India Expansion", description: "Expanded to cover 100+ cities across India" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About EduLens
            </h1>
            <p className="text-xl text-muted-foreground">
              We&apos;re on a mission to help every parent find the perfect school for their child 
              through transparent information and community-driven insights.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To democratize access to quality education information, empowering parents 
                  with the tools and insights they need to make the best educational choices 
                  for their children, regardless of their background or location.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To become India&apos;s most trusted platform for school discovery, where every 
                  parent can confidently find schools that align with their values, budget, 
                  and aspirations for their child&apos;s future.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at EduLens
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <CardHeader>
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ETI Score */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The ETI Score
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our proprietary Education Trust Index (ETI) is a comprehensive scoring system 
                that evaluates schools across multiple dimensions to give you an objective 
                measure of school quality.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Academic performance and results",
                  "Infrastructure and facilities",
                  "Teacher qualifications and experience",
                  "Parent and student satisfaction",
                  "Safety and security measures",
                  "Extracurricular activities",
                ].map((item) => (
                  <li key={item} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild>
                <Link href="/eti-score">
                  Learn More About ETI <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <Shield className="h-20 w-20 text-primary mx-auto mb-4" />
                  <div className="text-6xl font-bold text-primary">92</div>
                  <div className="text-lg text-muted-foreground">ETI Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From a simple idea to India&apos;s leading school discovery platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {milestone.year.slice(-2)}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-primary/20 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="text-sm text-primary font-medium mb-1">{milestone.year}</div>
                  <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the passionate people behind EduLens
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {team.map((member) => (
              <Card key={member.name} className="text-center">
                <CardContent className="pt-6">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Have questions or feedback? We&apos;d love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              <span>hello@edulens.in</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              <span>+91 80 1234 5678</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>Bangalore, India</span>
            </div>
          </div>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
