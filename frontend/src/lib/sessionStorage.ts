export function getSessionStorageItem(key: string): string | null {
  try {
    const storedValue = sessionStorage.getItem(key)
    return storedValue !== null ? JSON.parse(storedValue) : null
  } catch (error) {
    console.error(`Error retrieving session storage item for key "${key}":`, error)
    return null
  }
}
