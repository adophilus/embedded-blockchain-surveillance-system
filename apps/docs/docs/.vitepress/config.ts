import "../../src/env";
import { defineConfig } from "vitepress";
import d2 from "vitepress-plugin-d2";
import { Layout, Theme, FileType } from "vitepress-plugin-d2/dist/config";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "Embedded Blockchain Surveillance System",
	description: "Documentation for the Embedded Blockchain Surveillance System",
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Smart Contracts", link: "/contracts/overview" },
			{ text: "Web Application", link: "/webapp/overview" },
			{ text: "API Reference", link: "/api" },
		],

		socialLinks: [
			{
				icon: "github",
				link: "https://github.com/adophilus/embedded-blockchain-surveillance-system",
			},
		],

		sidebar: [
			{
				text: "General Guide",
				items: [{ text: "Introduction", link: "/guide/introduction" }],
			},
			{
				text: "Smart Contracts",
				items: [
					{ text: "Overview", link: "/contracts/overview" },
					{ text: "Technical Details", link: "/contracts/technical-details" },
					{ text: "Flow of Operations", link: "/contracts/tasks" },
					{ text: "Deployment", link: "/contracts/deployment" },
					{ text: "Testing", link: "/contracts/testing" },
				],
			},
			{
				text: "Web Application",
				items: [
					{ text: "Overview", link: "/webapp/overview" },
					{ text: "Setup", link: "/webapp/setup" },
					{ text: "Components", link: "/webapp/components" },
				],
			},
			{
				text: "IPFS Integration",
				items: [
					{ text: "Overview", link: "/ipfs/overview" },
					{ text: "Usage", link: "/ipfs/usage" },
				],
			},
			{
				text: "Technical Information",
				items: [{ text: "System Architecture", link: "/technical-overview" }],
			},
			{
				text: "Project Report Materials",
				items: [
					{
						text: "Materials",
						items: [
							{ text: "Overview", link: "/project-report/materials-overview" },
							{ text: "Software", link: "/project-report/materials-software" },
							{ text: "Hardware", link: "/project-report/materials-hardware" },
						],
					},
					{ text: "System Images", link: "/project-report/images" },
					{ text: "Methods", link: "/project-report/methods" },
				],
			},
			{
				text: "Further Improvements",
				items: [{ text: "Token-Based Identity", link: "/further-improvement" }],
			},
		],
	},
	markdown: {
		config: (md) => {
			// Use D2 diagram plugin with optional configuration
			md.use(d2, {
				forceAppendix: false,
				layout: Layout.ELK,
				theme: Theme.VANILLA_NITRO_COLA,
				darkTheme: Theme.DARK_MUAVE,
				padding: 100,
				animatedInterval: 0,
				timeout: 120,
				sketch: true,
				center: false,
				scale: -1,
				target: "*",
				fontItalic: null,
				fontBold: null,
				fontSemiBold: null,
				fileType: FileType.SVG,
				directory: "d2-diagrams",
			});
		},
	},
});
