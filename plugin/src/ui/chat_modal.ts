import { GigachatClient } from "data/gigachat_client";
import { App, MarkdownRenderer, MarkdownView, Modal, Notice } from "obsidian";

export class ChatModal extends Modal {
    prompt_text: string;
    prompt_table: { [key: string]: any }[] = [];
    client: GigachatClient;
    is_generating_answer: boolean;

    constructor(app: App, client: GigachatClient) {
        super(app);
        this.client = client;
        this.is_generating_answer = false;
    }

    clearModalContent() {
        this.contentEl.innerHTML = "";
        this.prompt_text = "";
    }

    send_action = async () => {
        if (this.prompt_text && !this.is_generating_answer) {
            this.is_generating_answer = true;
            const prompt = {
                role: "user",
                content: this.prompt_text,
            };

            this.prompt_table.push(prompt, {
                role: "assistant",
            });

            this.clearModalContent();
            await this.displayModalContent();

            this.prompt_table.pop();
            const answers =
                this.modalEl.getElementsByClassName("chat-div assistant");
            const view = this.app.workspace.getActiveViewOfType(
                MarkdownView
            ) as MarkdownView;
            // const answer = await this.client.chatRequest("text");
            // if (answer) {
            //     this.prompt_table.push({
            //         role: "assistant",
            //         content: answer,
            //     });
            // }
            this.clearModalContent();
            await this.displayModalContent();
            this.is_generating_answer = false;
        }
    };

    displayModalContent = async () => {
        const { contentEl } = this;
        const container = this.contentEl.createEl("div", {
            cls: "chat-modal-container",
        });
        const view = this.app.workspace.getActiveViewOfType(
            MarkdownView
        ) as MarkdownView;

        for (const x of this.prompt_table) {
            const div = container.createEl("div", {
                cls: `chat-div ${x["role"]}`,
            });
            if (x["role"] === "assistant") {
                await MarkdownRenderer.renderMarkdown(
                    x["content"],
                    div,
                    "",
                    view
                );
            } else {
                if (Array.isArray(x["content"])) {
                    const content = x["content"][0];
                    if (content["type"] === "text") {
                        div.createEl("p", {
                            text: content["text"],
                        });
                    } else {
                        const image = div.createEl("img", { cls: "image-modal-image" });
                        image.setAttribute(
                            'src',
                            content["image_url"]["url"],
                        );
                    }

                } else {
                    div.createEl("p", {
                        text: x["content"],
                    });
                }
            }

            div.addEventListener("click", async () => {
                await navigator.clipboard.writeText(x["content"]);
                new Notice(x["content"] + " Copied to clipboard!");
            });
        }

        const button_container = contentEl.createEl("div", {
            cls: "chat-button-container",
        });

        button_container.createEl("p", {
            text: "Type here:",
        });

        const right_button_container = button_container.createEl("div", {
            cls: "chat-button-container-right",
        });

        // Upload image from file
        const hidden_add_file_button = right_button_container.createEl("input", {
            type: "file",
            cls: "hidden-file"
        });
        hidden_add_file_button.setAttribute("accept", ".png, .jpg, .jpeg");

        hidden_add_file_button.addEventListener('change', async (e: Event) => {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                const base64String = await convertBlobToBase64(files[0]);
                this.prompt_table.push({
                    "role": "user",
                    "content":
                        [{
                            "type": "image_url",
                            "image_url": {
                                "url": base64String,
                                "detail": "medium"
                            },
                        }],

                });
                this.clearModalContent();
                this.displayModalContent();
            }
        }
        );

        // Create a simple button element that will function as the add_file_button
        const add_file_button = right_button_container.createEl("button");
        add_file_button.innerHTML = "&#x1F4F7;"

        // Programmatically trigger hidden_add_file_button click
        add_file_button.addEventListener('click', () => {
            hidden_add_file_button.click();
        });

        const input_field = right_button_container.createEl("input", {
            placeholder: "Your prompt here",
            type: "text",
        });
        input_field.addEventListener("keypress", (evt) => {
            if (evt.key === "Enter") {
                this.prompt_text = input_field.value.trim();
                this.send_action();
            }
        });

        const submit_btn = right_button_container.createEl("button", {
            text: "Submit",
            cls: "mod-cta",
        });
        submit_btn.addEventListener("click", () => {
            this.prompt_text = input_field.value.trim();
            this.send_action();
        });

        input_field.focus();
        input_field.select();

        const button_container_2 = contentEl.createEl("div", {
            cls: "chat-button-container-right upper-border",
        });

        const clear_button = button_container_2.createEl("button", {
            text: "Clear",
        });
        const copy_button = button_container_2.createEl("button", {
            text: "Copy conversation",
        });

        clear_button.addEventListener("click", () => {
            this.prompt_table = [];
            this.clearModalContent();
            this.displayModalContent();
        });
        copy_button.addEventListener("click", async () => {
            const conversation = this.prompt_table
                .map((x) => x["content"])
                .join("\n\n");
            await navigator.clipboard.writeText(conversation);
            new Notice("Conversation copied to clipboard");
        });


        const convertBlobToBase64 = (blob: Blob): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = () => reject(reader.error);
                reader.onload = () => {
                    resolve(reader.result as string);
                };
                reader.readAsDataURL(blob);
            });
        };
    }

    onOpen() {
        this.titleEl.setText("Чем могу помочь?");
        this.displayModalContent();
    }

    onClose() {
        this.contentEl.empty();
    }
}
