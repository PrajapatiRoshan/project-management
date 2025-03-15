import { v4 as uuid4 } from 'uuid'; // Import the uuid library and rename v4 to uuid4

export function generateInviteCode() {
  // Function to generate an invite code
  return uuid4().replace(/-/g, '').substring(0, 8); // Generate a UUID, remove dashes, and take the first 8 characters
}

export function generateTaskCode() {
  // Function to generate a task code
  return `task-${uuid4().replace(/-/g, '').substring(0, 3)}`; // Generate a UUID, remove dashes, take the first 3 characters, and prefix with 'task-'
}

