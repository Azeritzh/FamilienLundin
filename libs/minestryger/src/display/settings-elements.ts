import { DisplayConfig, DisplayState } from "../minestryger-display"
import { Minestryger } from "../minestryger"

export class SettingsElements {
	public canvas: HTMLCanvasElement

	constructor(
		public game: Minestryger,
		public config: DisplayConfig,
		public displayState: DisplayState,
		public elements: { [index: string]: HTMLElement },
	) { }

	getInitialElements() {
		return /*html*/`
<div class="settings-section">
	<h1>Indstillinger</h1>

	<div class="setting">
		<button type="button" id="easy-button">Begynder</button>
	</div>
	
	<div class="setting">
		<button type="button" id="medium-button">Øvet</button>
	</div>
	
	<div class="setting">
		<button type="button" id="hard-button">Ekspert</button>
	</div>
	
	<div class="setting">
		<label for="flags">Tillad flag</label>
		<input id="flags" type="checkbox" autocomplete="off">
	</div>
	
	<div class="setting">
		<button type="button" id="advanced-button">Avancerede indstillinger</button>
	</div>
	
	<div id="advanced-settings">
		<div class="setting">
			<label for="width">Vidde</label>
			<input id="width"
				type="number"
				min="2"
				max="9999"
				autocomplete="off">
		</div>
		
		<div class="setting">
			<label for="height">Højde</label>
			<input id="height"
				type="number"
				min="2"
				max="9999"
				autocomplete="off">
		</div>
		
		<div class="setting">
			<label for="bombs">Bomber</label>
			<input id="bombs"
				type="number"
				min="1"
				[max]="width * height - 1"
				autocomplete="off">
		</div>
	
		<div class="setting">
			<label for="earlyClick">Tidligt klik</label>
			<input id="earlyClick"
				type="checkbox"
				autocomplete="off">
		</div>
		
		<div class="setting">
			<label for="fieldSize">Feltstørrelse</label>
			<input id="fieldSize"
				type="number"
				autocomplete="off"
				[disabled]="autoSize">
		</div>
	
		<div class="setting">
			<label for="autoSize">Automatisk feltstørrelse</label>
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
		document.getElementById("advanced-button").onclick = this.toggleAdvanced
		this.registerElement("advanced-settings").style.display = "none"
		this.registerElement("width")
		this.registerElement("height")
		this.registerElement("bombs")
		this.registerElement("earlyClick")
		this.registerElement("fieldSize")
		this.registerElement("autoSize")
	}

	private registerElement(id: string) {
		return this.elements[id] = document.getElementById(id)
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
		//this.getInput("earlyClick").checked = this.game.config.allowFlags
		this.getInput("fieldSize").value = "" + this.config.defaultFieldSize
		this.getInput("autoSize").checked = this.config.useAvailableSize
	}

	getInput(id: string) {
		return <HTMLInputElement>this.elements[id]
	}
}
