// import * as readline from 'readline/promises';
// import { stdin as input, stdout as output } from 'process';

import { FILE_PATH, readTodos, saveTodos } from './storage';
import { Todo, MenuItem } from './types';
import { rl, mainTodoApp } from '.';
import { mainmenuList } from './utils';
// import { promises } from 'dns';
import * as fs from 'fs';

// TODO: Import tipe-tipe yang sudah didefinisikan di types.ts

// TODO: Import fungsi storage untuk baca/tulis file

// TODO: Buat fungsi untuk menambahkan To-Do baru
// - Generate id yang unik (bisa pakai timestamp atau counter)
// - Pastikan text tidak kosong
// - Set default status sebagai active

// TODO: Buat fungsi untuk menandai To-Do sebagai selesai
// - Cari To-Do berdasarkan id
// - Ubah statusnya menjadi completed
// - Handle kasus jika id tidak ditemukan

// TODO: Buat fungsi untuk menghapus To-Do
// - Filter To-Do berdasarkan id
// - Handle kasus jika id tidak ditemukan

// TODO: Buat fungsi untuk menampilkan semua To-Do
// - Tampilkan dengan format yang rapi
// - Tambahkan status [ACTIVE] atau [DONE] di depan setiap To-Do
// - Berikan nomor urut untuk memudahkan user memilih

// TODO: Buat fungsi untuk mencari To-Do berdasarkan keyword

// Function: Show menu
export async function showMenu(menu: MenuItem[]): Promise<void> {
  console.log('\n============ OPTION MENU ============');
  menu.forEach((item) => {
    console.log(`  [${item.id}] ${item.menuTitle.padEnd(22)}`);
  });
  console.log('=====================================\n');
}

// export const runTodoApps = async () => {
//   showMenu(mainmenuList);
// };

// export const runMenuApps = async () => {
//   // Configures the promise-based input stream prompt
//   showMenu(mainmenuList);
// };

export async function addTodo(): Promise<void> {
  let addingMore = true;

  while (addingMore) {
    let task = '';

    while (true) {
      const inputTask = await rl.question('\nEnter your todo task: ');
      task = inputTask.trim();

      if (task.length > 0) {
        break;
      }
      console.log('Error: Task cannot be empty. Please try again.');
    }

    // todoList.push({ id: nextId++, task });
    // const todos = readTodos();
    const newTodo: Todo = {
      id: Date.now(), //todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
      task: task,
      isCompleted: false,
      dateCreate: new Date(),
    };

    // saveTodos([...todos, newTodo]);
    console.log(`Added: "${task}"`);
    // console.log('Todo added successfully!');

    while (true) {
      const reply = await rl.question('Do you want to add more todo? (y/n): ');
      const sanitizedReply = reply.trim().toLowerCase();

      if (sanitizedReply === 'y') {
        break;
      } else if (sanitizedReply === 'n') {
        addingMore = false;
        showMenu(mainmenuList);
        mainTodoApp();
        break;
      } else {
        console.log('Invalid input. Please enter "y" for yes or "n" for no.');
      }
    }
  }
  // const todos = readTodos();
  // const newTodo: Todo = {
  //   id: Date.now(), //todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
  //   task: Task,
  //   isCompleted: false,
  //   dateCreate: new Date(),
  // };
  // //
  // //saveTodos([...todos, newTodo]);
  // console.log(`Added: "${Task}"`);
}

// const listTodos = (): void => {
//   const todos = readTodos();
//   console.log('\n--- My Todo List ---');
//   todos.forEach((t) => {
//     console.log(`${t.id}. [${t.isCompleted ? 'x' : ' '}] ${t.task}`);
//   });
// };

// 2. fungsi untuk menandai To-Do sebagai selesai
export async function markTodo(): Promise<void> {
  if (!fs.existsSync(FILE_PATH)) {
    console.log('\nError: No todo list found. Add a todo first.');
    return;
  }
  const fileData = fs.readFileSync(FILE_PATH, 'utf-8');
  const todoList: Todo[] = JSON.parse(fileData);

  if (todoList.length === 0) {
    console.log('\nError: Your todo list is empty.');
    return;
  }
  const inputId = await rl.question(
    '\nEnter the Todo ID to mark as complete: '
  );
  const targetId = parseInt(inputId.trim(), 10);

  if (isNaN(targetId)) {
    console.log('Error: Please enter a valid numeric ID.');
    return;
  }

  const todoItem = todoList.find((item) => item.id === targetId);

  if (!todoItem) {
    console.log(`Error: Todo with ID ${targetId} not found.`);
    return;
  }
  if (todoItem.isCompleted) {
    console.log(`Todo "${todoItem.task}" is already marked as completed.`);
    return;
  }

  todoItem.isCompleted = true;
  fs.writeFileSync(FILE_PATH, JSON.stringify(todoList, null, 2), 'utf-8');

  console.log(`Success: "${todoItem.task}" has been marked as complete!`);
}

export async function deleteTodo(): Promise<void> {
  let deletingMore = true;

  while (deletingMore) {
    // 1. Guard clause: Ensure data file contains records
    if (!fs.existsSync(FILE_PATH)) {
      console.log('\nError: No todo list found.');
      break;
    }

    const fileData = fs.readFileSync(FILE_PATH, 'utf-8');
    const todoList: Todo[] = JSON.parse(fileData);

    if (todoList.length === 0) {
      console.log('\nError: Your todo list is empty.');
      break;
    }

    // 2. Select targeted element
    const inputId = await rl.question('\nEnter the Todo ID to delete: ');
    const targetId = parseInt(inputId.trim(), 10);

    if (isNaN(targetId)) {
      console.log('Error: Please enter a valid numeric ID.');
      continue; // Restarts current block to ask for ID again
    }

    listTodos();
    const itemIndex = todoList.findIndex((item) => item.id === targetId);
    if (itemIndex === -1) {
      console.log(`Error: Todo with ID ${targetId} not found.`);
      continue;
    }

    const targetTask = todoList[itemIndex].task;

    // 3. Prompt Action Confirmation Step
    let processDeletion = false;
    while (true) {
      const confirm = await rl.question(
        `Are you sure you want to delete "${targetTask}"? (y/n): `
      );
      const answer = confirm.trim().toLowerCase();

      if (answer === 'y') {
        processDeletion = true;
        break;
      } else if (answer === 'n') {
        console.log('Deletion canceled.');
        break;
      }
      console.log('Invalid input. Please enter "y" or "n".');
    }

    // 4. Update file if validated
    if (processDeletion) {
      todoList.splice(itemIndex, 1);

      // Re-index remaining array keys for display uniformity
      todoList.forEach((todo, index) => {
        todo.id = index + 1;
      });

      fs.writeFileSync(FILE_PATH, JSON.stringify(todoList, null, 2), 'utf-8');
      console.log(`Success: "${targetTask}" has been deleted.`);
    }

    // 5. Prompt Iteration Continuity Step
    while (true) {
      const askMore = await rl.question('\nDelete another todo list? (y/n): ');
      const answerMore = askMore.trim().toLowerCase();

      if (answerMore === 'y') {
        // Keeps loop context active to run another deletion check
        break;
      } else if (answerMore === 'n') {
        deletingMore = false; // Gracefully breaks execution block
        break;
      }
      console.log('Invalid input. Please enter "y" or "n".');
    }
  }
}

// list to do
export async function listTodos(): Promise<void> {
  const todos = readTodos();

  console.log('\n--- Your Todo List ---');

  if (todos.length === 0) {
    console.log('No todos found.');
  } else {
    todos.forEach((t, index) => {
      let resIndex = String(index + 1).padStart(2, '0');
      let status = t.isCompleted ? 'DONE' : 'ACTIVE';

      const dateObj = new Date(t.dateCreate);

      console.log(
        `${resIndex}. [${status}] ${t.task.padEnd(30)} ${dateFormat(dateObj)}`
      );
    });
  }
  console.log('----------------------\n');
  await rl.question('Press Enter to return to the main menu...');
}

function dateFormat(date: Date) {
  return date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric', // '2-digit' changes "2026" to "26", numeric for full 2026
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Uses 24-hour time clock representation
    })
    .replace(',', '');
}
