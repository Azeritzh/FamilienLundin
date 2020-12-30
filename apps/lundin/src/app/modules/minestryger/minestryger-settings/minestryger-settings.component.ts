import { Component, EventEmitter, Input, Output } from "@angular/core"

@Component({
	selector: "lundin-minestryger-settings",
	templateUrl: "./minestryger-settings.component.html",
	styleUrls: ["./minestryger-settings.component.scss"],
})
export class MinestrygerSettingsComponent {
	@Input() width = 30
	@Output() widthChange = new EventEmitter<number>()
	@Input() height = 16
	@Output() heightChange = new EventEmitter<number>()
	@Input() bombs = 99
	@Output() bombsChange = new EventEmitter<number>()
	@Input() allowFlags = true
	@Output() allowFlagsChange = new EventEmitter<boolean>()
	@Input() activateOnMouseDown = false
	@Output() activateOnMouseDownChange = new EventEmitter<boolean>()
	@Input() fieldSize = 20
	@Output() fieldSizeChange = new EventEmitter<number>()
	@Input() autoSize = true
	@Output() autoSizeChange = new EventEmitter<boolean>()
	@Output() triggerNewGame = new EventEmitter()
	@Output() triggerRedraw = new EventEmitter()
	showAdvancedSettings = false

	useEasySettings() {
		this.useSettings(9, 9, 10)
	}

	useMediumSettings() {
		this.useSettings(16, 16, 40)
	}

	useHardSettings() {
		this.useSettings(30, 16, 99)
	}

	useSettings(width: number, height: number, bombs: number) {
		this.width = width
		this.widthChange.emit(width)
		this.height = height
		this.heightChange.emit(height)
		this.bombs = bombs
		this.bombsChange.emit(bombs)
		this.triggerNewGame.emit()
	}

	toggleAdvanced() {
		this.showAdvancedSettings = !this.showAdvancedSettings
	}
}
