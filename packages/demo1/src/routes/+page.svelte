<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import useCapsuleClient from '$lib/capsule-client.svelte';
	import { CapsuleEventType, type GetTask } from '@capsulesh/shared-types';

	let newTodoText = $state('');
	let newTodoDueDate = $state('');
	let isLoggedIn = $state(false);
	let client = useCapsuleClient();
	let todos: GetTask[] | undefined = $state([]);
	onMount(async () => {
		isLoggedIn = client.authStatus();

		if (!isLoggedIn) {
			goto('/login');
		}
		todos = await client.models.tasks?.select().list();
		console.log('after query todos :: ', todos);
	});

	/*client.on(CapsuleEventType.TASKS_CREATED, ({ task }) => {
		todos = [...todos, task];
	});
	client.on(CapsuleEventType.TASKS_DELETED, ({ task: id }) => {
		todos = todos?.filter((todo) => todo.id !== id);
	});
	client.on(CapsuleEventType.TASKS_UPDATED, ({ task }) => {
		todos = todos?.map((todo) => (todo.id === task.id ? task : todo));
		});*/

	function handleLogout() {
		localStorage.removeItem('isLoggedIn');
		goto('/login');
	}

	// let todos = liveQuery(() =>
	// 	db.todos
	// 		.orderBy('dueDate')
	// 		.filter((todo) => todo.dueDate !== null)
	// 		.reverse()
	// 		.toArray()
	// 		.then(async (todosWithDueDate) => {
	// 			const todosWithoutDueDate = await db.todos
	// 				.filter((todo) => todo.dueDate === null)
	// 				.reverse()
	// 				.toArray();
	// 			return [...todosWithDueDate, ...todosWithoutDueDate];
	// 		})
	// );

	async function addTodo() {
		if (!newTodoText.trim()) return;

		// await db.todos.add({
		// 	id: 1387,
		// 	content: newTodoText,
		// 	isCompleted: false,
		// 	dueDate: newTodoDueDate ?? null
		// });
		//
		client.models.tasks?.create({
			content: newTodoText,
			isCompleted: false,
			dueDate: newTodoDueDate ?? null
		});

		newTodoText = '';
		newTodoDueDate = '';
	}

	async function toggleTodo(todo: GetTask) {
		if (!todo.id) return;
		//await db.todos.update(todo.id, { completed: !todo.completed });
		console.log('todo toggled ::: ', todo, todo.isCompleted);
		client.models.tasks?.update(todo.id, { isCompleted: !todo.isCompleted });
	}

	async function deleteTodo(id: number) {
		// await db.todos.delete(id);
		await client.models.tasks?.delete(id);
	}

	async function updateDueDate(todo: GetTask, dueDate: string) {
		if (!todo.id) return;
		// await db.todos.update(todo.id, {
		// 	dueDate: dueDate ? new Date(dueDate) : null
		// });
		client.models.tasks?.update(todo.id, { dueDate: dueDate });
	}

	function formatDateForInput(date: Date | string | null): string {
		if (!date) return '';

		if (typeof date === 'string') {
			return new Date(date).toISOString().split('T')[0];
		}

		return date.toISOString().split('T')[0];
	}

	function getDueDateStatus(dueDate: string | null): string {
		if (!dueDate) return '';

		const now = new Date();
		const due = new Date(dueDate);
		due.setHours(23, 59, 59, 999);

		if (now > due) return 'overdue';

		const daysUntilDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
		if (daysUntilDue <= 2) return 'due-soon';
		return '';
	}
</script>

<main>
	<div class="header">
		<h1>BEAUTIFUL Todo</h1>
		<button class="logout-btn" onclick={handleLogout}>Logout</button>
	</div>

	<form onsubmit={addTodo}>
		<input bind:value={newTodoText} placeholder="What needs to be done?" type="text" />
		<input bind:value={newTodoDueDate} placeholder="Due date (optional)" type="date" />
		<button type="submit">Add</button>
	</form>

	<!-- {#if $todos}
		<ul>
			{#each $todos as todo (todo.id)}
				<li class={getDueDateStatus(todo.dueDate ?? null)}>
					<input type="checkbox" checked={todo.completed} onchange={() => toggleTodo(todo)} />
					<span class:completed={todo.completed}>
						{todo.text}
					</span>
					<input
						type="date"
						value={formatDateForInput(todo.dueDate ?? null)}
						onchange={(e) => updateDueDate(todo, e.currentTarget.value)}
						class="due-date-input"
					/>
					<button onclick={() => deleteTodo(todo.id!)}>×</button>
				</li>
			{/each}
		</ul> -->
	{#if todos}
		<ul>
			{#each todos as todo (todo)}
				<li class={getDueDateStatus(todo.dueDate ?? null)}>
					<input type="checkbox" checked={todo.isCompleted} onchange={() => toggleTodo(todo)} />
					<span class:completed={todo.isCompleted}>
						{todo.content}
					</span>
					<input
						type="date"
						value={formatDateForInput(todo.dueDate ?? null)}
						onchange={(e) => updateDueDate(todo, e.currentTarget.value)}
						class="due-date-input"
					/>
					<button onclick={() => deleteTodo(todo.id!)}>×</button>
				</li>
			{/each}
		</ul>
	{:else}
		<p>Loading todos...</p>
	{/if}
</main>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.logout-btn {
		padding: 0.3rem 0.8rem;
		background: #000;
		color: #fff;
		border: none;
		cursor: pointer;
	}

	.logout-btn:hover {
		background: #333;
	}

	.due-date-input {
		padding: 0.25rem;
		border: 1px solid #000;
		font-family: monospace;
		font-size: 0.8rem;
		width: auto;
	}

	.overdue {
		border-left: 4px solid #ff0000;
	}

	.due-soon {
		border-left: 4px solid #ffa500;
	}

	form {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	input[type='date'] {
		padding: 0.5rem;
		border: 2px solid #000;
		font-family: monospace;
	}

	li {
		display: grid;
		grid-template-columns: auto 1fr auto auto;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		border: 1px solid #000;
		margin-bottom: 0.5rem;
	}

	/* Override the existing li button style */
	li button {
		padding: 0.25rem 0.5rem;
	}

	/* Add a hover effect for the date input */
	.due-date-input:hover {
		border-color: #333;
	}

	/* Style for empty date input */
	.due-date-input:not([value]) {
		color: #666;
	}

	main {
		max-width: 600px;
		margin: 2rem auto;
		padding: 1rem;
		font-family: monospace;
	}

	h1 {
		font-size: 2rem;
		text-transform: uppercase;
		margin: 0;
	}

	form {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	input[type='text'] {
		flex: 1;
		padding: 0.5rem;
		border: 2px solid #000;
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

	ul {
		list-style: none;
		padding: 0;
	}

	li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		border: 1px solid #000;
		margin-bottom: 0.5rem;
	}

	.completed {
		text-decoration: line-through;
		color: #666;
	}

	li button {
		margin-left: auto;
		padding: 0.25rem 0.5rem;
	}
</style>
