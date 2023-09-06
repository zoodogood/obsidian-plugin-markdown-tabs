import { Component as PreactComponent } from "preact";
import type { App, FileView, View } from "obsidian";
import { MarkdownRenderer } from "obsidian";
import { Constants } from "@/lib/constants";
import type { MarkdownTabs as Plugin } from "@/core/plugin";
import { scopedParent } from "@/styles.css";

const {
	TAB_CHECKABLE,
	COMPONENT_CONTAINER,
	TABS_SELECT_LIST: TABS_SELECT,
	CONTENT_CONTAINER,
	IS_SELECTED,
	COMPONENT_HEADER,
} = Constants.Components;

type TTabData = { title: string; content: string | Element };

interface ITabContainerProps {
	tabs: TTabData[];
	begin: string | undefined;
	plugin: Plugin;
	onMount?: CallableFunction;
	style?: string
}

interface ITabContainerState {
	content: Element | string | "";
	selectedItemIndex: number;
}

interface IContentRendererParams {
	container: HTMLElement;
	content: TTabData["content"];
	root: string;
	app: App;
	componentView: View;
}

class ContentRenderer {
	render(params: IContentRendererParams) {
		typeof params.content === "string"
			? this.renderStringContent(params)
			: this.renderElementContent(params);
	}

	renderStringContent({
		content,
		container,
		root,
		componentView,
		app,
	}: IContentRendererParams) {
		return MarkdownRenderer.render(
			app,
			content as string,
			container,
			root,
			componentView
		);
	}

	renderElementContent({
		container,
		content,
	}: Pick<IContentRendererParams, "content" | "container">) {
		container.empty();
		container.append(content);
	}
}

class TabsContainer extends PreactComponent<
	ITabContainerProps,
	ITabContainerState
> {
	declare base: Element | undefined;

	constructor(props: ITabContainerProps) {
		super(props);

		this.state = {
			content: "",
			selectedItemIndex: 0,
		};
	}

	assignState(partial: Partial<ITabContainerState>) {
		this.setState((previous) => Object.assign(previous, partial));
	}

	selectTabAtIndex(index: number) {
		const content = this.props.tabs.at(index)?.content ?? "";
		this.assignState({ content });
	}

	componentDidMount(): void {
		// Developer crutch: Issue https://github.com/zoodogood/obsidian-plugin-markdown-tabs/issues/1
		this.base!.addEventListener(
			Constants.Events.NODE_REMOVED,
			() => this.componentWillUnmount(),
			{ once: true }
		);

		this.base!.querySelector(`.${TABS_SELECT}`)!.addEventListener(
			Constants.Events.CLICK,
			this.onTabClicked
		);

		this.selectTabAtIndex(0);

		this.props.onMount?.(this);
	}

	componentWillUnmount(): void {
		this.base!.querySelector(`.${TABS_SELECT}`)!.removeEventListener(
			Constants.Events.CLICK,
			this.onTabClicked
		);
	}

	onTabClicked = (pointerEvent: PointerEvent) => {
		const target = pointerEvent.target as Element;
		const selector = `.${TAB_CHECKABLE}`;
		const tab = target.matches(selector)
			? target
			: target.closest(selector);
		if (!tab) {
			return;
		}

		const index = +tab.getAttribute("data-index")!;

		this.assignState({ selectedItemIndex: index });
		this.selectTabAtIndex(index);
	};

	getContentContainer() {
		const selector = `.${CONTENT_CONTAINER}`;
		return this.base?.querySelector(selector) ?? null;
	}

	render() {
		const { begin, tabs } = this.props;
		const { selectedItemIndex } = this.state;
		const generateClassNameBy = (index: number) =>
			`${TAB_CHECKABLE} ${
				selectedItemIndex === index ? IS_SELECTED : ""
			}`;

		const tabsComponents = tabs.map(({ title }, index) => (
			<li
				key={index}
				data-index={index}
				data-label={title}
				class={generateClassNameBy(index)}
			>
				{title?.trim() || Constants.Contents.DEFAULT_TAB_LABEL}
			</li>
		));

		const app = this.props.plugin.app;

		const contentContainerNode = this.getContentContainer();
		if (contentContainerNode) {
			contentContainerNode.empty();
			const content = this.state.content;
			const componentView = app.workspace.getLeaf().view as FileView;

			new ContentRenderer().render({
				app,
				content,
				container: contentContainerNode as HTMLElement,
				componentView,
				root: componentView.file?.parent!.path ?? "",
			});
		}

		return (
			<>
				<section
					class={`plugin-${Constants.Plugin.id} ${COMPONENT_CONTAINER} ${scopedParent}`}
					style={this.props.style}
				>
					{begin && <header class={COMPONENT_HEADER}>{begin}</header>}
					<ul class={TABS_SELECT}>{tabsComponents}</ul>
					<main class={CONTENT_CONTAINER}>
						{Constants.Plugin.name}
					</main>
				</section>
			</>
		);
	}

	forceUpdate(callback?: (() => void) | undefined): void {
		this.selectTabAtIndex(this.state.selectedItemIndex);
		super.forceUpdate(callback);
	}
}

export {
	TabsContainer,
	ContentRenderer as TabExternalContentRenderer,
	type TTabData,
	type ITabContainerProps,
	type ITabContainerState,
	type IContentRendererParams
};
