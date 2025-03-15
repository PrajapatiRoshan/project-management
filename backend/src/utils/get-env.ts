export const getEnv = (key: string, defaultValue: string = ''): string => {
  // Function to get environment variables
  const value = process.env[key]; // Get the value of the environment variable
  if (value === undefined) {
    // If the value is undefined
    if (defaultValue) return defaultValue; // Return the default value if provided
    throw new Error(`Enviroment variable ${key} is not set`); // Throw an error if no default value is provided
  }
  return value; // Return the value of the environment variable
};

