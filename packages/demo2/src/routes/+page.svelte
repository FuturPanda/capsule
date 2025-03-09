<script lang="ts">
	import { goto } from '$app/navigation';
	import useCapsuleClient from '$lib/capsule-client.svelte';
	import { db, type CalendarEvent } from '$lib/db';
	import { liveQuery } from 'dexie';
	import { onMount } from 'svelte';

	let isLoggedIn = $state(false);
	let currentDate = $state(new Date());
	let showEventForm = $state(false);
	let isEditing = $state(false);
	let editingEventId = $state<number | null>(null);

	let client = useCapsuleClient();
	let todosWithDueDate = $state([]);
	let events = $state([]);

	onMount(async () => {
		isLoggedIn = client.authStatus();

		if (!isLoggedIn) {
			goto('/login');
		}

		todosWithDueDate = await client.models.tasks
			?.select()
			.where({ due_date: { $neq: null } })
			.list();
		events = await client.models.events?.list();

		console.log(events);
	});

	let newEvent = $state({
		title: '',
		description: '',
		startDate: formatDateForInput(new Date()),
		startTime: '00:00',
		endDate: formatDateForInput(new Date()),
		endTime: '00:00'
	});

	let monthEvents = $derived(
		liveQuery(() => {
			const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
			const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
			return db.events.where('startDate').between(startOfMonth, endOfMonth).toArray();
		})
	);

	let calendar = $derived(generateCalendar(currentDate));

	function generateCalendar(date: Date) {
		const year = date.getFullYear();
		const month = date.getMonth();

		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);

		const days = [];
		const startPadding = firstDay.getDay();

		for (let i = 0; i < startPadding; i++) {
			days.push(null);
		}

		for (let i = 1; i <= lastDay.getDate(); i++) {
			days.push(new Date(year, month, i));
		}

		return days;
	}

	function getEventsForDay(date: Date, events: CalendarEvent[] | undefined) {
		if (!events) return [];
		return events.filter((event) => {
			const eventDate = new Date(event.startDate);
			return (
				eventDate.getDate() === date.getDate() &&
				eventDate.getMonth() === date.getMonth() &&
				eventDate.getFullYear() === date.getFullYear()
			);
		});
	}

	async function upsertEvent() {
		if (!newEvent.title.trim()) return;

		const startDateTime = new Date(`${newEvent.startDate}T${newEvent.startTime}`);
		const endDateTime = new Date(`${newEvent.endDate}T${newEvent.endTime}`);

		const eventData = {
			title: newEvent.title,
			description: newEvent.description,
			startDate: startDateTime,
			endDate: endDateTime,
			createdAt: new Date()
		};

		if (isEditing && editingEventId) {
			await db.events.update(editingEventId, eventData);
		} else {
			await db.events.add(eventData);
		}

		newEvent = {
			title: '',
			description: '',
			startDate: formatDateForInput(new Date()),
			startTime: '00:00',
			endDate: formatDateForInput(new Date()),
			endTime: '00:00'
		};
		isEditing = false;
		editingEventId = null;
		showEventForm = false;
	}

	async function editEvent(id: number) {
		const event = await db.events.get(id);
		if (event) {
			isEditing = true;
			editingEventId = id;
			newEvent = {
				title: event.title,
				description: event.description,
				startDate: formatDateForInput(event.startDate),
				startTime: formatTimeForInput(event.startDate),
				endDate: formatDateForInput(event.endDate),
				endTime: formatTimeForInput(event.endDate)
			};
			showEventForm = true;
		}
	}

	async function deleteEvent(id: number) {
		await db.events.delete(id);
	}

	function previousMonth() {
		currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
	}

	function nextMonth() {
		currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
	}

	function formatDateForInput(date: Date): string {
		return date.toISOString().split('T')[0];
	}

	function formatTimeForInput(date: Date): string {
		return date.toTimeString().slice(0, 5);
	}

	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
</script>

<main>
	<h1>Beautiful Calendar</h1>
	<ul>
		{todosWithDueDate}
	</ul>
	<div class="calendar-header">
		<button onclick={previousMonth}>&lt;</button>
		<h2>
			{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
		</h2>
		<button onclick={nextMonth}>&gt;</button>
	</div>

	<div class="calendar">
		{#each weekDays as day}
			<div class="weekday">{day}</div>
		{/each}

		{#each calendar as date}
			{#if date}
				<div class="day" class:today={date.toDateString() === new Date().toDateString()}>
					<button
						class="day-button"
						onclick={() => {
							newEvent = {
								...newEvent,
								startDate: formatDateForInput(date),
								endDate: formatDateForInput(date),
								startTime: '09:00',
								endTime: '17:00'
							};
							showEventForm = true;
						}}
						aria-label={date.toLocaleDateString('en-US', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					>
						<span class="date-number">{date.getDate()}</span>
					</button>

					{#if $monthEvents}
						<div class="events-container flex">
							{#each getEventsForDay(date, $monthEvents) as event}
								<div class="event">
									<button onclick={() => editEvent(event.id!)}>
										<span>{event.title}</span>
									</button>
									<button
										class="delete-event"
										onclick={() => deleteEvent(event.id!)}
										aria-label={`Delete event: ${event.title}`}>×</button
									>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{:else}
				<div class="day empty" role="presentation"></div>
			{/if}
		{/each}
	</div>

	{#if showEventForm}
		<div class="event-form">
			<h3>{isEditing ? 'Edit Event' : 'Add Event'}</h3>
			<form onsubmit={upsertEvent}>
				<input type="text" bind:value={newEvent.title} placeholder="Event Title" required />
				<textarea bind:value={newEvent.description} placeholder="Description"></textarea>
				<div class="datetime-inputs">
					<div>
						<label>Start:</label>
						<input type="date" bind:value={newEvent.startDate} required />
						<input type="time" bind:value={newEvent.startTime} required />
					</div>
					<div>
						<label>End:</label>
						<input type="date" bind:value={newEvent.endDate} required />
						<input type="time" bind:value={newEvent.endTime} required />
					</div>
				</div>
				<div class="form-buttons">
					<button type="submit">{isEditing ? 'Update' : 'Add'}</button>
					<button
						type="button"
						onclick={() => {
							showEventForm = false;
							isEditing = false;
							editingEventId = null;
							newEvent = {
								title: '',
								description: '',
								startDate: formatDateForInput(new Date()),
								startTime: '00:00',
								endDate: formatDateForInput(new Date()),
								endTime: '00:00'
							};
						}}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	{/if}
</main>

<style>
	main {
		max-width: 1000px;
		margin: 2rem auto;
		padding: 1rem;
		font-family: monospace;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 2rem;
		text-transform: uppercase;
	}

	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.calendar {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 1px;
		background: #000;
		border: 1px solid #000;
	}

	.weekday {
		background: #000;
		color: #fff;
		padding: 0.5rem;
		text-align: center;
	}

	.day {
		background: #fff;
		min-height: 100px;
		padding: 0.5rem;
		cursor: pointer;
		position: relative;
		width: 100%;
		text-align: left;
		border: none;
		font-family: monospace;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.day:hover {
		background: #f0f0f0;
	}

	.day:focus {
		outline: 2px solid #000;
		background: #f0f0f0;
	}

	.empty {
		background: #eee;
		pointer-events: none;
	}

	.today {
		background: #ffffdd;
	}

	.date-number {
		font-weight: bold;
		margin-bottom: 0.5rem;
		display: block;
	}

	.event {
		font-size: 0.8rem;
		padding: 0.2rem;
		margin-bottom: 0.2rem;
		background: #000;
		color: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.delete-event {
		background: none;
		border: none;
		color: #fff;
		cursor: pointer;
		padding: 0 0.3rem;
	}

	.event-form {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: #fff;
		padding: 2rem;
		border: 2px solid #000;
		max-width: 500px;
		width: 90%;
	}

	.event-form form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.datetime-inputs {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	input,
	textarea {
		padding: 0.5rem;
		border: 1px solid #000;
		font-family: monospace;
	}

	textarea {
		height: 100px;
	}

	button {
		padding: 0.5rem 1rem;
		background: #000;
		color: #fff;
		border: none;
		cursor: pointer;
	}

	button:hover {
		background: #333;
	}

	.form-buttons {
		display: flex;
		gap: 1rem;
	}
</style>
