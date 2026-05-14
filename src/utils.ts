// TODO: Implementasikan type guards di sini
// Hint: Type guard berguna untuk memastikan tipe data saat runtime

// TODO: Buat fungsi untuk memvalidasi apakah suatu objek adalah To-Do yang valid

// TODO: Buat fungsi helper untuk menampilkan tanggal/waktu dengan format yang bagus

// TODO: Buat fungsi untuk memastikan input dari user adalah string yang valid

// import { timeStamp } from 'console';
import { readTodos, saveTodos } from './storage';
import { Todo, MenuItem } from './types';

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

// export async function addTodo(Task: string): Promise<void> {
//   const todos = readTodos();
//   const newTodo: Todo = {
//     id: Date.now(), //todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
//     task: Task,
//     isCompleted: false,
//     dateCreate: new Date(),
//   };
//   //
//   //saveTodos([...todos, newTodo]);
//   console.log(`Added: "${Task}"`);
// }

// const listTodos = (): void => {
//   const todos = readTodos();
//   console.log('\n--- My Todo List ---');
//   todos.forEach((t) => {
//     console.log(`${t.id}. [${t.isCompleted ? 'x' : ' '}] ${t.task}`);
//   });
// };

// const toggleTodo = (id: number): void => {
//   const todos = readTodos();
//   const updated = todos.map((t) =>
//     t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
//   );
//   saveTodos(updated);
//   console.log(`Updated ID: ${id}`);
// };

// // --- Quick Test ---
// addTodo('Buy coffee');
// addTodo('Write TypeScript code');
// toggleTodo(1);
// listTodos();
