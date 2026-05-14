import * as fs from 'fs';
import * as path from 'path';
import { Todo } from './types';

// TODO: Definisikan path file untuk menyimpan data To-Do

// TODO: Buat fungsi untuk membaca To-Do dari file
// Hint: Gunakan try-catch untuk handle error saat membaca file

// TODO: Buat fungsi untuk menyimpan To-Do ke file
// Hint: Jangan lupa konversi ke JSON string sebelum disimpan

// TODO: Buat fungsi untuk inisialisasi storage (buat file kosong jika belum ada)

export const FILE_PATH = './todos.json';
// const FILE_PATH = path.join(__dirname, 'data', 'todos.json');
// export const readTodos = (): Todo[] => {
//   if (!fs.existsSync(FILE_PATH)) {
//     return [];
//   }
//   const data = fs.readFileSync(FILE_PATH, 'utf-8');
//   return JSON.parse(data) as Todo[];
// };

// export const saveTodos = (todos: Todo[]): void => {
//   fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2), 'utf-8');
// };

// const FILE_PATH = path.join(__dirname, 'data', 'todos.json');

export const readTodos = (): Todo[] => {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      return [];
    }
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data) as Todo[];
  } catch (error) {
    console.error('Failed to read todo file, returning empty list:', error);
    return [];
  }
};

export const saveTodos = (todos: Todo[]): void => {
  try {
    // Extract the folder path to ensure it exists before writing
    const dirPath = path.dirname(FILE_PATH);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save todo data:', error);
  }
};
