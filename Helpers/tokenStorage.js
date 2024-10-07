import * as SecureStore from 'expo-secure-store';

// Function to save the token
export async function saveToken(token) {
  await SecureStore.setItemAsync('authToken', token);
}

// Function to retrieve the token
export async function getToken() {
  const token = await SecureStore.getItemAsync('authToken');
  return token;
}

// Function to delete the token
export async function deleteToken() {
  await SecureStore.deleteItemAsync('authToken');
}
