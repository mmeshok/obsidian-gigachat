// import { FileManager } from 'data/file_manager';
import { dir } from 'console';
import { FileManager } from 'data/file_manager';
import { GigachatClient } from 'data/gigachat_client';
import { PluginSettingsRepository } from 'data/settings_repository';
import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';
import * as path from 'path';
import { ChatModal } from 'ui/chat_modal';
import { SampleModal } from 'ui/sample_modal';
import { SettingsTab } from 'ui/settings_tab';

const fs = require('fs');


const DEFAULT_SETTINGS: PluginSettingsRepository = {
	apiToken: 'SADFhtKUinewfFREhFsdfwF',
	backendHost: 'http://0.0.0.0:8080',
}

export default class GigachatPlugin extends Plugin {
	settings: PluginSettingsRepository;
	client: GigachatClient;
	fileManager: FileManager;

	async onload() {
		await this.initSettings()
		this.initFileManager()
		this.initRibbonActions()
		this.initStatusBar()
		this.initCommands()
		this.initGigachatClient()
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

	initFileManager() {
		this.fileManager = new FileManager(this.app);
	}

	initRibbonActions() {
		const ribbonIconEl = this.addRibbonIcon('bot', 'Gigachat', (evt: MouseEvent) => {
			new ChatModal(this.app, this.client).open();
		});
		ribbonIconEl.addClass('my-plugin-ribbon-class');
	}

	initStatusBar() {
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Gigachat is running');
	}

	async initGigachatClient() {
		console.log("d_info init")
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

		this.addCommand({
			id: 'open-gigachat-chat',
			name: 'Build Roadmap',
			callback: () => {
				const filePath = this.fileManager.currentFilePath();
				const dirPath = this.fileManager.dirPath(filePath);
				this.fileManager.mkdir(dirPath + "/roadmap");
				this.fileManager.createFile(dirPath  + "/roadmap/Android.md", "#Android");
				this.fileManager.createFile(dirPath + "/roadmap/Kotlin.md", "#Kotlin");
			}
		});
	}
}
