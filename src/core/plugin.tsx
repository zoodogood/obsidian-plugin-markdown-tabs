import { render } from "preact";
import { Plugin } from "obsidian";
import {
	SettingsTab,
	DEFAULT_SETTINGS,
	type ISettings,
} from "@/components/SettingsTab";
import { TabsContainer, type TTabData } from "@/components/TabsContainer";
import { Constants } from "@/lib/constants";
import { ESettingName } from "@/components/SettingsTab/settings.list";

type TCodeBlockLevelGroup = { tab?: string; begin?: string };
type TSubGroup = { title?: string; content?: string };

function groupsToTabs(groups: TCodeBlockLevelGroup[]) {
	const matchSubGroups = Constants.Regexp.MATCH_SUB_GROUPS;

	const tabs = groups
		.filter((group) => group!.tab)
		.map((group) => group.tab!.match(matchSubGroups)!.groups) as TTabData[];

	return tabs;
}

class MarkdownTabs extends Plugin {
	settings: ISettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SettingsTab(this.app, this));

		this.registerMarkdownCodeBlockProcessor(
			"tabs",
			async (plain, node, ctx) => {
				plain &&= plain.trim();

				node.textContent = plain;

				// <github>/src/main.test.ts
				const regex = Constants.Regexp.MATCH_CODE_BLOCK_LEVEL;

				const groups = [...plain.matchAll(regex)]
					.map(({ groups }) => groups)
					.filter(Boolean);

				const begin = groups.find((group) => group!.begin)?.begin as
					| string
					| undefined;
				const tabs = groupsToTabs(groups as TCodeBlockLevelGroup[]);

				this.settings[ESettingName.CleanSlash] === true &&
					tabs
						.filter((tab) => typeof tab.content === "string")
						.forEach((tab) => {
							tab.content = (tab.content as string).replace(
								Constants.Regexp.MATCH_SLASH_BEFORE_TAB_PREFIX,
								""
							);
						});

				node.empty();
				render(
					<TabsContainer begin={begin} tabs={tabs} plugin={this} />,
					node
				);

				return true;
			}
		);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

export { MarkdownTabs };
export { type TCodeBlockLevelGroup, type TSubGroup };
