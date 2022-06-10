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
}

export interface InputState {
	[key: string]: { hasChanged: boolean, state: boolean }
}