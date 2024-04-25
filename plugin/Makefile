include .env

make_all: build deploy

build: clean
	mkdir -p build/obsidian-gigachat-plugin
	cd src/ && npm install && npm run build
	cp -R src/* build/obsidian-gigachat-plugin
	touch build/obsidian-gigachat-plugin/.hotreload

clean:
	rm -rf build

deploy: clean_plugin_dir
	mkdir -p ${DEV_VAULT_PATH}/.obsidian/plugins
	cp -R build/obsidian-gigachat-plugin ${DEV_VAULT_PATH}/.obsidian/plugins/obsidian-gigachat-plugin

clean_plugin_dir:
	rm -rf ${DEV_VAULT_PATH}/.obsidian/plugins/obsidian-gigachat-plugin
