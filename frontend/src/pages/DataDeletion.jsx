import React from 'react';

const DataDeletion = () => {
  const BRAND_COLOR = '#F41703';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Data Deletion Instructions
          </h1>
          
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Request Account Deletion</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you would like to delete your IndoChinaBridge account and all associated personal data, please follow these steps:
              </p>
              <ol className="list-decimal pl-6 text-gray-600 space-y-4">
                <li>
                  <strong>Send an email request</strong> to <a href="mailto:info@indochinabridge.com" className="text-[#F41703] hover:underline">info@indochinabridge.com</a> with the subject line "Account Deletion Request"
                </li>
                <li>
                  <strong>Include the following information</strong> in your email:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Your full name</li>
                    <li>Your registered email address</li>
                    <li>Your phone number (if provided)</li>
                    <li>Confirmation that you want to permanently delete your account</li>
                  </ul>
                </li>
                <li>
                  <strong>Verification process:</strong> We will verify your identity before processing the deletion request to ensure the security of your account
                </li>
                <li>
                  <strong>Processing time:</strong> Once verified, your account and associated data will be permanently deleted within 30 days of your request
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Data Will Be Deleted</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Upon successful deletion, the following data will be permanently removed from our systems:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Account information (name, email, phone)</li>
                <li>Profile data and preferences</li>
                <li>Order history and related information</li>
                <li>Authentication credentials</li>
                <li>Any other personal data associated with your account</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                <strong>Note:</strong> If you signed up using Facebook, you may also need to revoke our app's access through your Facebook account settings to completely disconnect your Facebook account from our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may retain certain data for the following purposes even after account deletion:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Legal requirements:</strong> Data required to be retained by applicable laws and regulations</li>
                <li><strong>Fraud prevention:</strong> Limited data necessary to prevent fraud and ensure platform security</li>
                <li><strong>Business records:</strong> Anonymized or aggregated data for business analytics and reporting</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Facebook Login Users</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you created your account using Facebook authentication, please note:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Your Facebook account will not be affected by deleting your IndoChinaBridge account</li>
                <li>To revoke IndoChinaBridge's access to your Facebook data, go to your Facebook Settings &gt; Apps and Websites &gt; IndoChinaBridge &gt; Remove</li>
                <li>This will disconnect your Facebook account from our service but will not delete your IndoChinaBridge account</li>
                <li>To delete your IndoChinaBridge account, you must still follow the deletion instructions above</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Irreversible Action</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800 leading-relaxed">
                  <strong>Important:</strong> Account deletion is permanent and irreversible. Once your account is deleted, you will not be able to recover your data or reactivate your account. If you have any active orders or pending transactions, please ensure they are completed before requesting deletion.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about the data deletion process or need assistance, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-2 text-gray-600">
                  <li><strong>Email:</strong> <a href="mailto:info@indochinabridge.com" className="text-[#F41703] hover:underline">info@indochinabridge.com</a></li>
                  <li><strong>Website:</strong> <a href="https://indochinabridge.com" className="text-[#F41703] hover:underline">https://indochinabridge.com</a></li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Alternative: Self-Service Deletion</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you prefer to delete your account directly without contacting us:
              </p>
              <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                <li>Log in to your IndoChinaBridge account</li>
                <li>Navigate to your Dashboard</li>
                <li>Go to Account Settings</li>
                <li>Click on "Delete Account"</li>
                <li>Confirm your decision by entering your password</li>
                <li>Your account will be scheduled for deletion</li>
              </ol>
              <p className="text-gray-600 leading-relaxed mt-4">
                If you cannot access your account or prefer not to use the self-service option, please use the email method described above.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDeletion;
