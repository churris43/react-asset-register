import { fetchWithAuth } from "@/src/libs/fetchWithAuth";

export async function getAssets() {
  try {
    const response = await fetchWithAuth(`/assets`);
    if (!response.ok) {
      throw new Error("Failed to get asset");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
