import { FileManager } from "./file_manager";
import { GigachatClient } from "./gigachat_client";

export class RoadmapUsecase {

    fileManager: FileManager;
    client: GigachatClient;

    constructor(fileManager: FileManager, client: GigachatClient) {
        this.fileManager = fileManager;
        this.client = client;
    }

    async execute(topic: string) {
        const roadmap = await this.client.roadmapRequest(topic);
        console.log(roadmap)

        const dir = this.fileManager.dirPath("roadmap_" + topic);
        console.log(dir)
        this.fileManager.mkdir(dir);

        for (const [key, value] of Object.entries(roadmap)) {
            this.fileManager.createFile(dir + "/" + key + ".md", value);
        }
    }
}
