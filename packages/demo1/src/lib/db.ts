import type { Task } from '@capsule-mono-repo/capsule-client';
import Dexie, { type Table } from 'dexie';

export class TodoDB extends Dexie {
	todos!: Table<Task>;

	constructor() {
		super('TodoDB');
		this.version(2).stores({
			todos: '++id, text, completed, createdAt, dueDate'
		});
	}
}

export const db = new TodoDB();
