import { Setting, ToggleComponent } from "obsidian";
import ReadingViewEnhancer from "src/main";

export default class RememberReadingPositionSetting extends Setting {
	constructor(settingsTabEl: HTMLElement, plugin: ReadingViewEnhancer) {
		super(settingsTabEl);
		this.setName("Remember reading position")
			.setDesc(
				"Save the current block and scroll position while reading, then restore it when you reopen the note.",
			)
			.addToggle((toggle) => {
				toggle
					.setValue(plugin.settings.rememberReadingPosition)
					.onChange(async (value) => {
						plugin.settings.rememberReadingPosition = value;
						await plugin.saveSettings();
					});
			});

		new Setting(settingsTabEl)
			.setName("Show restore notice")
			.setDesc("Display a notice when a saved reading position is restored.")
			.addToggle((toggle: ToggleComponent) => {
				toggle
					.setValue(plugin.settings.showRestoreNotice)
					.onChange(async (value) => {
						plugin.settings.showRestoreNotice = value;
						await plugin.saveSettings();
					});
			});

		new Setting(settingsTabEl)
			.setName("Save delay (ms)")
			.setDesc(
				"How long to wait after you stop navigating or scrolling before saving the position.",
			)
			.addText((text) => {
				text
					.setPlaceholder("500")
					.setValue(String(plugin.settings.readingPositionSaveDelayMs))
					.onChange(async (value) => {
						const parsed = parseInt(value, 10);
						plugin.settings.readingPositionSaveDelayMs =
							Number.isNaN(parsed) || parsed < 100
								? 500
								: Math.min(parsed, 5000);
						await plugin.saveSettings();
					});
			});

		new Setting(settingsTabEl)
			.setName("Restore delay (ms)")
			.setDesc(
				"Wait briefly after opening a note so blocks are ready before restoring position.",
			)
			.addText((text) => {
				text
					.setPlaceholder("300")
					.setValue(String(plugin.settings.readingPositionRestoreDelayMs))
					.onChange(async (value) => {
						const parsed = parseInt(value, 10);
						plugin.settings.readingPositionRestoreDelayMs =
							Number.isNaN(parsed) || parsed < 0
								? 300
								: Math.min(parsed, 3000);
						await plugin.saveSettings();
					});
			});
	}
}
