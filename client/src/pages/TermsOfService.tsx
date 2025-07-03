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
              UB FoodHub - University of Batangas Food Ordering & Delivery System
            </p>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By using UB FoodHub, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                2. Service Description
              </h2>
              <p>
                UB FoodHub is a food ordering and delivery platform specifically designed for University of Batangas canteens. The service allows students and staff to pre-order food items, schedule pickup times, and request campus delivery using QR codes.
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
                <li>Delivery fees apply for campus delivery orders</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                5. Delivery Service
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Campus delivery is available to designated locations within University of Batangas</li>
                <li>Delivery times are estimates and may vary based on demand and weather conditions</li>
                <li>You must be available at the specified delivery location during the estimated delivery window</li>
                <li>Additional delivery fees may apply for certain locations or peak hours</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                6. QR Code Usage
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>QR codes are unique to each order and should not be shared</li>
                <li>Present your QR code at the designated pickup location or to delivery personnel</li>
                <li>QR codes expire according to the specified pickup time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                7. Loyalty Program and Reviews
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Loyalty points are earned with qualifying purchases and have no cash value</li>
                <li>Points may expire if account is inactive for extended periods</li>
                <li>Reviews and ratings must be honest and based on actual experiences</li>
                <li>Inappropriate or false reviews may result in account suspension</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                8. Privacy and Data Protection
              </h2>
              <p>
                We collect and process your personal information in accordance with our Privacy Policy. This includes your name, student ID, email, phone number, delivery address, and order history for the purpose of providing our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                9. Prohibited Conduct
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Do not share your account credentials with others</li>
                <li>Do not attempt to manipulate or abuse the ordering system</li>
                <li>Do not place fraudulent orders</li>
                <li>Respect canteen staff, delivery personnel, and other users</li>
                <li>Do not abuse the loyalty program or review system</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                10. Limitation of Liability
              </h2>
              <p>
                UB FoodHub is not responsible for food quality issues, allergic reactions, delays caused by canteen operations, or delivery delays due to weather or other circumstances beyond our control. Users are responsible for communicating dietary restrictions and preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                11. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. Users will be notified of significant changes through the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
                12. Contact Information
              </h2>
              <p>
                For questions about these Terms of Service, please contact the University of Batangas IT Department or the UB FoodHub support team.
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