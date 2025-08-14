"use server";

import { smartContactChatbot } from "@/ai/flows/smart-contact-chatbot";
import type { SmartContactChatbotInput } from "@/ai/flows/smart-contact-chatbot";
import { db } from "@/lib/firebase-admin";

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
