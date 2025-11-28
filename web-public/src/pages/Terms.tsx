import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Terms() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-8">Last updated: November 2024</p>

        <div className="space-y-8">
          <Card>
            <CardHeader><CardTitle>1. Acceptance of Terms</CardTitle></CardHeader>
            <CardContent className="text-[hsl(var(--muted-foreground))]">
              <p>By accessing or using EduLens, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>2. Description of Service</CardTitle></CardHeader>
            <CardContent className="text-[hsl(var(--muted-foreground))] space-y-4">
              <p>EduLens provides a platform for parents to discover, compare, and review schools. Our services include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>School search and discovery</li>
                <li>School comparison tools</li>
                <li>User reviews and ratings</li>
                <li>ETI Score and school analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>3. User Accounts</CardTitle></CardHeader>
            <CardContent className="text-[hsl(var(--muted-foreground))] space-y-4">
              <p>To access certain features, you must create an account. You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>4. User Content</CardTitle></CardHeader>
            <CardContent className="text-[hsl(var(--muted-foreground))]">
              <p>When you submit reviews or other content, you agree that your content is accurate, not misleading, and you grant us a license to use and display it.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>5. Prohibited Activities</CardTitle></CardHeader>
            <CardContent className="text-[hsl(var(--muted-foreground))] space-y-4">
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the service for any illegal purpose</li>
                <li>Post spam, fake reviews, or misleading information</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>6. Contact</CardTitle></CardHeader>
            <CardContent className="text-[hsl(var(--muted-foreground))]">
              <p>For questions about these Terms, contact us at legal@edulens.in</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
