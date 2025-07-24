import { Plugin } from 'obsidian';

interface RainbowCSVSettings {
	enabled: boolean;
}

const DEFAULT_SETTINGS: RainbowCSVSettings = {
	enabled: true
};

export default class RainbowCSVPlugin extends Plugin {
	settings!: RainbowCSVSettings;

	async onload() {
		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor('csv', (source, el) => {
			if (!this.settings.enabled) {
				el.textContent = source;
				return;
			}
			
			el.innerHTML = this.colorizeCSV(source);
		});

		this.addCommand({
			id: 'toggle-rainbow-csv',
			name: 'Toggle Rainbow CSV',
			callback: () => {
				this.settings.enabled = !this.settings.enabled;
				this.saveSettings();
			}
		});
	}

	private colorizeCSV(source: string): string {
		const colors = [
			'#e74c3c', // Red
			'#f39c12', // Orange  
			'#f1c40f', // Yellow
			'#27ae60', // Green
			'#3498db', // Blue
			'#9b59b6', // Purple
			'#e91e63', // Pink
			'#1abc9c', // Teal
			'#34495e', // Dark Blue Grey
			'#95a5a6', // Blue Grey
			'#d35400', // Dark Orange
			'#8e44ad', // Dark Purple
			'#16a085', // Dark Teal
			'#c0392b', // Dark Red
			'#2980b9'  // Strong Blue
		];

		const lines = source.split('\n');
		const divs: string[] = [];

		// Add header div (without copy button since Obsidian adds edit button)
		divs.push(`<div class="HyperMD-codeblock HyperMD-codeblock-begin HyperMD-codeblock-begin-bg HyperMD-codeblock-bg cm-line" dir="ltr"><img class="cm-widgetBuffer" aria-hidden="true"><span contenteditable="false"></span><img class="cm-widgetBuffer" aria-hidden="true"></div>`);

		for (const line of lines) {
			if (line.trim() === '') {
				continue;
			}

			// Simple CSV parsing - split by comma
			const cells = line.split(',');
			const coloredCells: string[] = [];

			for (let i = 0; i < cells.length; i++) {
				const cell = cells[i].trim();
				const color = colors[i % colors.length];
				coloredCells.push(`<span style="color: ${color};">${this.escapeHtml(cell)}</span>`);
			}

			divs.push(`<div class="HyperMD-codeblock HyperMD-codeblock-bg cm-line" dir="ltr"><span class="cm-hmd-codeblock" spellcheck="false">${coloredCells.join(', ')}</span></div>`);
		}

		// Add footer div
		divs.push(`<div class="HyperMD-codeblock HyperMD-codeblock-bg HyperMD-codeblock-end HyperMD-codeblock-end-bg cm-line" dir="ltr"><img class="cm-widgetBuffer" aria-hidden="true"><span contenteditable="false"></span><img class="cm-widgetBuffer" aria-hidden="true"></div>`);

		return divs.join('');
	}

	private escapeHtml(text: string): string {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
