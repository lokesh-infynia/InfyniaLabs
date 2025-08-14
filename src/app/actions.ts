"use server";

import { smartContactChatbot } from "@/ai/flows/smart-contact-chatbot";
import type { SmartContactChatbotInput } from "@/ai/flows/smart-contact-chatbot";

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

export async function submitFeedback(data: {
  name: string;
  email: string;
  feedback: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    // In a real application, you would save this data to a database.
    console.log("Feedback submitted:", data);
    return { success: true, message: "Thank you for your feedback!" };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { success: false, message: "Failed to submit feedback." };
  }
}
