import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Privacy() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-8">Last updated: November 2024</p>

        <div className="space-y-8">
          <Card>
            <CardHeader><CardTitle>1. Information We Collect</CardTitle></CardHeader>
            <CardContent className="text-[hsl(var(--muted-foreground))] space-y-4">
              <p>We collect information you provide directly to us, such as when you create an account, submit a review, or contact us.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal information (name, phone number, email)</li>
                <li>Account credentials</li>
                <li>Reviews and ratings you submit</li>
                <li>Device and usage information</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>2. How We Use Your Information</CardTitle></CardHeader>
            <CardContent className="text-[hsl(var(--muted-foreground))] space-y-4">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Protect against fraudulent or illegal activity</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>3. Information Sharing</CardTitle></CardHeader>
            <CardContent className="text-[hsl(var(--muted-foreground))]">
              <p>We do not sell, trade, or transfer your personal information to third parties without your consent, except as described in this policy or as required by law.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>4. Data Security</CardTitle></CardHeader>
            <CardContent className="text-[hsl(var(--muted-foreground))]">
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>5. Contact Us</CardTitle></CardHeader>
            <CardContent className="text-[hsl(var(--muted-foreground))]">
              <p>For questions about this Privacy Policy, contact us at privacy@edulens.in</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
