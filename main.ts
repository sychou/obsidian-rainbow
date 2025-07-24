import { App, Plugin, PluginSettingTab, Setting, MarkdownPostProcessorContext, MarkdownView } from 'obsidian';
import { CSVRenderer } from './csv-renderer';

interface RainbowCSVSettings {
	enabled: boolean;
	maxColumns: number;
	maxRows: number;
}

const DEFAULT_SETTINGS: RainbowCSVSettings = {
	enabled: true,
	maxColumns: 15,
	maxRows: 500
};

export default class RainbowCSVPlugin extends Plugin {
	settings!: RainbowCSVSettings;
	csvRenderer!: CSVRenderer;

	async onload() {
		await this.loadSettings();
		
		this.csvRenderer = new CSVRenderer(this.settings);

		this.registerMarkdownCodeBlockProcessor('csv', (source, el, ctx) => {
			this.processCSVCodeBlock(source, el, ctx);
		});

		this.addCommand({
			id: 'toggle-rainbow-csv',
			name: 'Toggle Rainbow CSV',
			callback: () => {
				this.settings.enabled = !this.settings.enabled;
				this.saveSettings();
				this.csvRenderer.updateSettings(this.settings);
				
				// Refresh all markdown views
				this.app.workspace.iterateAllLeaves((leaf) => {
					if (leaf.view.getViewType() === 'markdown') {
						const view = leaf.view as MarkdownView;
						if (view.previewMode) {
							view.previewMode.rerender(true);
						}
					}
				});
			}
		});

		this.addSettingTab(new RainbowCSVSettingTab(this.app, this));
	}

	onunload() {
		// Cleanup is handled automatically by Obsidian
	}

	private processCSVCodeBlock(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		const rendered = this.csvRenderer.renderCSV(source);
		el.empty();
		el.appendChild(rendered);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		if (this.csvRenderer) {
			this.csvRenderer.updateSettings(this.settings);
		}
	}
}

class RainbowCSVSettingTab extends PluginSettingTab {
	plugin: RainbowCSVPlugin;

	constructor(app: App, plugin: RainbowCSVPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl('h2', { text: 'Rainbow CSV Settings' });

		new Setting(containerEl)
			.setName('Enable Rainbow CSV')
			.setDesc('Toggle rainbow coloring for CSV code blocks')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enabled)
				.onChange(async (value) => {
					this.plugin.settings.enabled = value;
					await this.plugin.saveSettings();
					
					// Refresh all markdown views
					this.app.workspace.iterateAllLeaves((leaf) => {
						if (leaf.view.getViewType() === 'markdown') {
							const view = leaf.view as MarkdownView;
							if (view.previewMode) {
								view.previewMode.rerender(true);
							}
						}
					});
				}));

		new Setting(containerEl)
			.setName('Maximum Columns')
			.setDesc('Maximum number of columns to color (colors will cycle after this)')
			.addSlider(slider => slider
				.setLimits(5, 20, 1)
				.setValue(this.plugin.settings.maxColumns)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.maxColumns = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Maximum Rows')
			.setDesc('Maximum number of rows to render for large CSVs (for performance)')
			.addSlider(slider => slider
				.setLimits(100, 2000, 50)
				.setValue(this.plugin.settings.maxRows)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.maxRows = value;
					await this.plugin.saveSettings();
				}));
	}
}
