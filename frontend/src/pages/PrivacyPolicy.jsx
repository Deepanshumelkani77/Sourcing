import React from 'react';

const PrivacyPolicy = () => {
  const BRAND_COLOR = '#F41703';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>
          
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                IndoChinaBridge ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website and services, including when you sign up using Facebook authentication.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">2.1 Information You Provide</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Name (first name, middle name, last name)</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Password (encrypted)</li>
                    <li>Profile information from Facebook (when using Facebook login)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">2.2 Information Collected Automatically</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Referring website</li>
                    <li>Pages visited and time spent on pages</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Facebook Login Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                When you choose to sign up or log in using your Facebook account, we receive the following information from Facebook:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>Your Facebook user ID</li>
                <li>Your name (first name, last name)</li>
                <li>Your email address (if you have made it visible to apps)</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                We use this information to create your account on our platform and authenticate you. We do not request or store your Facebook password, and we do not post to your Facebook timeline without your explicit permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">We use your personal information for the following purposes:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>To create and manage your account</li>
                <li>To authenticate you when you log in</li>
                <li>To provide our services and process your requests</li>
                <li>To communicate with you about your orders and inquiries</li>
                <li>To improve our website and services</li>
                <li>To send you marketing communications (with your consent)</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Storage and Security</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. Our security measures include:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>Encryption of passwords using bcrypt hashing</li>
                <li>Secure HTTPS connections</li>
                <li>Regular security reviews and updates</li>
                <li>Restricted access to user data</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Sharing</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>With service providers who assist us in operating our website (e.g., hosting, email services)</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or merger</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Authenticate you and keep you logged in</li>
                <li>Remember your preferences</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                You can control cookies through your browser settings, but disabling cookies may affect your ability to use certain features of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Your Rights and Choices</h2>
              <p className="text-gray-600 leading-relaxed mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (see section below)</li>
                <li><strong>Opt-out:</strong> Opt-out of marketing communications</li>
                <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Data Deletion</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You may request deletion of your account and personal information by:
              </p>
              <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                <li>Logging into your account and using the account deletion feature (if available), or</li>
                <li>Contacting us directly at the email address provided in section 11</li>
              </ol>
              <p className="text-gray-600 leading-relaxed mt-4">
                Upon receiving a deletion request, we will:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Verify your identity</li>
                <li>Delete your account and personal information from our active databases</li>
                <li>Retain certain information as required by law or for legitimate business purposes</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Please note that if you signed up using Facebook, you may also need to revoke our app's access through your Facebook account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. International Data Transfers</h2>
              <p className="text-gray-600 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. By using our services, you consent to such transfers in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date. Your continued use of our services after such changes constitutes your acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-2 text-gray-600">
                  <li><strong>Email:</strong> privacy@indochinabridge.com</li>
                  <li><strong>Website:</strong> https://indochinabridge.com</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
