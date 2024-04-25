import { GigachatClient } from 'data/gigachat_client';
import { PluginSettingsRepository } from 'data/settings_repository';
import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';
import { ChatModal } from 'ui/chat_modal';
import { SampleModal } from 'ui/sample_modal';
import { SettingsTab } from 'ui/settings_tab';

const DEFAULT_SETTINGS: PluginSettingsRepository = {
	apiToken: '',
	backendHost: 'http://0.0.0.0:8080',
}

export default class GigachatPlugin extends Plugin {
	settings: PluginSettingsRepository;
	client: GigachatClient;

	async onload() {
		await this.initSettings()
		this.initRibbonActions()
		this.initStatusBar()
		this.initCommands()
		await this.initGigachatClient()
	}

	onunload() {
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async initSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		this.addSettingTab(new SettingsTab(this.app, this));
	}

	initRibbonActions() {
		const ribbonIconEl = this.addRibbonIcon('bot', 'Gigachat', (evt: MouseEvent) => {
			new Notice('This is a notice!');
		});
		ribbonIconEl.addClass('my-plugin-ribbon-class');
	}

	initStatusBar() {
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Gigachat is running');
	}

	async initGigachatClient() {
		this.client = new GigachatClient(this.settings);
		const status = await this.client.healthCheckRequest();
		if (status == 200) {
			new Notice('Gigachat Server is running')
		} else {
			new Notice('Gigachat Server is shutdown (')
		}
	}

	initCommands() {
		this.addCommand({
			id: 'open-gigachat-chat',
			name: 'Open Gigachat Assistant Chat',
			callback: () => {
				new ChatModal(this.app, this.client).open();
			}
		});

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});
	}
}
