<<<<<<< HEAD
// src/utils/csv.ts
import * as DocumentPicker from 'expo-document-picker';
import * as LegacyFileSystem from 'expo-file-system/legacy';
import Papa from 'papaparse';

export async function pickAndParseCsv<T = any>(): Promise<T[] | null> {
  // 1) Let user pick a single CSV file
  const result = await DocumentPicker.getDocumentAsync({
    type: [
      'text/csv',
      'text/comma-separated-values',
      'application/vnd.ms-excel',
      'text/plain',
    ],
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];
  const uri = asset.uri;

  try {
    // 2) Use ONLY the legacy API that we know exists in Expo 54
    //    https://docs.expo.dev/versions/latest/sdk/filesystem-legacy/
    const fileInfo = await LegacyFileSystem.getInfoAsync(uri);

    if (!fileInfo.exists) {
      throw new Error('Selected CSV file does not exist or is not accessible.');
    }

    // 3) Read file contents as UTF‑8 text
    const fileContent = await LegacyFileSystem.readAsStringAsync(uri, {
      encoding: 'utf8',
    });

    // 4) Parse CSV
    const parsed = Papa.parse<T>(fileContent, {
      header: true,
      skipEmptyLines: true,
      delimiter: ',',
      dynamicTyping: false,
    });

    if (parsed.errors && parsed.errors.length > 0) {
      console.warn('CSV parse warnings/errors:', parsed.errors);
      // Do not throw; we just continue with what parsed correctly
    }

    return parsed.data as T[];
  } catch (error) {
    console.error('Error in pickAndParseCsv', error);
    throw error;
  }
=======
// src/utils/csv.ts
import * as DocumentPicker from 'expo-document-picker';
import * as LegacyFileSystem from 'expo-file-system/legacy';
import Papa from 'papaparse';

export async function pickAndParseCsv<T = any>(): Promise<T[] | null> {
  // 1) Let user pick a single CSV file
  const result = await DocumentPicker.getDocumentAsync({
    type: [
      'text/csv',
      'text/comma-separated-values',
      'application/vnd.ms-excel',
      'text/plain',
    ],
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];
  const uri = asset.uri;

  try {
    // 2) Use ONLY the legacy API that we know exists in Expo 54
    //    https://docs.expo.dev/versions/latest/sdk/filesystem-legacy/
    const fileInfo = await LegacyFileSystem.getInfoAsync(uri);

    if (!fileInfo.exists) {
      throw new Error('Selected CSV file does not exist or is not accessible.');
    }

    // 3) Read file contents as UTF‑8 text
    const fileContent = await LegacyFileSystem.readAsStringAsync(uri, {
      encoding: 'utf8',
    });

    // 4) Parse CSV
    const parsed = Papa.parse<T>(fileContent, {
      header: true,
      skipEmptyLines: true,
      delimiter: ',',
      dynamicTyping: false,
    });

    if (parsed.errors && parsed.errors.length > 0) {
      console.warn('CSV parse warnings/errors:', parsed.errors);
      // Do not throw; we just continue with what parsed correctly
    }

    return parsed.data as T[];
  } catch (error) {
    console.error('Error in pickAndParseCsv', error);
    throw error;
  }
>>>>>>> 8f32440 (Initial app update)
}