// import * as readline from 'readline/promises';
// import { stdin as input, stdout as output } from 'process';

import { FILE_PATH, readTodos, saveTodos } from './storage';
import { Todo, MenuItem, TodoStatus } from './types';
import { rl, mainTodoApp } from '.';
import { renderTodoList, isValidTodo, askConfirm, mainmenuList } from './utils';
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

// 1. Fungsi untuk menambah To Do baru, akan menambah di file todos.json
export async function addTodo(): Promise<void> {
  let addMoreTodo = true;
  const todos = readTodos();
  while (addMoreTodo) {
    let task = '';

    let isInputValid = false;
    while (!isInputValid) {
      task = await rl.question('\nEnter your todo task: ');
      const result = isValidTodo(task, todos);
      if (result.isValid) {
        isInputValid = true;
      } else {
        console.log(`Error: ${result.message}`);
      }
    }

    //
    const newTodo: Todo = {
      id: Date.now(),
      task: task,
      statusComplete: 'active',
      dateCreate: new Date(),
    };

    saveTodos([...todos, newTodo]);
    renderTodoList([newTodo], 'New Add Task');
    // konfirm apakah mau menambah task ?
    const askMore = await rl.question(
      'Do you want to add another todo? (y/n): '
    );

    if (askMore.trim().toLowerCase() === 'y') {
      await addTodo();
    } else {
      mainTodoApp();
    }
  }
}

// 2. fungsi untuk menandai To-Do sebagai selesai
export async function markTodo(): Promise<void> {
  const todos = readTodos();

  // 1. Filter out only pending tasks ('active')
  const pendingTodos = todos.filter((item) => item.statusComplete === 'active');

  if (pendingTodos.length === 0) {
    console.log('No pending task, all todo already done!');
    mainTodoApp();
    return;
  }

  // 2. Render the list (User sees 1, 2, 3... corresponding to the pending list)
  renderTodoList(pendingTodos, 'Select Todo for Mark');

  const inputId = await rl.question(
    '\nEnter the display No to mark as complete (or press Enter/"c" to cancel): '
  );
  const inputTrim = inputId.trim().toLowerCase();

  // 3. Handle cancel paths safely
  if (inputTrim === '' || inputTrim === 'c') {
    console.log('Mark operation cancelled.');
    mainTodoApp();
    return;
  }

  const displayNo = parseInt(inputTrim, 10);
  const targetArrayIndex = displayNo - 1;

  // 4. Validate that the input matches the visible list boundaries
  if (
    isNaN(displayNo) ||
    targetArrayIndex < 0 ||
    targetArrayIndex >= pendingTodos.length
  ) {
    console.log(
      'Error: Invalid selection. Please enter a valid number from the list.'
    );
    mainTodoApp();
    return;
  }

  // 5. Safely grab the selected task from the visible pending list
  const selectedTask = pendingTodos[targetArrayIndex];

  // 6. Locate its matching pointer in the master database array using its ID
  const masterItem = todos.find((item) => item.id === selectedTask.id);

  if (masterItem) {
    // Clean extracted ternary pattern
    masterItem.statusComplete =
      masterItem.statusComplete === 'active' ? 'done' : 'active';

    // Optional property support (if your type interface includes a completed date)
    (masterItem as any).dateComplete = new Date().toISOString();

    saveTodos(todos);
    console.log(`Success: "${masterItem.task}" has been marked as complete!`);
  }

  mainTodoApp();
}

// 03. Fungsi untuk menghapus To Do dari file todos.json
export async function deleteTodo(): Promise<void> {
  let deletingMore = true;

  while (deletingMore) {
    const todos = readTodos();

    if (todos.length === 0) {
      console.log('\nYour todo list is currently empty.');
      mainTodoApp();
      return;
    }

    // 1. Render list (Indices 1, 2, 3... are printed on screen)
    renderTodoList(todos, 'Select Todo for Delete');

    const inputId = await rl.question(
      '\nEnter the display No to delete (or press Enter/"c" to cancel): '
    );
    const inputTrim = inputId.trim().toLowerCase();

    if (inputTrim === '' || inputTrim === 'c') {
      console.log('Delete operation cancelled.');
      mainTodoApp();
      return;
    }

    const displayNo = parseInt(inputTrim, 10);
    // 2. Convert human display number to computer array index position
    const targetArrayIndex = displayNo - 1;

    // Validate if selection is safely within the array bounds
    if (
      isNaN(displayNo) ||
      targetArrayIndex < 0 ||
      targetArrayIndex >= todos.length
    ) {
      console.log(
        'Error: Invalid selection. Please enter a valid number from the list.'
      );
      continue;
    }

    const targetItem = todos[targetArrayIndex];

    // 3. Confirm Deletion using helper
    const processDeletion = await askConfirm(
      `Are you sure you want to delete "${targetItem.task}"? (y/n): `
    );

    if (processDeletion) {
      // Remove item cleanly using its array index position
      todos.splice(targetArrayIndex, 1);
      saveTodos(todos);
      console.log(`Success: "${targetItem.task}" has been deleted.`);
    } else {
      console.log('Deletion canceled.');
    }

    // 4. Check Continuity using helper
    const deleteAnother = await askConfirm(
      '\nDelete another task list? (y/n): '
    );

    if (!deleteAnother) {
      deletingMore = false;
      mainTodoApp();
    }
  }
}

// 04. Fungsi untuk menampilkan semua To-Do
export function listTodos(): void {
  const todos = readTodos();
  renderTodoList(todos, 'List Todo');
  // await rl.question('Press Enter to return to the main menu...');
}

// 05. Fungsi untuk mencari To-Do
export async function searchTodo(): Promise<void> {
  const searchKeyword = await rl.question('\nEnter search keyword : ');
  const keywordTrim = searchKeyword.trim();
  if (keywordTrim.length === 0) {
    console.log('keyword is empty');
  }

  const todos = readTodos();
  // Filter matches using substring match
  const matches = todos.filter((item) =>
    item.task.toLowerCase().includes(keywordTrim.toLowerCase())
  );

  // console.log('\n================== Search Results ====================');
  if (matches.length === 0) {
    console.log(`No entries match your keyword: "${keywordTrim}"`);
  } else {
    console.log(
      `\nFound ${matches.length} result(s) for keyword "'${keywordTrim}'"`
    );
    // call fungsi render to do list
    renderTodoList(matches, `List of Result(s)`);
    // matches.forEach((item, index) => {
    //   let noIndex = String(index + 1).padStart(2, '0');
    //   let status = item.isCompleted ? 'DONE' : 'ACTIVE';
    //   let statusBlock = `[${status}]`.padEnd(10);
    //   console.log(
    //     ` ${noIndex}. [Id: ${item.id}] ${statusBlock} ${item.task.padEnd(30)} `
    //   );
    // });
  }
  console.log('\n');
}
