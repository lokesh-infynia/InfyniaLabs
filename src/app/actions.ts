"use server";

import { smartContactChatbot } from "@/ai/flows/smart-contact-chatbot";
import type { SmartContactChatbotInput } from "@/ai/flows/smart-contact-chatbot";
import { db } from "@/lib/firebase-admin";
import nodemailer from "nodemailer";

export async function handleChat(
  input: SmartContactChatbotInput
): Promise<{ response: string }> {
  try {
    const result = await smartContactChatbot(input);
    return result;
  } catch (error) {
    console.error("Error in smartContactChatbot flow:", error);
    return { response: "An error occurred while processing your request." };
  }
}

export async function joinWaitlist(data: {
  email: string;
  name: string;
  product: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const { email, name, product } = data;
    if (!email || !name || !product) {
      return { success: false, message: "Missing required fields." };
    }
    
    const waitlistRef = db.collection('waitlists').doc(product).collection('users');
    const userDoc = await waitlistRef.doc(email).get();

    if (userDoc.exists) {
      return { success: true, message: "You are already on the waitlist." };
    }

    await waitlistRef.doc(email).set({
      name,
      email,
      joinedAt: new Date().toISOString(),
    });
    
    return { success: true, message: "You have been added to the waitlist!" };
  } catch (error) {
    console.error("Error joining waitlist:", error);
    return { success: false, message: "Failed to join waitlist." };
  }
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  company?: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const { name, email, company, message } = data;
    if (!name || !email || !message) {
      return { success: false, message: "Name, email, and message are required." };
    }

    // Save to Firestore as backup
    await db.collection("contact_submissions").add({
      name,
      email,
      company: company || "",
      message,
      submittedAt: new Date().toISOString(),
    });

    // Send email via SMTP (configure SMTP_* env vars)
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"Infynia Labs Contact" <${smtpUser}>`,
        to: "support@infynialabs.com",
        replyTo: email,
        subject: `New Contact: ${name}${company ? ` from ${company}` : ""}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#0059A5;">New Contact Form Submission</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px;font-weight:bold;width:120px;">Name</td><td style="padding:8px;">${name}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
              ${company ? `<tr><td style="padding:8px;font-weight:bold;">Company</td><td style="padding:8px;">${company}</td></tr>` : ""}
              <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Message</td><td style="padding:8px;">${message.replace(/\n/g, "<br>")}</td></tr>
            </table>
          </div>
        `,
        text: `Name: ${name}\nEmail: ${email}${company ? `\nCompany: ${company}` : ""}\n\nMessage:\n${message}`,
      });
    }

    return { success: true, message: "Message sent! We'll get back to you within 24 hours." };
  } catch (error) {
    console.error("Error sending contact email:", error);
    return { success: false, message: "Failed to send message. Please try again." };
  }
}

export async function checkWaitlist(data: {
  email: string;
  product: string;
}): Promise<boolean> {
  try {
    const { email, product } = data;
    if (!email || !product) return false;
    
    const doc = await db.collection('waitlists').doc(product).collection('users').doc(email).get();
    return doc.exists;
  } catch (error) {
    console.error("Error checking waitlist:", error);
    return false;
  }
}
