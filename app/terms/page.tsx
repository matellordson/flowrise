import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">Terms and Conditions</h1>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By accessing or using the services provided by Flowrise Co., you
                confirm that you have read, understood, and agree to be bound by
                these Terms and Conditions, including any future modifications.
                If you do not agree with these terms, you are not permitted to
                use our services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eligibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use of our platform is limited to individuals who are at least
                18 years of age or the age of majority in their jurisdiction. By
                using Flowrise Co., you represent that you meet all legal
                requirements to enter into this agreement and to use our
                services lawfully.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You are required to create an account to access certain features
                of the platform. You agree to:
              </p>
              <ul className="text-muted-foreground ml-4 space-y-2">
                <li>
                  • Provide accurate and complete registration information
                </li>
                <li>
                  • Maintain the security and confidentiality of your account
                  credentials
                </li>
                <li>
                  • Accept full responsibility for all activity under your
                  account
                </li>
                <li>
                  • Notify us immediately of any unauthorized use or security
                  breach
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Flowrise Co. is not liable for losses or damages arising from
                unauthorized account access.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Risk Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All investments, including those in cryptocurrencies, tokenized
                assets, real estate, and financial instruments, carry risk. The
                value of investments can fluctuate, and past performance does
                not guarantee future returns. Flowrise Co. does not provide
                financial advice. You acknowledge and accept full responsibility
                for your investment decisions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prohibited Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You agree not to use Flowrise Co. to:
              </p>
              <ul className="text-muted-foreground ml-4 space-y-2">
                <li>• Violate any applicable laws or regulations</li>
                <li>• Commit fraud or engage in unlawful financial activity</li>
                <li>
                  • Exploit platform vulnerabilities or attempt unauthorized
                  access
                </li>
                <li>
                  • Infringe on the intellectual property or privacy rights of
                  others
                </li>
                <li>• Distribute viruses, spam, or malicious code</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Violation of these terms may result in immediate termination of
                your access.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Use License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Flowrise Co. grants you a limited, non-exclusive,
                non-transferable license to access and use our content for
                personal, non-commercial purposes. Under this license, you may
                not:
              </p>
              <ul className="text-muted-foreground ml-4 space-y-2">
                <li>• Modify or reproduce platform materials</li>
                <li>• Use content for commercial gain or public display</li>
                <li>• Reverse engineer any software or services</li>
                <li>• Remove copyright or trademark notices</li>
              </ul>
              <p className="text-muted-foreground">
                All rights not expressly granted are reserved by Flowrise Co.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All content on the platform—including branding, algorithms,
                software, data, and user interfaces—is the property of Flowrise
                Co. or its licensors. Unauthorized use, reproduction, or
                distribution is strictly prohibited and may result in legal
                action.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Flowrise Co. reserves the right to suspend or permanently
                terminate your access to the platform at its sole discretion,
                without prior notice, for violations of these Terms or any
                activity deemed harmful to the platform or its users.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modifications to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may revise these Terms at any time. Any significant changes
                will be communicated through our platform or via email.
                Continued use of the platform following such modifications
                constitutes your acceptance of the updated Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To the fullest extent permitted by law, Flowrise Co., its
                affiliates, and service providers shall not be liable for any
                indirect, incidental, punitive, or consequential damages arising
                from your use of, or inability to use, our services. This
                includes, but is not limited to, loss of profits, data, or
                business opportunities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                These Terms shall be governed and interpreted in accordance with
                the laws of the jurisdiction in which Flowrise Co. is
                registered. Any disputes arising shall be subject to the
                exclusive jurisdiction of the courts located within that
                jurisdiction.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If you have any questions or concerns about these Terms and
                Conditions, please contact us via{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  our contact page
                </Link>{" "}
                or email us at <strong>legal@flowriseco.com</strong>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
