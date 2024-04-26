import { MarkdownView } from "obsidian";
import axios from "axios";
import { PluginSettingsRepository } from "./settings_repository";

export class GigachatClient {

    apiToken: string;
    host: string;

    constructor(settings: PluginSettingsRepository) {
        this.apiToken = settings.apiToken;
        this.host = settings.backendHost;
    }

    chatRequest = async (
		promts: { [key: string]: any }[],
	) => {
        const data = {
            promts_list: promts,
        };
        const responce = await axios.post(this.path("chat"), data);
        return responce.data;
    }

    healthCheckRequest = async () => {
        const responce = await axios.get(this.path("health_check"));
        console.log(responce.data);
        return responce.status;
    }

    path(handle: string) {
        return this.host + "/" + handle;
    }

    async roadmapRequest(topic: string) {
        const data = {
            topic: topic,
        }
        const responce = await axios.post(this.path("roadmap"), data);
        console.log(responce.data);
        return responce.data.result;
    }
}
