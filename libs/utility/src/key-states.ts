export class KeyStates {
	constructor(
		public onDown: { [key: string]: (key: string) => void } = {},
		public onUp: { [key: string]: (key: string) => void } = {},
		public isPressed: { [key: string]: boolean } = {},
		private inputChanges: { [key: string]: boolean } = {},
		private pollableState: InputState = {},
	) {
		window.addEventListener("keydown", this.onKeyDown, { capture: true })
		window.addEventListener("keyup", this.onKeyUp)
	}

	onDestroy() {
		window.removeEventListener("keydown", this.onKeyDown)
		window.removeEventListener("keyup", this.onKeyUp)
	}

	private onKeyDown = (event: KeyboardEvent) => {
		if (this.isPressed[event.code])
			return
		this.isPressed[event.code] = true
		this.inputChanges[event.code] = true
		this.updateStateFor(event.code, true)
		this.onDown[event.code]?.(event.code)
	}

	private onKeyUp = (event: KeyboardEvent) => {
		if (!this.isPressed[event.code])
			return
		this.isPressed[event.code] = false
		this.updateStateFor(event.code, false)
		if (!this.wasPressedSinceLastRequest(event.code))
			this.inputChanges[event.code] = false
		this.onUp[event.code]?.(event.code)
	}

	private updateStateFor(key: string, state: boolean) {
		if (!this.pollableState[key])
			return this.pollableState[key] = { hasChanged: true, state }
		if (this.pollableState[key].hasChanged)
			return // delay
		this.pollableState[key].hasChanged = true
		this.pollableState[key].state = state
	}

	private wasPressedSinceLastRequest(key: string) {
		return this.inputChanges[key]
	}

	getInputChanges() {
		const changes = this.inputChanges
		const newChanges = {}
		for (const key in this.inputChanges)
			if (this.hasAlreadyBeenUnpressed(key))
				newChanges[key] = false
		this.inputChanges = newChanges
		return changes
	}

	getInputState() {
		this.updateGamePadStates()
		const state = { ...this.pollableState }
		for (const key in this.pollableState) {
			const state = this.isPressed[key]
			const hasChanged = state !== this.pollableState[key].state
			this.pollableState[key] = { hasChanged, state }
		}
		return state
	}

	private hasAlreadyBeenUnpressed(key: string) {
		return this.inputChanges[key] && !this.isPressed[key]
	}

	private updateGamePadStates() {
		this.initialiseGamepadStates()
		const gamepads = navigator.getGamepads?.() ?? []
		for (const gamepad of gamepads)
			if (gamepad?.mapping === "standard")
				this.updateStandardGamePadStates(gamepad)
			else if (gamepad)
				this.updateNonStandardGamePadStates(gamepad)
	}

	private initialiseGamepadStates() {
		this.pollableState["PadB"] = { hasChanged: true, state: false } // xbox A
		this.pollableState["PadA"] = { hasChanged: true, state: false } // xbox B
		this.pollableState["PadY"] = { hasChanged: true, state: false } // xbox X
		this.pollableState["PadX"] = { hasChanged: true, state: false } // xbox Y
		this.pollableState["PadLeftShoulder"] = { hasChanged: true, state: false }
		this.pollableState["PadRightShoulder"] = { hasChanged: true, state: false }
		this.pollableState["PadStart"] = { hasChanged: true, state: false }
		this.pollableState["PadSelect"] = { hasChanged: true, state: false }
		this.pollableState["PadUp"] = { hasChanged: true, state: false }
		this.pollableState["PadRight"] = { hasChanged: true, state: false }
		this.pollableState["PadDown"] = { hasChanged: true, state: false }
		this.pollableState["PadLeft"] = { hasChanged: true, state: false }
	}

	private updateStandardGamePadStates(gamepad: Gamepad) {
		this.readStandardButtons(gamepad)
		this.readLeftAnalogAsDpad(gamepad)
	}

	private readStandardButtons(gamepad: Gamepad) {
		this.setState("PadB", gamepad.buttons[0].pressed)
		this.setState("PadA", gamepad.buttons[1].pressed)
		this.setState("PadY", gamepad.buttons[2].pressed)
		this.setState("PadX", gamepad.buttons[3].pressed)
		this.setState("PadLeftShoulder", gamepad.buttons[4].pressed)
		this.setState("PadRightShoulder", gamepad.buttons[5].pressed)
		this.setState("PadSelect", gamepad.buttons[8].pressed)
		this.setState("PadStart", gamepad.buttons[9].pressed)
		this.setState("PadUp", gamepad.buttons[12].pressed)
		this.setState("PadDown", gamepad.buttons[13].pressed)
		this.setState("PadLeft", gamepad.buttons[14].pressed)
		this.setState("PadRight", gamepad.buttons[15].pressed)
	}

	private readLeftAnalogAsDpad(gamepad: Gamepad) {
		this.setState("PadUp", -0.5 > gamepad.axes[1])
		this.setState("PadDown", 0.5 < gamepad.axes[1])
		this.setState("PadLeft", -0.5 > gamepad.axes[0])
		this.setState("PadRight", 0.5 < gamepad.axes[0])
	}

	private updateNonStandardGamePadStates(gamepad: Gamepad) {
		this.readStandardButtons(gamepad)
		this.readNonStandardDpad(gamepad)
	}

	private readNonStandardDpad(gamepad: Gamepad) {
		this.setState("PadUp", gamepad.axes[9] < -0.7 || (0.8 < gamepad.axes[9] && gamepad.axes[9] < 1.1))
		this.setState("PadDown", -0.2 < gamepad.axes[9] && gamepad.axes[9] < 0.5)
		this.setState("PadLeft", 0.4 < gamepad.axes[9] && gamepad.axes[9] < 1.1)
		this.setState("PadRight", -0.8 < gamepad.axes[9] && gamepad.axes[9] < 0)
	}

	private setState(button: string, state: boolean) {
		this.pollableState[button].state = state || this.pollableState[button].state
	}
}

export interface InputState {
	[key: string]: { hasChanged: boolean, state: boolean }
}