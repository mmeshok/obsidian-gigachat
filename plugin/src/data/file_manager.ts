import { App, Notice } from "obsidian";
import * as path from 'path';

const fs = require('fs');

export class FileManager {

    app: App;

    constructor(app: App) {
        this.app = app;
    }

    currentFilePath() {
		const activeFile = this.app.workspace.getActiveFile();
		//@ts-ignore
		const vaultPath = activeFile?.vault.adapter.basePath;
		const filePath = activeFile?.path;
		return vaultPath + "/" + filePath
    }

    dirPath(filePath: string) {
        return path.dirname(filePath);
    }

    mkdir(dirPath: string) {
        fs.mkdirSync(dirPath);
    }

    createFile(filePath: string, content: string) {
        fs.writeFileSync(filePath, content)
    }
};
