import { resend } from "./config.js";
import { verificationTemplate, confirmationTemplate, resetPasswordTemplate, resetPasswordSuccessTemplate } from "./emailTemplate.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Arogyam - Verify Your Email",
      html: verificationTemplate.replace("{verificationToken}", verificationToken),
    });

    if (error) {
      console.error('Resend error:', error); // Log error details
      throw new Error("Failed to send verification email");
    }
  } catch (error) {
    console.error('Send verification email error:', error.message); // Log error message
    throw error;
  }
};


export const sendConfirmationEmail = async (email, firstName) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Arogyam - Welcome",
      html: confirmationTemplate.replace("{patientName}", firstName),
    });

    if (error) {
      throw new Error("Failed to send confirmation email");
    }

  } catch (error) {
    throw error;
  }
};

export const sendResetPasswordEmail = async (email, resetURL) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Arogyam - Reset Your Password",
      html: resetPasswordTemplate.replace("{resetURL}", resetURL),
    });

    if (error) {
      throw new Error("Failed to send reset password email");
    }

  } catch (error) {
    throw error;
  }
};

export const sendResetPasswordSuccessEmail = async (email) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Arogyam - Password Reset Successful",
      html: resetPasswordSuccessTemplate,
    });

    if (error) {
      throw new Error("Failed to send reset password success email");
    }

  } catch (error) {
    throw error;
  }
};
