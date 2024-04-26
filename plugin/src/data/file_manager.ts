import { App, Notice } from "obsidian";
import * as path from 'path';

const fs = require('fs');

export class FileManager {

    app: App;

    constructor(app: App) {
        this.app = app;
    }

    vaultPath() {
        //@ts-ignore
		return this.app.vault.adapter.basePath;
    }

    dirPath(name: string) {
        return this.vaultPath() + "/" + name;
    }

    mkdir(dirPath: string) {
        fs.mkdirSync(dirPath);
    }

    createFile(filePath: string, content: any) {
        console.log("create file" + filePath)
        fs.writeFileSync(filePath, content)
    }
};
