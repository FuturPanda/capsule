<script lang="ts">
	import { Github, Twitter, Mail, Icon } from 'lucide-svelte';

	const currentYear = new Date().getFullYear();

	const footerLinks = [
		{
			title: 'Product',
			links: [
				{ name: 'Features', href: '#' },
				{ name: 'Pricing', href: '#' },
				{ name: 'Security', href: '#' },
				{ name: 'Roadmap', href: '#' }
			]
		},
		{
			title: 'Resources',
			links: [
				{ name: 'Documentation', href: 'https://docs.capsule.sh' },
				{ name: 'API Reference', href: '#' },
				{ name: 'Blog', href: '#' },
				{ name: 'Knowledge Base', href: '#' }
			]
		},
		{
			title: 'Company',
			links: [
				{ name: 'About', href: '#' },
				{ name: 'Team', href: '#' },
				{ name: 'Careers', href: '#' },
				{ name: 'Contact', href: '#' }
			]
		},
		{
			title: 'Legal',
			links: [
				{ name: 'Privacy Policy', href: '#' },
				{ name: 'Terms of Service', href: '#' },
				{ name: 'Cookie Policy', href: '#' }
			]
		}
	];
	const GithubIcon = Github;
	const TwitterIcon = Twitter;
	const MailIcon = Mail;
	const socialLinks = [
		{ icon: 'github', href: 'https://github.com/capsule-org', label: 'GitHub' },
		{ icon: 'twitter', href: 'https://twitter.com/capsuleorg', label: 'Twitter' },
		{ icon: 'mail', href: 'mailto:hello@capsule.sh', label: 'Email' }
	];
</script>

<footer class="border-t border-gray-800 bg-black">
	<div class="container mx-auto px-6 py-12">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-6 lg:grid-cols-12">
			<div class="md:col-span-2 lg:col-span-3">
				<h2 class="mb-4 text-xl font-bold text-white">capsule</h2>
				<p class="mb-6 max-w-xs text-gray-400">
					Your personal cloud with end-to-end privacy and true data interoperability.
				</p>

				<div class="flex space-x-4">
					{#each socialLinks as { icon, href, label }}
						<a
							{href}
							aria-label={label}
							class="text-gray-400 transition-colors hover:text-teal-500"
						>
							{#if icon === 'github'}
								<GithubIcon size={20} />
							{:else if icon === 'twitter'}
								<TwitterIcon size={20} />
							{:else if icon === 'mail'}
								<MailIcon size={20} />
							{:else}
								<Icon size={20} />
							{/if}
						</a>
					{/each}
				</div>
			</div>

			{#each footerLinks as section}
				<div class="md:col-span-1 lg:col-span-2">
					<h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
						{section.title}
					</h3>
					<ul class="space-y-2">
						{#each section.links as link}
							<li>
								<a href={link.href} class="text-gray-300 transition-colors hover:text-teal-400">
									{link.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<div class="mt-12 border-t border-gray-800 pt-8">
			<div class="flex flex-col items-start justify-between md:flex-row md:items-center">
				<div class="mb-6 max-w-md md:mb-0">
					<h3 class="mb-2 font-medium text-white">Stay updated</h3>
					<p class="text-sm text-gray-400">
						Subscribe to our newsletter for product updates and announcements.
					</p>
				</div>
				<div class="flex w-full md:w-auto">
					<input
						type="email"
						placeholder="Enter your email"
						class="w-full rounded-l-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 md:w-64"
					/>
					<button
						class="rounded-r-md bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700"
					>
						Subscribe
					</button>
				</div>
			</div>
		</div>

		<div
			class="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 text-sm text-gray-400 md:flex-row"
		>
			<p>© {currentYear} Capsule. All rights reserved.</p>
			<p class="mt-4 md:mt-0">Made with ❤️ in Marseille, France</p>
		</div>
	</div>
</footer>
