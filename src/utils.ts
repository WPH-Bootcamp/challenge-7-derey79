// TODO: Implementasikan type guards di sini
// Hint: Type guard berguna untuk memastikan tipe data saat runtime

// TODO: Buat fungsi untuk memvalidasi apakah suatu objek adalah To-Do yang valid

// TODO: Buat fungsi helper untuk menampilkan tanggal/waktu dengan format yang bagus

// TODO: Buat fungsi untuk memastikan input dari user adalah string yang valid

// import { timeStamp } from 'console';
import { readTodos, saveTodos } from './storage';
import { Todo, MenuItem } from './types';
import { rl } from '.';

export const mainmenuList: MenuItem[] = [
  {
    id: 1,
    menuTitle: 'Add new todo',
  },
  {
    id: 2,
    menuTitle: 'Mark todo as complete',
  },
  {
    id: 3,
    menuTitle: 'Delete todo',
  },
  {
    id: 4,
    menuTitle: 'List all todos',
  },
  {
    id: 5,
    menuTitle: 'Search todos',
  },
  {
    id: 6,
    menuTitle: 'Exit',
  },
];

// Validasi Todo :
// Your validation function
type ValidationResult = { isValid: true } | { isValid: false; message: string };

export function isValidTodo(
  task: unknown,
  existingList: Todo[]
): ValidationResult {
  // task todo tidak menerima angka saja
  if (typeof task !== 'string') {
    return {
      isValid: false,
      message: 'Task must be text, numbers are not allowed.',
    };
  }

  const clearTask = task.trim();

  // task todo tidak boleh kosong
  if (clearTask.length === 0) {
    return { isValid: false, message: 'Task cannot be empty.' };
  }

  if (!isNaN(Number(clearTask))) {
    return {
      isValid: false,
      message: 'Task can not be a number, must be text',
    };
  }

  // task todo harus lebih besar dari 3 karakter
  if (clearTask.length <= 3) {
    return {
      isValid: false,
      message: 'Task is too short. It must be longer than 3 characters.',
    };
  }

  // check validasi task apakah sudah ada
  const isDuplicate = existingList.some(
    (item) => item.task.toLowerCase() === clearTask.toLowerCase()
  );

  if (isDuplicate) {
    return {
      isValid: false,
      message: 'This task already exists in your list.',
    };
  }
  return { isValid: true };
}

//
function isTodoItem(item: unknown): item is Todo {
  if (item === null || typeof item !== 'object') {
    return false;
  }
  const candidate = item as Record<string, unknown>;
  return (
    typeof candidate.id === 'number' &&
    typeof candidate.task === 'string' &&
    (candidate.statusComplete === 'active' ||
      candidate.statusComplete === 'done')
  );
}

// check is todo adalah array
export function isTodoArray(data: unknown): data is Todo[] {
  return Array.isArray(data) && data.every(isTodoItem);
}

// validasi untuk konfirmasiS
export async function askConfirm(question: string): Promise<boolean> {
  while (true) {
    const answer = (await rl.question(question)).trim().toLowerCase();
    if (answer === 'y') return true;
    if (answer === 'n') return false;
    console.log('Invalid input. Please enter "y" or "n".');
  }
}

// Fungsi untuk render tampilan list Todo, fungsi bisa di-call dari fungsi lain yang membutuhkan list
// Parameter adalah Title dan Filter type list
export function renderTodoList(todo: Todo[], title: string): void {
  console.log(`\n${'='.repeat(10)} ${title.trim()} ${'='.repeat(10)}`);

  if (todo.length === 0) {
    console.log('No todos found.');
  } else {
    todo.forEach((t, index) => {
      let resIndex = String(index + 1).padStart(2, '0');
      let statusActive = `[${t.statusComplete}]`.padEnd(10);
      const dateCreated = dateFormat(t.dateCreate);

      const dateCompleteStr = t.dateComplete
        ? `(Complete Date : ${dateFormat(t.dateComplete)})`
        : '';

      console.log(
        `${resIndex}. ${statusActive} ${t.task.padEnd(30)} Created : ${dateCreated.padEnd(20)} ${dateCompleteStr}`
      );
    });
  }
  console.log('='.repeat(22 + title.length));
}

// Format Tanggal :
function dateFormat(date: Date | string | null | undefined): string {
  if (!date || String(date) === 'null') {
    return 'null';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'null';
  }

  return dateObj
    .toLocaleDateString('en-GB', {
      timeZone: 'Asia/Jakarta', // Restricts calculation bounds to Indonesia
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(',', '');
}
