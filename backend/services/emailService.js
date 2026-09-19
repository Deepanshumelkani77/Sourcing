require("dotenv").config();

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendSignupOTPEmail = async (email, otp) => {
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [email],
    subject: "Your IndoChinaBridge verification code",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;padding:35px;">
            
            <h2 style="margin:0 0 10px;color:#222;">
              Verify your email
            </h2>

            <p style="color:#666;font-size:15px;">
              Thank you for creating an account with IndoChinaBridge.
            </p>

            <p style="color:#666;font-size:15px;">
              Use the following OTP to verify your email address:
            </p>

            <div style="
              margin:30px 0;
              padding:18px;
              background:#fff3f1;
              border-radius:10px;
              text-align:center;
              font-size:32px;
              font-weight:bold;
              letter-spacing:8px;
              color:#F41703;
            ">
              ${otp}
            </div>

            <p style="color:#777;font-size:14px;">
              This OTP will expire in 10 minutes.
            </p>

            <p style="color:#777;font-size:14px;">
              If you did not request this verification code, you can safely ignore this email.
            </p>

            <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">

            <p style="color:#999;font-size:12px;">
              IndoChinaBridge<br>
              Your China sourcing partner
            </p>

          </div>
        </body>
      </html>
    `,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result;
};

const sendPasswordResetEmail = async (email, resetUrl) => {
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [email],
    subject: "Reset your IndoChinaBridge password",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;padding:35px;">

            <h2 style="color:#222;">
              Reset your password
            </h2>

            <p style="color:#666;font-size:15px;">
              We received a request to reset your IndoChinaBridge password.
            </p>

            <p style="color:#666;font-size:15px;">
              Click the button below to create a new password.
            </p>

            <div style="text-align:center;margin:30px 0;">
              <a
                href="${resetUrl}"
                style="
                  display:inline-block;
                  background:#F41703;
                  color:#ffffff;
                  padding:14px 28px;
                  border-radius:8px;
                  text-decoration:none;
                  font-weight:bold;
                "
              >
                Reset Password
              </a>
            </div>

            <p style="color:#777;font-size:13px;">
              This link will expire in 30 minutes.
            </p>

            <p style="color:#777;font-size:13px;">
              If you did not request a password reset, please ignore this email.
            </p>

          </div>
        </body>
      </html>
    `,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result;
};

module.exports = {
  sendSignupOTPEmail,
  sendPasswordResetEmail,
};