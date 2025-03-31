// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeBlack from 'starlight-theme-black'

// https://astro.build/config
export default defineConfig({
    site: "https://docs.capsule.sh",
	integrations: [
		starlight({
			title: 'capsule',
			customCss: [
			'./src/css/custom.css'      ],
			social: {
				github: 'https://github.com/withastro/starlight',
			},
			sidebar: [
				{
					label: 'Get Started',
					items : [
					 {label: "Creation a Capsule", link: "./guides/creation"},
					 {label: "Self host a Capsule", link: "./guides/self-hosting"},
					 {label: "Deploy with Docker", link: "./guides/docker"},
					],
				},
				{
					label: 'ChiselORM',
					autogenerate: { directory: 'chisel' },
				},
				{
					label: 'Sdk',
					items : [
					 {label: "Installation", link: "./sdk/installation"},
					 {label: "Use Predefined Models", link: "./sdk/models"},
					 {label: "Create a database", link: "./sdk/database"},

					 {label: "Handle login", link: "./sdk/login"},
					],
				},
				{
					label: 'Philosophy',
					autogenerate: { directory: 'philosophy' },
				},
				{
					label: 'FAQ',
					autogenerate: { directory: 'faq' },
				},
			],
		}),
	],
});
