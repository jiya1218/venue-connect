/**
 * Fast2SMS API integration for sending OTPs
 * Documentation: https://docs.fast2sms.com/
 */

const FAST2SMS_API_URL = "https://www.fast2sms.com/dev/bulkV2";

export const sendOTP = async (phoneNumber: string, otp: string) => {
  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey) {
    console.warn("Fast2SMS API Key is missing. Simulation mode enabled.");
    console.log(`[SIMULATION] Sending OTP ${otp} to ${phoneNumber}`);
    return { success: true, message: "OTP sent successfully (Simulated)" };
  }

  try {
    // Fast2SMS API requires phone number without +91 for Indian numbers typically, 
    // but let's ensure it's just the 10 digits.
    const cleanPhone = phoneNumber.replace(/\D/g, "").slice(-10);

    const response = await fetch(FAST2SMS_API_URL, {
      method: "POST",
      headers: {
        "authorization": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variables_values: otp,
        route: "otp",
        numbers: cleanPhone,
      }),
    });

    const data = await response.json();

    if (data.return) {
      return { success: true, message: data.message || "OTP sent successfully" };
    } else {
      return { success: false, message: data.message || "Failed to send OTP" };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An error occurred while sending OTP";
    console.error("Fast2SMS Error:", error);
    return { success: false, message };
  }
};
