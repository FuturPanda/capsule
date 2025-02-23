import Dexie, { type Table } from 'dexie';

export interface Todo {
	id?: number;
	text: string;
	completed: boolean;
	createdAt: Date;
	dueDate?: Date | null;
}

export class TodoDB extends Dexie {
	todos!: Table<Todo>;

	constructor() {
		super('TodoDB');
		this.version(2).stores({
			todos: '++id, text, completed, createdAt, dueDate'
		});
	}
}

export const db = new TodoDB();
