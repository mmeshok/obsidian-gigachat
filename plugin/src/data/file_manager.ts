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

    currentActiveFile() {
        const filePath = this.app.workspace.activeEditor?.file?.path
        if (filePath == undefined)
            return undefined
        console.log(filePath)
        const fileAbsolutePath = this.vaultPath() + "/" + filePath
        console.log(fileAbsolutePath)
        return fileAbsolutePath
    }

    readFile(filePath: string) {
        return fs.readFileSync(filePath).toString()
    }
};
