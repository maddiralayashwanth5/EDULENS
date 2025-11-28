import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Phone, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
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
    navigate("/");
  };

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
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              {step === "phone" ? "Enter your phone number to continue" : `Enter the OTP sent to +91 ${phoneNumber}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "phone" ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your 10-digit number"
                      className="pl-10"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      required
                    />
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">We'll send you a one-time password</p>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={phoneNumber.length !== 10 || isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending OTP...</>
                  ) : (
                    <>Continue <ArrowRight className="ml-2 h-4 w-4" /></>
                  )}
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
                    <button type="button" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]" onClick={() => setStep("phone")}>
                      Change number
                    </button>
                    <button type="button" className="text-[hsl(var(--primary))] hover:underline">Resend OTP</button>
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={otp.length !== 6 || isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : "Verify & Login"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
              Don't have an account?{" "}
              <Link to="/register" className="text-[hsl(var(--primary))] hover:underline font-medium">Sign up</Link>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-[hsl(var(--muted-foreground))]">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="underline hover:text-[hsl(var(--primary))]">Terms</Link> and{" "}
          <Link to="/privacy" className="underline hover:text-[hsl(var(--primary))]">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
