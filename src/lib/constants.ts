import manifest from '@root/manifest.json';
import packageData from '@root/package.json'

export const Constants = {
	
	Plugin: {
		CODE_BLOCK_LANGUAGE: "tabs",
		name: manifest.name,
		id: manifest.id
	},

	Contents: {
		DEFAULT_TAB_LABEL: "Tab N",
		SETTINGS_CLEANSLASH_LABEL: "Clean slash",
		SETTINGS_CLEANSLASH_DESCRIPTION: `ReplaceAll(/(?<=\\n|^)\\(?=+++)/g, "") in content`,
		SETTINGS_TAB_SETTINGS_TAB_LABEL: "Settings",
		SETTINGS_TAB_SETTINGS_TAB_PLACEHOLDER: "Settings",
		SETTINGS_TAB_LINKS_TAB_LABEL: "Links",
		CreateIssueOnGithubWithLink: `[Create issue on Github](${ packageData.repository.url }/issues/new)`
	},
	
	Events: {
		CLICK: "click",
		NODE_REMOVED: "DOMNodeRemovedFromDocument"

	},

	Components: {
		CONTENT_CONTAINER: "content-container",
		TABS_SELECT_LIST: "tabs-select-list",
		TAB_CHECKABLE: "tab-checkable",
		COMPONENT_CONTAINER: "component-container",
		COMPONENT_HEADER: "component-header",
		IS_SELECTED: "selected"
	},

	Regexp: {
		MATCH_SUB_GROUPS: /(?:\+\+\+\s*(?<title>.+?)?\n(?<content>(?:.|\n)+))/,
		MATCH_CODE_BLOCK_LEVEL: /(?<tab>(?:\n|^)\s*\+\+\+.*\n(?:.|\n)+?(?=\n\s*\+\+\+|$))|(?<begin>^(?:.|\n)*?(?=\n\s*\+\+\+|$))/g,
		MATCH_SLASH_BEFORE_TAB_PREFIX: /(?<=\n|^)\\(?=\+\+\+)/g
	}
	
}