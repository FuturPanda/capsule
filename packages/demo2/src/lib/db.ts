import Dexie, { type Table } from 'dexie';

export interface CalendarEvent {
	id?: number;
	title: string;
	description: string;
	startDate: Date;
	endDate: Date;
	createdAt: Date;
}

export class CalendarDB extends Dexie {
	events!: Table<CalendarEvent>;

	constructor() {
		super('CalendarDB');
		this.version(1).stores({
			events: '++id, title, startDate, endDate, createdAt'
		});
	}
}

export const db = new CalendarDB();
