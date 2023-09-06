import type { MarkdownTabs as Plugin } from "@/core/plugin";
import { Setting } from "obsidian";
import { Constants } from "@/lib/constants";

const enum ESettingName {
	CleanSlash = "removeSlashBeforeSpecialInContent",
}

const map: Map<string, (plugin: Plugin, node: HTMLElement) => void> = new Map(
	Object.entries({
		[ESettingName.CleanSlash]: (plugin: Plugin, node: HTMLElement) => {
			new Setting(node)
				.setName(Constants.Contents.SETTINGS_CLEANSLASH_LABEL)
				.setDesc(Constants.Contents.SETTINGS_CLEANSLASH_DESCRIPTION)
				.addToggle((element) => {
					element
						.setValue(plugin.settings[ESettingName.CleanSlash])
						.onChange(async (value) => {
							plugin.settings[ESettingName.CleanSlash] = value;

							await plugin.saveSettings();
						});
				});
		},
	})
);


export { map as SettingsMap };
export { ESettingName };
