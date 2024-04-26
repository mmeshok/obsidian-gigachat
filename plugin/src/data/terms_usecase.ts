import { Notice } from "obsidian";
import { FileManager } from "./file_manager";
import { GigachatClient } from "./gigachat_client";

export class TermsUsecase {

    fileManager: FileManager;
    client: GigachatClient;

    constructor(fileManager: FileManager, client: GigachatClient) {
        this.fileManager = fileManager;
        this.client = client;
    }

    async execute() {
		new Notice("Старт обработки документа")
		const filePath = this.fileManager.currentActiveFile()
		if (filePath == undefined) {
			new Notice("Нет активного .md файла для обработки")
		} else {
			const content = this.fileManager.readFile(filePath)
			const newContent = await this.client.termsRequest(content)
			this.fileManager.createFile(filePath, newContent)
			new Notice("Документ обработан")
		}
    }
}
