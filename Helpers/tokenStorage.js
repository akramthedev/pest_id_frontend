import * as SecureStore from 'expo-secure-store';

 export async function saveToken(token) {
  await SecureStore.setItemAsync('authToken', token);
}

 export async function getToken() {
  const token = await SecureStore.getItemAsync('authToken');
  return token;
}

 export async function deleteToken() {
  await SecureStore.deleteItemAsync('authToken');
}
