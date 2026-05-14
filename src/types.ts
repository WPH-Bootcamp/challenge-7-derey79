// TODO: Definisikan tipe data untuk To-Do item di sini
// Hint: To-Do sebaiknya memiliki id, text, dan status completed

// TODO: Buat interface untuk To-Do item

// TODO: Buat tipe untuk status To-Do (active/done)

// TODO: Buat tipe untuk fungsi-fungsi yang akan digunakan

// interface Todo {
//   id: number;
//   title: string;
//   isComplete?: boolean;
// }

export interface Todo {
  id: number;
  task: string;
  isCompleted: boolean;
  dateCreate: Date;
  dateComplete?: Date;
}

// type for main menu
export interface MenuItem {
  id: number;
  menuTitle: string;
  // isMandatory: boolean;
}
