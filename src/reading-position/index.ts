import { Notice } from "obsidian";
import ReadingViewEnhancer from "src/main";
import SelectionHandler from "src/block-selector/selection-handler";
import { BLOCK_ATTR } from "src/constants";
import { getActiveView, getReadingViewContainer, isReadingView } from "src/utils";
import type { ReadingPosition, ReadingPositionStore } from "./types";

const MAX_STORED_POSITIONS = 500;

export default class ReadingPositionManager {
	private plugin: ReadingViewEnhancer;
	private saveTimer: number | null = null;
	private scrollListener: ((event: Event) => void) | null = null;
	private boundContainer: HTMLElement | null = null;

	constructor(plugin: ReadingViewEnhancer) {
		this.plugin = plugin;
	}

	activate() {
		this.plugin.registerEvent(
			this.plugin.app.workspace.on("layout-change", () => {
				this.attachScrollListener();
			}),
		);
		this.plugin.registerEvent(
			this.plugin.app.workspace.on("active-leaf-change", () => {
				this.attachScrollListener();
			}),
		);
	}

	onBlockSelected(block: HTMLElement, container: HTMLElement) {
		if (!this.plugin.settings.rememberReadingPosition) return;
		this.queueSave(container, block);
	}

	tryRestore(
		container: HTMLElement,
		selectionHandler: SelectionHandler,
	): boolean {
		if (!this.plugin.settings.rememberReadingPosition) return false;

		const view = getActiveView(this.plugin);
		const file = view?.file;
		if (!file || !isReadingView(view)) return false;

		const position = this.plugin.readingPositions[file.path];
		if (!position) return false;

		const block = this.findBlockByLine(container, position.lineStart);
		if (block) {
			selectionHandler.select(block);
			this.restoreScroll(container, position.scrollRatio);
		} else {
			this.restoreScroll(container, position.scrollRatio);
		}

		if (this.plugin.settings.showRestoreNotice) {
			new Notice("已恢复上次阅读位置");
		}

		return true;
	}

	saveNow() {
		const view = getActiveView(this.plugin);
		const container = getReadingViewContainer(view);
		const block = this.plugin.blockSelector.selectionHandler.selectedBlock;
		if (!view?.file || !container) return;

		this.persistPosition(view.file.path, container, block);
		new Notice("已保存阅读位置");
	}

	restoreNow(selectionHandler: SelectionHandler) {
		const view = getActiveView(this.plugin);
		const container = getReadingViewContainer(view);
		if (!container) return;

		if (this.tryRestore(container, selectionHandler)) return;
		new Notice("没有可恢复的阅读位置");
	}

	clearAll() {
		this.plugin.readingPositions = {};
		this.plugin.savePluginData();
		new Notice("已清除所有阅读位置记录");
	}

	hasSavedPosition(filePath: string | undefined): boolean {
		if (!filePath) return false;
		return Boolean(this.plugin.readingPositions[filePath]);
	}

	private queueSave(container: HTMLElement, block: HTMLElement | null) {
		if (this.saveTimer) window.clearTimeout(this.saveTimer);

		this.saveTimer = window.setTimeout(() => {
			const view = getActiveView(this.plugin);
			const file = view?.file;
			if (!file) return;

			this.persistPosition(file.path, container, block);
		}, this.plugin.settings.readingPositionSaveDelayMs);
	}

	private persistPosition(
		filePath: string,
		container: HTMLElement,
		block: HTMLElement | null,
	) {
		const lineStart = this.getBlockLineStart(block);
		if (lineStart < 0) return;

		const scrollable = getScrollableElement(container);
		const scrollRatio = scrollable ? getScrollRatio(scrollable) : 0;

		this.plugin.readingPositions[filePath] = {
			lineStart,
			scrollRatio,
			updatedAt: Date.now(),
		};

		this.trimStore();
		this.plugin.savePluginData();
	}

	private trimStore() {
		const entries = Object.entries(this.plugin.readingPositions);
		if (entries.length <= MAX_STORED_POSITIONS) return;

		entries
			.sort((a, b) => a[1].updatedAt - b[1].updatedAt)
			.slice(0, entries.length - MAX_STORED_POSITIONS)
			.forEach(([path]) => {
				delete this.plugin.readingPositions[path];
			});
	}

	private findBlockByLine(
		container: HTMLElement,
		lineStart: number,
	): HTMLElement | null {
		const blocks = container.querySelectorAll<HTMLElement>(
			`[${BLOCK_ATTR}=true]`,
		);

		let fallback: HTMLElement | null = null;
		for (const block of Array.from(blocks)) {
			const blockLine = this.getBlockLineStart(block);
			if (blockLine === lineStart) return block;
			if (blockLine >= 0 && blockLine <= lineStart) fallback = block;
		}

		return fallback;
	}

	private getBlockLineStart(block: HTMLElement | null): number {
		if (!block) return -1;
		const value = block.getAttribute("data-rve-line-start");
		if (!value) return -1;
		const parsed = parseInt(value, 10);
		return Number.isNaN(parsed) ? -1 : parsed;
	}

	private restoreScroll(container: HTMLElement, scrollRatio: number) {
		const scrollable = getScrollableElement(container);
		if (!scrollable) return;
		applyScrollRatio(scrollable, scrollRatio);
	}

	private attachScrollListener() {
		const view = getActiveView(this.plugin);
		const container = getReadingViewContainer(view);
		if (!container || container === this.boundContainer) return;

		this.detachScrollListener();

		this.boundContainer = container;
		this.scrollListener = () => {
			if (!this.plugin.settings.rememberReadingPosition) return;
			const block =
				this.plugin.blockSelector.selectionHandler.selectedBlock;
			this.queueSave(container, block);
		};
		container.addEventListener("scroll", this.scrollListener, {
			passive: true,
		});
	}

	private detachScrollListener() {
		if (this.boundContainer && this.scrollListener) {
			this.boundContainer.removeEventListener("scroll", this.scrollListener);
		}
		this.boundContainer = null;
		this.scrollListener = null;
	}
}

export function getScrollableElement(
	container: HTMLElement,
): HTMLElement | null {
	if (container.scrollHeight > container.clientHeight) return container;

	let node: HTMLElement | null = container.parentElement;
	while (node) {
		if (node.scrollHeight > node.clientHeight) return node;
		node = node.parentElement;
	}

	return null;
}

export function getScrollRatio(scrollable: HTMLElement): number {
	const maxScroll = scrollable.scrollHeight - scrollable.clientHeight;
	if (maxScroll <= 0) return 0;
	return scrollable.scrollTop / maxScroll;
}

export function applyScrollRatio(
	scrollable: HTMLElement,
	ratio: number,
): void {
	const maxScroll = scrollable.scrollHeight - scrollable.clientHeight;
	scrollable.scrollTop = Math.max(0, Math.min(1, ratio)) * maxScroll;
}

export type { ReadingPosition, ReadingPositionStore };
