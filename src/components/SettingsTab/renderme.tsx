import type { SettingsTab } from "./index";
import { Constants } from "@/lib/constants";
import { render } from "preact";
import { TabsContainer } from "@/components/TabsContainer";
import { SettingsMap } from "@/components/SettingsTab/settings.list";

export default function ({
	node,
	component,
}: {
	node: HTMLElement;
	component: SettingsTab;
}) {
	node.empty();
	const container = document.createElement("main");
	node.append(container);

	const plugin = component.plugin;

	const tabs = [
		{
			title: Constants.Contents.SETTINGS_TAB_SETTINGS_TAB_LABEL,
			content: Constants.Contents.SETTINGS_TAB_SETTINGS_TAB_PLACEHOLDER,
		},

		{
			title: Constants.Contents.SETTINGS_TAB_LINKS_TAB_LABEL,
			content: `- ${ Constants.Contents.CreateIssueOnGithubWithLink }`,
		},
	];

	function onTabsMount(component: TabsContainer) {
		const settingsTabNode = document.createElement("section");

		for (const addSetting of SettingsMap.values()) {
			addSetting(plugin, settingsTabNode);
		}

		component.props.tabs.find((tab) => tab.title === "Settings")!.content =
			settingsTabNode;

		component.forceUpdate();
	}

	render(
		<TabsContainer
			begin=""
			plugin={plugin}
			tabs={tabs}
			onMount={onTabsMount}
			style="--content-padding: 1em 3px 0 3px"
		/>,
		container
	);
}
