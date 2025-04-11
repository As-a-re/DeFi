// This file simulates API calls to a backend service
// In a real application, you would connect to your actual backend

interface RegistrationData {
  name: string
  email: string
  github: string
  track: string
  experience: string
  idea: string
  teamSize: string
  agreeTerms: boolean
}

export async function registerParticipant(data: RegistrationData): Promise<{ success: boolean }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Log the data that would be sent to the server
  console.log("Registration data:", data)

  // In a real application, you would send this data to your backend
  // For demo purposes, we're just returning a success response
  return { success: true }
}

