import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function TermsOfService() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950 dark:via-gray-900 dark:to-red-950">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation('/login')}
          className="mb-6 text-red-700 hover:text-red-800 hover:bg-red-50 dark:text-red-300 dark:hover:text-red-200 dark:hover:bg-red-900/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Registration
        </Button>

        <Card className="max-w-4xl mx-auto bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-red-800 dark:text-red-200">
              Terms of Service
            </CardTitle>
            <p className="text-red-600 dark:text-red-400 mt-2">
              OrderNa - University of Batangas Food Ordering System
            </p>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By using OrderNa, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                2. Service Description
              </h2>
              <p>
                OrderNa is a food ordering platform specifically designed for University of Batangas canteens. The service allows students and staff to pre-order food items and pick them up using QR codes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                3. User Accounts
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must be a valid University of Batangas student or staff member to use this service</li>
                <li>Student ID verification may be required</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                4. Food Orders and Payment
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>All orders must be paid for in advance through the platform</li>
                <li>Orders are subject to availability and canteen operating hours</li>
                <li>Cancellation policies vary by canteen and timing</li>
                <li>No-show orders may result in account restrictions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                5. QR Code Usage
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>QR codes are unique to each order and should not be shared</li>
                <li>Present your QR code at the designated pickup location</li>
                <li>QR codes expire according to the specified pickup time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                6. Privacy and Data Protection
              </h2>
              <p>
                We collect and process your personal information in accordance with our Privacy Policy. This includes your name, student ID, email, phone number, and order history for the purpose of providing our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibent text-red-800 dark:text-red-200 mb-3">
                7. Prohibited Conduct
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Do not share your account credentials with others</li>
                <li>Do not attempt to manipulate or abuse the ordering system</li>
                <li>Do not place fraudulent orders</li>
                <li>Respect canteen staff and other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                8. Limitation of Liability
              </h2>
              <p>
                OrderNa is not responsible for food quality issues, allergic reactions, or delays caused by canteen operations. Users are responsible for communicating dietary restrictions and preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                9. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. Users will be notified of significant changes through the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                10. Contact Information
              </h2>
              <p>
                For questions about these Terms of Service, please contact the University of Batangas IT Department or the OrderNa support team.
              </p>
            </section>

            <div className="text-center pt-6 border-t border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">
                Last updated: January 2025
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}