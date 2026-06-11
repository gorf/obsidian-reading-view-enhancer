import ReadingViewEnhancer from "src/main";
import {
	getActiveView,
	getReadingViewContainer,
	isReadingView,
} from "src/utils";
import { Platform } from "obsidian";
import type { RveCommand } from ".";

/**
 * Rerender all reading views
 *
 * @param plugin Plugin instance
 * @returns Rerender all reading views command
 */
export const rerenderAllReadingViews: RveCommand = (
	plugin: ReadingViewEnhancer
) => ({
	id: "rerender-all-reading-views",
	name: "Rerender all reading views",
	callback: () => {
		const { workspace } = plugin.app;
		workspace.getLeavesOfType("markdown").forEach((leaf) => {
			if (leaf.view.getState().mode === "preview") {
				// @ts-ignore
				leaf.view.previewMode?.rerender(true);
			}
		});
	},
});

/**
 * Select top block in the view
 *
 * @param plugin Plugin instance
 * @returns Select top block in the view command
 */
export const selectTopBlockInTheView: RveCommand = (
	plugin: ReadingViewEnhancer
) => ({
	id: "select-top-block-in-the-view",
	name: "Select Top Block in the View",
	checkCallback: (checking: boolean): boolean => {
		const activeView = getActiveView(plugin);
		// If checking is set to true, perform a preliminary check.
		if (checking) {
			if (!isReadingView(activeView)) return false;
			else if (isNotEnabled(plugin)) return false;
			else if (isMobileAndDisabled(plugin)) return false;
			else return true;
		}
		// If checking is set to false, perform an action.
		else {
			const container = getReadingViewContainer(activeView);
			if (container) {
				plugin.blockSelector.selectTopBlockInTheView(container);
			}

			return true;
		}
	},
});

export const saveReadingPosition: RveCommand = (plugin: ReadingViewEnhancer) => ({
	id: "save-reading-position",
	name: "Save reading position",
	checkCallback: (checking: boolean): boolean => {
		const activeView = getActiveView(plugin);
		if (checking) {
			return isReadingView(activeView) && !isNotEnabled(plugin) && !isMobileAndDisabled(plugin);
		}
		plugin.readingPosition.saveNow();
		return true;
	},
});

export const restoreReadingPosition: RveCommand = (plugin: ReadingViewEnhancer) => ({
	id: "restore-reading-position",
	name: "Restore reading position",
	checkCallback: (checking: boolean): boolean => {
		const activeView = getActiveView(plugin);
		if (checking) {
			return isReadingView(activeView) && !isNotEnabled(plugin) && !isMobileAndDisabled(plugin);
		}
		plugin.readingPosition.restoreNow(plugin.blockSelector.selectionHandler);
		return true;
	},
});

export const clearReadingPositions: RveCommand = (plugin: ReadingViewEnhancer) => ({
	id: "clear-reading-positions",
	name: "Clear all reading positions",
	callback: () => {
		plugin.readingPosition.clearAll();
	},
});

export const toggleBlockHighlight: RveCommand = (
	plugin: ReadingViewEnhancer
) => ({
	id: "toggle-block-highlight",
	name: "Toggle Block Highlight",
	checkCallback: (checking: boolean): boolean => {
		const activeView = getActiveView(plugin);
		// If checking is set to true, perform a preliminary check.
		if (checking) {
			if (!isReadingView(activeView)) return false;
			else if (isNotEnabled(plugin)) return false;
			else if (isMobileAndDisabled(plugin)) return false;
			else return true;
		}
		// If checking is set to false, perform an action.
		else {
			const container = getReadingViewContainer(activeView);
			if (container) {
				plugin.blockSelector.toggleBlockHighlight();
			}

			return true;
		}
	},
});

const isNotEnabled = (plugin: ReadingViewEnhancer) => {
	return !plugin.settings.enableBlockSelector;
};

const isMobileAndDisabled = (plugin: ReadingViewEnhancer) => {
	return (
		(Platform.isMobile || Platform.isMobileApp) &&
		plugin.settings.disableBlockSelectorOnMobile
	);
};
