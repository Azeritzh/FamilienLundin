export class KeyStates {
	constructor(
		public onDown: { [key: string]: (key: string) => void } = {},
		public onUp: { [key: string]: (key: string) => void } = {},
		public isPressed: { [key: string]: boolean } = {},
		private inputChanges: { [key: string]: boolean } = {},
		private pollableState: InputState = {},
	) {
		window.addEventListener("keydown", x => {
			if (isPressed[x.key])
				return
			this.isPressed[x.key] = true
			this.inputChanges[x.key] = true
			this.updateStateFor(x.key, true)
			onDown[x.key]?.(x.key)
		})
		window.addEventListener("keyup", x => {
			if (!isPressed[x.key])
				return
			this.isPressed[x.key] = false
			this.updateStateFor(x.key, false)
			if (!this.wasPressedSinceLastRequest(x.key))
				this.inputChanges[x.key] = false
			onUp[x.key]?.(x.key)
		})
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
		const gamepad = navigator.getGamepads()?.[0]
		if (!gamepad)
			return
		this.pollableState["PadUp"] = (gamepad.axes[9] < -0.7 || (0.8 < gamepad.axes[9] && gamepad.axes[9] < 1.1))
			? { hasChanged: true, state: true }
			: { hasChanged: true, state: false }
		this.pollableState["PadRight"] = (-0.8 < gamepad.axes[9] && gamepad.axes[9] < 0)
			? { hasChanged: true, state: true }
			: { hasChanged: true, state: false }
		this.pollableState["PadDown"] = (-0.2 < gamepad.axes[9] && gamepad.axes[9] < 0.5)
			? { hasChanged: true, state: true }
			: { hasChanged: true, state: false }
		this.pollableState["PadLeft"] = (0.4 < gamepad.axes[9] && gamepad.axes[9] < 1.1)
			? { hasChanged: true, state: true }
			: { hasChanged: true, state: false }
		this.pollableState["PadStart"] = { hasChanged: true, state: gamepad.buttons[9].pressed }
		this.pollableState["PadA"] = { hasChanged: true, state: gamepad.buttons[1].pressed }
		this.pollableState["PadB"] = { hasChanged: true, state: gamepad.buttons[0].pressed }
		this.pollableState["PadX"] = { hasChanged: true, state: gamepad.buttons[3].pressed }
		this.pollableState["PadY"] = { hasChanged: true, state: gamepad.buttons[2].pressed }
	}
}

export interface InputState {
	[key: string]: { hasChanged: boolean, state: boolean }
}