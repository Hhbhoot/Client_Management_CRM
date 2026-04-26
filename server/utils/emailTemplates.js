const getForgotPasswordTemplate = (resetUrl) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">ClientFlow CRM</h1>
      </div>
      <div style="padding: 40px 30px; background-color: white;">
        <h2 style="color: #111827; margin-top: 0; font-size: 24px; font-weight: 700;">Reset Your Password</h2>
        <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
          You are receiving this email because a password reset request was made for your account. If you did not make this request, you can safely ignore this email.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5);">
            Reset Password
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
          This link will expire in 10 minutes. If the button above doesn't work, copy and paste this URL into your browser:
        </p>
        <p style="color: #3b82f6; font-size: 13px; word-break: break-all;">${resetUrl}</p>
      </div>
      <div style="padding: 20px 30px; background-color: #f3f4f6; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; 2026 ClientFlow CRM. All rights reserved.</p>
      </div>
    </div>
  `;
};

const getPasswordResetSuccessTemplate = () => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">Success!</h1>
      </div>
      <div style="padding: 40px 30px; background-color: white;">
        <h2 style="color: #111827; margin-top: 0; font-size: 24px; font-weight: 700;">Password Reset Confirmed</h2>
        <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
          This is a confirmation that the password for your account has just been changed.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 50%; padding: 20px;">
            <svg style="width: 40px; height: 40px; color: #10b981;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
          If you did not make this change, please contact our support team immediately.
        </p>
      </div>
      <div style="padding: 20px 30px; background-color: #f3f4f6; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; 2026 ClientFlow CRM. All rights reserved.</p>
      </div>
    </div>
  `;
};

module.exports = {
  getForgotPasswordTemplate,
  getPasswordResetSuccessTemplate,
};
