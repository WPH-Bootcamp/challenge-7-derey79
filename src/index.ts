import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
// import { Todo } from './types';
import {
  showMenu,
  addTodo,
  markTodo,
  listTodos,
  deleteTodo,
  searchTodo,
} from './todoService';
import { mainmenuList } from './utils';
// TODO: Import readline untuk membaca input dari command line

// TODO: Import fungsi-fungsi dari todoService

// TODO: Import fungsi-fungsi dari utils (termasuk type guards)

// TODO: Buat fungsi untuk menampilkan menu utama
// Tampilkan opsi seperti:
// 1. Add new todo
// 2. Mark todo as complete
// 3. Delete todo
// 4. List all todos
// 5. Search todos
// 6. Exit

// TODO: Buat fungsi untuk handle input dari user
// Gunakan readline.question untuk menerima input

// TODO: Buat fungsi main yang akan menjalankan aplikasi secara loop
// Hint: Gunakan recursive function atau while loop

// TODO: Jalankan fungsi main
console.log('Welcome to TypeScript To-Do App!');
console.log('Start building your app here...');

export const rl = readline.createInterface({ input, output });

// exit handler supaya tidak menampilkan seperti error
rl.on('SIGINT', () => {
  console.log('\n\nOperation cancelled. Goodbye!');
  rl.close();
  process.exit(0);
});

export const mainTodoApp = async () => {
  const showDate: string = new Date().toDateString();
  console.log(`\nToday : ${showDate}`);
  showMenu(mainmenuList);
  let isProgramRun = true;
  // show main menu

  while (isProgramRun) {
    const choice = await rl.question('\nPlease insert an option (1-6): ');
    // const todos = readTodos();
    // const Todo: Todo[] = [];

    switch (choice.trim()) {
      case '1': {
        addTodo();
        break;
      }
      case '2': {
        await markTodo();
        break;
      }
      case '3': {
        deleteTodo();
        break;
      }
      case '4': {
        await listTodos();
        break;
      }
      case '5': {
        await searchTodo();
        break;
      }
      case '6': {
        console.log('Exiting...');
        isProgramRun = false;
        rl.close();
        break;
      }
    }
  }
};

mainTodoApp();
