import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const contactInfo = [
  { icon: Mail, title: "Email", value: "hello@edulens.in", description: "We'll respond within 24 hours" },
  { icon: Phone, title: "Phone", value: "+91 80 1234 5678", description: "Mon-Fri, 9am-6pm IST" },
  { icon: MapPin, title: "Office", value: "Bangalore, India", description: "HSR Layout, Sector 1" },
];

export function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Message Sent!</h1>
          <p className="text-[hsl(var(--muted-foreground))] mb-8">We'll get back to you within 24 hours.</p>
          <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>Fill out the form and we'll get back to you.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input id="name" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input id="subject" placeholder="How can we help?" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <textarea
                    id="message"
                    className="w-full min-h-[150px] px-3 py-2 border rounded-md bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    placeholder="Tell us more..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : <><Send className="mr-2 h-4 w-4" /> Send Message</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {contactInfo.map((info) => (
            <Card key={info.title}>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center mr-4">
                    <info.icon className="h-5 w-5 text-[hsl(var(--primary))]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{info.title}</h3>
                    <p className="text-[hsl(var(--primary))] font-medium">{info.value}</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{info.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
