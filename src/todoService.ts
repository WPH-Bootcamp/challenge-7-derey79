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
      task = await rl.question('\nEnter new todo task : ');
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
      dateCreate: new Date().toISOString(),
    };

    saveTodos([...todos, newTodo]);
    renderTodoList([newTodo], 'New Add Task');

    // konfirm apakah mau menambah task ?
    const addAnother = await askConfirm(
      '\nDo you want to add another todo? (y/n): '
    );

    if (!addAnother) {
      addMoreTodo = false;
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

  // render list
  renderTodoList(pendingTodos, 'Select Todo for Mark');

  const inputId = await rl.question(
    '\nEnter the display No to mark as complete (or press Enter/"c" to cancel): '
  );
  const inputTrim = inputId.trim().toLowerCase();

  // handle kalau cancel
  if (inputTrim === '' || inputTrim === 'c') {
    console.log('Mark operation cancelled.');
    mainTodoApp();
    return;
  }

  const displayNo = parseInt(inputTrim, 10);
  const targetArrayIndex = displayNo - 1;

  // validasi untuk range nomor index di display
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

  // pilih data yang sesuai dengan nomor index
  const selectedTask = pendingTodos[targetArrayIndex];
  const masterItem = todos.find((item) => item.id === selectedTask.id);

  if (masterItem) {
    masterItem.statusComplete =
      masterItem.statusComplete === 'active' ? 'done' : 'active';
    masterItem.dateComplete = new Date().toISOString();

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

    // 1. Render list todo yang akan di delete
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
    const targetArrayIndex = displayNo - 1;

    // validasi nomor index di list
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

    // konfirmasi sebelum delete
    const processDeletion = await askConfirm(
      `Are you sure you want to delete "${targetItem.task}"? (y/n): `
    );

    if (processDeletion) {
      todos.splice(targetArrayIndex, 1);
      saveTodos(todos);
      console.log(`Success: "${targetItem.task}" has been deleted.`);
    } else {
      console.log('Deletion canceled.');
    }

    // konfirmasi apakah melakukan delete lagi?
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
export async function listTodos(): Promise<void> {
  let listScreen = true;
  while (listScreen) {
    const todos = readTodos();
    renderTodoList(todos, 'List All Todo Task');

    const exitListScreen = await rl.question(
      '\nDo you want to exit to Main Menu? (y): '
    );

    if (exitListScreen.toLowerCase() === 'y') {
      listScreen = false;
      mainTodoApp();
    }
  }
}

// 05. Fungsi untuk mencari To-Do
export async function searchTodo(): Promise<void> {
  let searchingMore = true;

  while (searchingMore) {
    const searchKeyword = await rl.question('\nEnter search keyword: ');
    const keywordTrim = searchKeyword.trim().toLowerCase();

    // 1. validasi apakah keyword null
    if (keywordTrim.length === 0) {
      console.log('Error: Search keyword cannot be empty.');
      continue; //
    }

    const todos = readTodos();

    // 2. filter array berdasarkan keyword
    const matches = todos.filter((item) =>
      item.task.toLowerCase().includes(keywordTrim)
    );

    // 3. Render tampilan list ToDo
    if (matches.length === 0) {
      console.log(`No entries match your keyword: "${searchKeyword.trim()}"`);
    } else {
      console.log(
        `\nFound ${matches.length} result(s) for keyword "${searchKeyword.trim()}"`
      );
      renderTodoList(matches, 'List of Result(s)');
    }

    // 4. konfirmasi apakah mencari berdasarkan keyword lain
    const searchAnother = await askConfirm(
      '\nDo you want to search another task? (y/n): '
    );

    if (!searchAnother) {
      searchingMore = false;
      mainTodoApp();
    }
  }
}
