import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Flowrise Co. (“we”, “our”, or “the Company”) respects your
                privacy and is committed to protecting your personal data. This
                Privacy Policy outlines how we collect, use, share, and store
                your personal information in connection with our investment,
                crypto, banking, and trading services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scope</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This policy applies to all personal information collected
                through our platform, applications, APIs, and any associated
                services. It also governs data provided to us in-person, by
                email, or through third-party integrations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-2">
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  <strong>Identity Data:</strong> Full name, government-issued
                  ID, date of birth, nationality.
                </li>
                <li>
                  <strong>Contact Data:</strong> Email address, phone number,
                  mailing address.
                </li>
                <li>
                  <strong>Financial Data:</strong> Wallet addresses, transaction
                  history, linked accounts, investment activity.
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, device type,
                  browser version, session activity, cookies.
                </li>
                <li>
                  <strong>Verification Data:</strong> Documents and biometric
                  information submitted for compliance purposes.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Data</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-2">
              <p>Flowrise Co. uses your personal data to:</p>
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  Authenticate user identity and fulfill regulatory requirements
                  (e.g., KYC, AML).
                </li>
                <li>
                  Provide access to platform features, transactions, and account
                  functionality.
                </li>
                <li>
                  Process investments, withdrawals, and asset operations
                  securely.
                </li>
                <li>Prevent fraud, unauthorized access, or financial crime.</li>
                <li>
                  Deliver communications, updates, and legally required notices.
                </li>
                <li>
                  Analyze usage to improve product design, performance, and
                  security.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal Basis for Processing</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                We process your data only where legally permissible. This
                includes fulfilling contractual obligations, complying with
                financial regulations, protecting our legitimate interests, or
                with your explicit consent.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disclosure of Information</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-2">
              <p>
                Your information may be disclosed only under the following
                conditions:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  To regulatory authorities, courts, or enforcement agencies,
                  when required by law.
                </li>
                <li>
                  To third-party service providers who support our
                  infrastructure under binding confidentiality agreements.
                </li>
                <li>
                  To affiliates or partners involved in delivering services
                  you’ve opted into.
                </li>
              </ul>
              <p>
                We never sell your data or disclose it for marketing without
                your consent.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>International Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If your data is transferred outside your country of residence,
                we ensure that appropriate safeguards (e.g., standard
                contractual clauses or equivalent legal mechanisms) are in place
                to protect your rights.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We retain your personal data only as long as necessary to
                fulfill our legal obligations, maintain account integrity, or
                resolve disputes. Data may be retained beyond account closure
                where required by financial regulation or applicable law.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Flowrise Co. uses advanced encryption, multi-layer
                authentication, intrusion detection, and access controls to
                safeguard your data. While no system is impenetrable, we
                continuously monitor and enhance our security measures to
                protect your information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-2">
              <p>You may have the right to:</p>
              <ul className="ml-4 list-disc space-y-2">
                <li>Request access to your personal information.</li>
                <li>Correct or update incomplete or inaccurate data.</li>
                <li>
                  Object to certain uses or request restriction of processing.
                </li>
                <li>
                  Request deletion of your data, subject to regulatory
                  exceptions.
                </li>
                <li>Withdraw consent where processing is based on consent.</li>
                <li>Lodge a complaint with a data protection authority.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Use of Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We use cookies and similar technologies to enhance user
                experience, monitor performance, and support security features.
                You can manage cookie preferences through your browser settings
                or our Cookie Policy (where applicable).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Policy Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to revise this Privacy Policy periodically.
                When changes are made, we will update the “Last Updated” date
                and, where appropriate, notify users through the platform or via
                email.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To exercise your rights or for questions regarding this Privacy
                Policy, contact us via{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  our contact page
                </Link>{" "}
                or email <strong>privacy@flowriseco.com</strong>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
