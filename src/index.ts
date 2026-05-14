import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
// import { Todo } from './types';
import {
  showMenu,
  addTodo,
  markTodo,
  listTodos,
  deleteTodo,
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
const showDate: string = new Date().toDateString();
console.log(`\nToday : ${showDate}`);
// function untuk memanggil opsi menu
showMenu(mainmenuList);

export const rl = readline.createInterface({ input, output });

export const mainTodoApp = async () => {
  // Configures the promise-based input stream prompt
  // const rl = readline.createInterface({ input, output });
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

      case '6': {
        console.log('Exiting...');
        isProgramRun = false;
        break;
      }
    }
  }

  // Closes the input streams safely to prevent terminal hanging
  rl.close();
};

mainTodoApp();
