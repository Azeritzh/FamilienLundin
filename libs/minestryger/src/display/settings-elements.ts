import { DisplayConfig, DisplayState } from "../minestryger-display"
import { Minestryger } from "../minestryger"

export class SettingsElements {
	public canvas!: HTMLCanvasElement

	constructor(
		public game: Minestryger,
		public config: DisplayConfig,
		public displayState: DisplayState,
		public elements: { [index: string]: HTMLElement },
	) { }

	getInitialElements() {
		return /*html*/`
<div class="settings-section">
	<h1>${this.config.text.settings}</h1>

	<div class="setting">
		<button type="button" id="easy-button">${this.config.text.beginner}</button>
	</div>
	
	<div class="setting">
		<button type="button" id="medium-button">${this.config.text.intermediate}</button>
	</div>
	
	<div class="setting">
		<button type="button" id="hard-button">${this.config.text.expert}</button>
	</div>
	
	<div class="setting">
		<label for="flags">${this.config.text.allowFlags}</label>
		<input id="flags" type="checkbox" autocomplete="off">
	</div>
	
	<div class="setting">
		<button type="button" id="advanced-button">${this.config.text.advancedSettings}</button>
	</div>
	
	<div id="advanced-settings">
		<div class="setting">
			<label for="width">${this.config.text.width}</label>
			<input id="width"
				type="number"
				min="2"
				max="9999"
				autocomplete="off">
		</div>
		
		<div class="setting">
			<label for="height">${this.config.text.height}</label>
			<input id="height"
				type="number"
				min="2"
				max="9999"
				autocomplete="off">
		</div>
		
		<div class="setting">
			<label for="bombs">${this.config.text.bombs}</label>
			<input id="bombs"
				type="number"
				min="1"
				autocomplete="off">
		</div>
	
		<div class="setting">
			<label for="earlyClick">${this.config.text.earlyClick}</label>
			<input id="earlyClick"
				type="checkbox"
				autocomplete="off">
		</div>
		
		<div class="setting">
			<label for="fieldSize">${this.config.text.fieldSize}</label>
			<input id="fieldSize"
				type="number"
				autocomplete="off">
		</div>
	
		<div class="setting">
			<label for="autoSize">${this.config.text.autoSize}</label>
			<input id="autoSize"
				type="checkbox"
				autocomplete="off">
		</div>
	</div>
</div>
`
	}

	initialise() {
		this.registerElement("easy-button")
		this.registerElement("medium-button")
		this.registerElement("hard-button")
		this.registerElement("flags")
		document.getElementById("advanced-button")!.onclick = this.toggleAdvanced
		this.registerElement("advanced-settings")!.style.display = "none"
		this.registerElement("width")
		this.registerElement("height")
		this.registerElement("bombs")
		this.registerElement("earlyClick")
		this.registerElement("fieldSize")
		this.registerElement("autoSize")
	}

	private registerElement(id: string) {
		return this.elements[id] = document.getElementById(id)!
	}

	private toggleAdvanced = () => {
		this.displayState.showAdvancedSettings = !this.displayState.showAdvancedSettings
		this.elements["advanced-settings"].style.display = this.displayState.showAdvancedSettings
			? "block"
			: "none"
	}

	show() {
		this.getInput("flags").checked = this.config.allowFlags
		this.getInput("width").value = "" + this.displayState.desiredConfig.width
		this.getInput("height").value = "" + this.displayState.desiredConfig.height
		this.getInput("bombs").value = "" + this.displayState.desiredConfig.bombs
		this.getInput("bombs").max = "" + (this.displayState.desiredConfig.width * this.displayState.desiredConfig.height - 1)
		//this.getInput("earlyClick").checked = this.game.config.allowFlags
		this.getInput("fieldSize").value = "" + this.config.defaultFieldSize
		this.getInput("fieldSize").disabled = this.config.useAvailableSize
		this.getInput("autoSize").checked = this.config.useAvailableSize
	}

	getInput(id: string) {
		return <HTMLInputElement>this.elements[id]
	}
}
