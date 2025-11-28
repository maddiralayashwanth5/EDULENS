import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Phone, User, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Register() {
  const [step, setStep] = useState<"details" | "otp" | "success">("details");
  const [formData, setFormData] = useState({ name: "", phoneNumber: "" });
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep("otp");
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to EduLens!</h1>
          <p className="text-[hsl(var(--muted-foreground))] mb-8">Your account has been created successfully.</p>
          <div className="space-y-3">
            <Link to="/schools"><Button className="w-full" size="lg">Browse Schools</Button></Link>
            <Link to="/"><Button variant="outline" className="w-full" size="lg">Go to Home</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <GraduationCap className="h-10 w-10 text-[hsl(var(--primary))]" />
            <span className="text-2xl font-bold text-[hsl(var(--primary))]">EduLens</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              {step === "details" ? "Join thousands of parents finding the best schools" : `Enter the OTP sent to +91 ${formData.phoneNumber}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "details" ? (
              <form onSubmit={handleSubmitDetails} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your 10-digit number"
                      className="pl-10"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={!formData.name || formData.phoneNumber.length !== 10 || isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : <>Continue <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium">Enter OTP</label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="text-center text-2xl tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    required
                  />
                  <div className="flex justify-between text-sm">
                    <button type="button" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]" onClick={() => setStep("details")}>
                      Change number
                    </button>
                    <button type="button" className="text-[hsl(var(--primary))] hover:underline">Resend OTP</button>
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={otp.length !== 6 || isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : "Verify & Create Account"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
              Already have an account?{" "}
              <Link to="/login" className="text-[hsl(var(--primary))] hover:underline font-medium">Sign in</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
