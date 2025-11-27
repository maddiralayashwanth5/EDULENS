import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: November 2024</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                By accessing or using EduLens, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                EduLens provides a platform for parents and guardians to discover, compare, 
                and review schools. Our services include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>School search and discovery</li>
                <li>School comparison tools</li>
                <li>User reviews and ratings</li>
                <li>ETI Score and school analytics</li>
                <li>Contact facilitation with schools</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>To access certain features, you must create an account. You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. User Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>When you submit reviews, ratings, or other content, you agree that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your content is accurate and based on genuine experience</li>
                <li>You will not post false, misleading, or defamatory content</li>
                <li>You grant us a license to use, display, and distribute your content</li>
                <li>We may remove content that violates these terms</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Prohibited Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the service for any illegal purpose</li>
                <li>Post spam, fake reviews, or misleading information</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the service</li>
                <li>Scrape or collect data without permission</li>
                <li>Impersonate others or misrepresent your affiliation</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. School Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                While we strive to provide accurate information, we do not guarantee the 
                accuracy, completeness, or timeliness of school data. Users should verify 
                information directly with schools before making decisions.
              </p>
              <p>
                The ETI Score is our proprietary metric and should be used as one of many 
                factors in your decision-making process.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                All content, features, and functionality of EduLens are owned by us and 
                protected by intellectual property laws. You may not copy, modify, or 
                distribute our content without permission.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                EduLens is provided &quot;as is&quot; without warranties of any kind. We are not 
                liable for any damages arising from your use of our services, including 
                decisions made based on information found on our platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to suspend or terminate your account at any time for 
                violations of these terms or for any other reason at our discretion.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may modify these terms at any time. Continued use of our services after 
                changes constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>For questions about these Terms of Service, contact us at:</p>
              <ul className="list-none space-y-2">
                <li>Email: legal@edulens.in</li>
                <li>Phone: +91 80 1234 5678</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
