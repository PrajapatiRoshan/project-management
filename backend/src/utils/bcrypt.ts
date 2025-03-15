import bcrypt from 'bcrypt'; // Import the bcrypt library

export const hashValue = async (
  value: string,
  saltRounds: number = 10 // Function to hash a value
) => await bcrypt.hash(value, saltRounds); // Hash the value with the specified number of salt rounds

export const compareValue = async (
  value: string,
  hashedValue: string // Function to compare a value with a hashed value
) => await bcrypt.compare(value, hashedValue); // Compare the value with the hashed value

