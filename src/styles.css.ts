import { globalStyle, style } from "@vanilla-extract/css";
import { Constants } from "@/lib/constants";
const { TABS_SELECT_LIST, TAB_CHECKABLE, COMPONENT_HEADER, CONTENT_CONTAINER } =
	Constants.Components;

const componentVars = {
	["--primary-color"]: "var(--text-accent)",
	[`--content-padding`]: "0.5em 5px",
	["--padding-inline"]: "max(var( --folding-offset, 0.5em ), 0.5em)",
};

export const scopedParent = style({
	backgroundColor: "#88888805",
	paddingInline: "var( --padding-inline )",
	borderRadius: "0.5em 0.5em 0 0",
	border: "0.1em solid var( --table-border-color )",
	paddingTop: "0.5em",
	paddingBottom: "0.25em",
	vars: componentVars,
});

globalStyle(`${scopedParent} .${COMPONENT_HEADER}`, {
	opacity: 0.7,
	fontSize: "0.9em",
});

globalStyle(`${scopedParent} .${TABS_SELECT_LIST}`, {
	display: "flex",
	listStyle: "none",
	padding: 0,
	overflow: "auto",
	userSelect: "none",
});

globalStyle(`${scopedParent} .${TAB_CHECKABLE}`, {
	paddingInline: "1em",
	paddingBlock: "0.25em",
	marginBottom: "0.1em",
	borderBottom: "0.1em solid transparent",
	cursor: "pointer",
	flexShrink: 0,
	transition: "border-bottom-color 100ms",
});

globalStyle(`${scopedParent} .${TAB_CHECKABLE}:hover`, {
	borderBottomColor: "#88888888",
});

globalStyle(`${scopedParent} .${TAB_CHECKABLE}.selected`, {
	borderBottomColor: "var( --primary-color )",
});

globalStyle(`${scopedParent} .${CONTENT_CONTAINER}`, {
	padding: `var( --content-padding )`,
});
