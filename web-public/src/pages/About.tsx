import { Link } from "react-router-dom";
import { GraduationCap, Target, Eye, Heart, Users, Shield, Award, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const values = [
  { icon: Shield, title: "Transparency", description: "Honest, unbiased information for informed decisions." },
  { icon: Heart, title: "Trust", description: "Verified reviews and accurate school data." },
  { icon: Users, title: "Community", description: "Parents sharing experiences and supporting each other." },
  { icon: Award, title: "Excellence", description: "Striving for the best in everything we do." },
];

const milestones = [
  { year: "2020", title: "Founded", description: "EduLens was born with a mission to simplify school discovery" },
  { year: "2021", title: "1,000 Schools", description: "Reached our first milestone of listing 1,000 schools" },
  { year: "2022", title: "ETI Score Launch", description: "Introduced our proprietary Education Trust Index" },
  { year: "2023", title: "50,000 Users", description: "Crossed 50,000 active parents on our platform" },
  { year: "2024", title: "Pan-India Expansion", description: "Expanded to cover 100+ cities across India" },
];

export function About() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[hsl(var(--primary))]/10 via-white to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[hsl(var(--primary))]/10 mb-6">
              <GraduationCap className="h-8 w-8 text-[hsl(var(--primary))]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About EduLens</h1>
            <p className="text-xl text-[hsl(var(--muted-foreground))]">
              We're on a mission to help every parent find the perfect school for their child.
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
                <div className="h-12 w-12 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-[hsl(var(--primary))]" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[hsl(var(--muted-foreground))] text-lg leading-relaxed">
                  To democratize access to quality education information, empowering parents 
                  with the tools and insights they need to make the best educational choices.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-[hsl(var(--primary))]" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[hsl(var(--muted-foreground))] text-lg leading-relaxed">
                  To become India's most trusted platform for school discovery, where every 
                  parent can confidently find schools that align with their values and aspirations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[hsl(var(--muted))]/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-[hsl(var(--muted-foreground))]">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <CardHeader>
                  <div className="h-14 w-14 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-[hsl(var(--primary))]" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[hsl(var(--muted-foreground))]">{value.description}</p>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The ETI Score</h2>
              <p className="text-lg text-[hsl(var(--muted-foreground))] mb-6">
                Our proprietary Education Trust Index (ETI) evaluates schools across multiple 
                dimensions to give you an objective measure of school quality.
              </p>
              <ul className="space-y-4 mb-8">
                {["Academic performance", "Infrastructure", "Teacher qualifications", "Parent satisfaction", "Safety measures", "Extracurricular activities"].map((item) => (
                  <li key={item} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/schools">
                <Button>
                  Explore Schools <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/5 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <Shield className="h-20 w-20 text-[hsl(var(--primary))] mx-auto mb-4" />
                  <div className="text-6xl font-bold text-[hsl(var(--primary))]">92</div>
                  <div className="text-lg text-[hsl(var(--muted-foreground))]">ETI Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[hsl(var(--muted))]/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center font-bold">
                    {milestone.year.slice(-2)}
                  </div>
                  {index < milestones.length - 1 && <div className="w-0.5 flex-1 bg-[hsl(var(--primary))]/20 mt-2" />}
                </div>
                <div className="flex-1 pb-8">
                  <div className="text-sm text-[hsl(var(--primary))] font-medium mb-1">{milestone.year}</div>
                  <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                  <p className="text-[hsl(var(--muted-foreground))]">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[hsl(var(--primary))] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg opacity-90 mb-8">Have questions? We'd love to hear from you.</p>
          <Link to="/contact">
            <Button size="lg" variant="secondary">Contact Us</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
