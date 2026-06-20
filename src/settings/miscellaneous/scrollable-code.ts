import { Setting, ToggleComponent } from "obsidian";
import ReadingViewEnhancer from "src/main";
import { saveSettingsVoid } from "src/utils/settings";

/**
 * Scrollable code setting component
 */
export default class ScrollableCodeSetting extends Setting {
	plugin: ReadingViewEnhancer;

	constructor(containerEl: HTMLElement, plugin: ReadingViewEnhancer) {
		super(containerEl);
		this.plugin = plugin;

		this.setName("Scrollable code")
			.setDesc("Make code blocks scrollable instead of line break.")
			.addToggle((toggle) => this.setCodeScrollable(toggle));
	}

	setCodeScrollable(toggle: ToggleComponent) {
		toggle.setValue(this.plugin.settings.scrollableCode);

		// save on change
		toggle.onChange((changed) => {
			this.plugin.settings.scrollableCode = changed;
			saveSettingsVoid(this.plugin);
			this.plugin.applyScrollableCode(true);
		});
	}
}
