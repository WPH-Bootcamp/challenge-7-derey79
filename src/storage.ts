import * as fs from 'fs';
import * as path from 'path';
import { Todo } from './types';
import { isTodoArray } from './utils';

// TODO: Definisikan path file untuk menyimpan data To-Do

// TODO: Buat fungsi untuk membaca To-Do dari file
// Hint: Gunakan try-catch untuk handle error saat membaca file

// TODO: Buat fungsi untuk menyimpan To-Do ke file
// Hint: Jangan lupa konversi ke JSON string sebelum disimpan

// TODO: Buat fungsi untuk inisialisasi storage (buat file kosong jika belum ada)

export const FILE_PATH = './todos.json';

export const readTodos = (): Todo[] => {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      return [];
    }
    const data = fs.readFileSync(FILE_PATH, 'utf-8');

    const parsedData: unknown = JSON.parse(data);

    // check validasi apakah array
    if (isTodoArray(parsedData)) {
      return parsedData;
    } else {
      console.warn(
        'Warning: todos.json data is corrupted! Returning an empty list.'
      );
      return [];
    }
  } catch (error) {
    console.error('Failed to read todo file, returning empty list:', error);
    return [];
  }
};

export const saveTodos = (todos: Todo[]): void => {
  try {
    //
    const dirPath = path.dirname(FILE_PATH);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save todo data:', error);
  }
};
