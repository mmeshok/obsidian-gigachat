export BUILD_DIR=build/obsidian-gigachat-plugin
include .env

make_all: build deploy

build: clean
	mkdir -p ${BUILD_DIR}
	cd src/ && npm install && npm run build
	cp src/main.js ${BUILD_DIR}
	cp src/manifest.json ${BUILD_DIR}
	touch ${BUILD_DIR}/.hotreload

clean:
	rm -rf build

deploy: clean_plugin_dir
	mkdir -p ${DEV_VAULT_PATH}/.obsidian/plugins
	cp -R build/obsidian-gigachat-plugin ${DEV_VAULT_PATH}/.obsidian/plugins/obsidian-gigachat-plugin

clean_plugin_dir:
	rm -rf ${DEV_VAULT_PATH}/.obsidian/plugins/obsidian-gigachat-plugin
