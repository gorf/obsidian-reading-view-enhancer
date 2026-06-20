import { Setting, ToggleComponent } from "obsidian";
import ReadingViewEnhancer from "src/main";
import { saveSettingsVoid } from "src/utils/settings";

/**
 * Always on collapse indicator setting component
 */
export default class AlwaysOnCollapseIndicatorSetting extends Setting {
	plugin: ReadingViewEnhancer;
	workspaceEl: HTMLElement;

	constructor(settingsTabEl: HTMLElement, plugin: ReadingViewEnhancer) {
		super(settingsTabEl);
		this.plugin = plugin;

		this.setName("Always on collapse indicator")
			.setDesc("Set collapse indicators always visible in reading view.")
			.addToggle((toggle) => this.alwaysOnCollapseIndicator(toggle));
	}

	/**
	 * Creates toggle component
	 *
	 * @param toggle Toggle component
	 */
	alwaysOnCollapseIndicator(toggle: ToggleComponent) {
		const { settings } = this.plugin;

		toggle.setValue(settings.alwaysOnCollapseIndicator).onChange((changed) => {
			settings.alwaysOnCollapseIndicator = changed;
			saveSettingsVoid(this.plugin);
			this.plugin.applyAlwaysOnCollapse(true);
		});
	}
}
