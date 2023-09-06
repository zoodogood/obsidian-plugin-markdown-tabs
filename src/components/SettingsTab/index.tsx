import { PluginSettingTab, App } from "obsidian";
import type { MarkdownTabs as Plugin } from "@/core/plugin";
import renderForMe from "./renderme";
import { ESettingName } from "@/components/SettingsTab/settings.list";

interface ISettings {
	[ESettingName.CleanSlash]: boolean;
}

const DEFAULT_SETTINGS: ISettings = {
	[ESettingName.CleanSlash]: true,
};

class SettingsTab extends PluginSettingTab {
	plugin: Plugin;

	constructor(app: App, plugin: Plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		renderForMe({ node: containerEl, component: this });
	}
}

export { SettingsTab };
export { DEFAULT_SETTINGS, type ISettings };
