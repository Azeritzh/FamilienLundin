export class KeyStates {
	constructor(
		public onDown: { [key: string]: (key: string) => void } = {},
		public onUp: { [key: string]: (key: string) => void } = {},
		private states: { [key: string]: number } = {},
		private eventStates: { [key: string]: EventState } = {},
	) {
		window.addEventListener("keydown", this.onKeyDown, { capture: true })
		window.addEventListener("keyup", this.onKeyUp)
		window.addEventListener("mousemove", this.onMouseMove)
		window.addEventListener("mousedown", this.onMouseDown)
		window.addEventListener("mouseup", this.onMouseUp)
		window.addEventListener("wheel", this.onScroll)
		window.addEventListener("contextmenu", this.preventDefault)
	}

	onDestroy() {
		window.removeEventListener("keydown", this.onKeyDown)
		window.removeEventListener("keyup", this.onKeyUp)
		window.removeEventListener("mousemove", this.onMouseMove)
		window.removeEventListener("mousedown", this.onMouseDown)
		window.removeEventListener("mouseup", this.onMouseUp)
		window.removeEventListener("wheel", this.onScroll)
		window.removeEventListener("contextmenu", this.preventDefault)
	}

	private preventDefault = (event: MouseEvent) => {
		event.preventDefault()
	}

	private onKeyDown = (event: KeyboardEvent) => {
		const code = this.getKeyboardCode(event)
		if (this.states[code])
			return
		this.states[code] = 1
		this.eventStates[code] = EventState.JustPressed
		this.onDown[code]?.(code)
	}

	private onKeyUp = (event: KeyboardEvent) => {
		const code = this.getKeyboardCode(event)
		if (!this.states[code])
			return
		this.onUp[code]?.(code)
		if (this.eventStates[code] === EventState.JustPressed)
			this.eventStates[code] = EventState.ShouldBeReset
		else
			this.states[code] = 0
	}

	private getKeyboardCode(event: KeyboardEvent) {
		if (event.code.startsWith("Arrow"))
			return event.code.substring(5)
		if (event.code.startsWith("Digit"))
			return event.code[5]
		if (event.code.startsWith("Key"))
			return event.code[3]
		if (event.code === "ShiftLeft")
			return "LeftShift"
		return event.code
	}

	private onMouseMove = (event: MouseEvent) => {
		this.states["MouseX"] = event.clientX
		this.states["MouseY"] = event.clientY
	}

	private onMouseDown = (event: MouseEvent) => {
		const code = this.getMouseButtonCode(event)
		if (this.states[code])
			return
		this.states[code] = 1
		this.eventStates[code] = EventState.JustPressed
		this.onDown[code]?.(code)
	}

	private onMouseUp = (event: MouseEvent) => {
		const code = this.getMouseButtonCode(event)
		if (!this.states[code])
			return
		this.onUp[code]?.(code)
		if (this.eventStates[code] === EventState.JustPressed)
			this.eventStates[code] = EventState.ShouldBeReset
		else
			this.states[code] = 0
	}

	private getMouseButtonCode(event: MouseEvent) {
		switch (event.button) {
			case 0: return "MouseLeft"
			case 1: return "MouseMiddle"
			case 2: return "MouseRight"
			default: return "MouseLeft" // idk...
		}
	}

	private onScroll = (event: WheelEvent) => {
		if (event.deltaY > 0) {
			this.states["MouseScrollDown"] = 1
			this.eventStates["MouseScrollDown"] = EventState.ShouldBeReset
		}
		else if (event.deltaY < 0) {
			this.states["MouseScrollUp"] = 1
			this.eventStates["MouseScrollUp"] = EventState.ShouldBeReset
		}
	}

	endInputFrame() {
		for (const key in this.eventStates) {
			if (this.eventStates[key] === EventState.ShouldBeReset)
				this.states[key] = 0
		}
		this.eventStates = {}
	}

	getInputState(input: string) {
		return this.states[input] ?? this.getFirstGamepadState(input)
	}

	private getFirstGamepadState(input: string) {
		const gamepads = (navigator.getGamepads?.() ?? []).filter(x => x)
		if (gamepads.length === 0)
			return 0
		const gamepad = gamepads.first()!
		if (gamepad?.mapping === "standard")
			return this.getStandardGamepadState(input, gamepad)
		else
			return this.getNonStandardGamepadState(input, gamepad)
	}

	private getStandardGamepadState(input: string, gamepad: Gamepad) {
		return this.getStandardButtonState(input, gamepad)
			?? this.getStandardAnalogStickState(input, gamepad)
	}

	private getStandardButtonState(input: string, gamepad: Gamepad) {
		switch (input) {
			case "PadA": return gamepad.buttons[0].pressed ? 1 : 0
			case "PadB": return gamepad.buttons[1].pressed ? 1 : 0
			case "PadX": return gamepad.buttons[2].pressed ? 1 : 0
			case "PadY": return gamepad.buttons[3].pressed ? 1 : 0
			case "PadLeftShoulder": return gamepad.buttons[4].pressed ? 1 : 0
			case "PadRightShoulder": return gamepad.buttons[5].pressed ? 1 : 0
			case "PadSelect": return gamepad.buttons[8].pressed ? 1 : 0
			case "PadStart": return gamepad.buttons[9].pressed ? 1 : 0
			case "PadUp": return gamepad.buttons[12].pressed ? 1 : 0
			case "PadDown": return gamepad.buttons[13].pressed ? 1 : 0
			case "PadLeft": return gamepad.buttons[14].pressed ? 1 : 0
			case "PadRight": return gamepad.buttons[15].pressed ? 1 : 0
		}
		return 0
	}

	private getStandardAnalogStickState(input: string, gamepad: Gamepad) {
		switch (input) {
			case "PadLeftStickUp": return Math.max(0, -gamepad.axes[1]) * 1.2 - 0.2
			case "PadLeftStickDown": return Math.max(0, gamepad.axes[1]) * 1.2 - 0.2
			case "PadLeftStickLeft": return Math.max(0, -gamepad.axes[0]) * 1.2 - 0.2
			case "PadLeftStickRight": return Math.max(0, gamepad.axes[0]) * 1.2 - 0.2
		}
		return 0
	}

	private getNonStandardGamepadState(input: string, gamepad: Gamepad) {
		return this.getNonStandardDpadState(input, gamepad)
			?? this.getStandardButtonState(input, gamepad)
			?? this.getNonStandardEmulatedLeftAnalogState(input, gamepad)
	}

	private getNonStandardDpadState(input: string, gamepad: Gamepad) {
		switch (input) {
			case "PadUp": return (gamepad.axes[9] < -0.7 || (0.8 < gamepad.axes[9] && gamepad.axes[9] < 1.1)) ? 1 : 0
			case "PadDown": return (-0.2 < gamepad.axes[9] && gamepad.axes[9] < 0.5) ? 1 : 0
			case "PadLeft": return (0.4 < gamepad.axes[9] && gamepad.axes[9] < 1.1) ? 1 : 0
			case "PadRight": return (-0.8 < gamepad.axes[9] && gamepad.axes[9] < 0) ? 1 : 0
		}
		return 0
	}

	private getNonStandardEmulatedLeftAnalogState(input: string, gamepad: Gamepad) {
		switch (input) {
			case "PadLeftStickUp": return (gamepad.axes[9] < -0.7 || (0.8 < gamepad.axes[9] && gamepad.axes[9] < 1.1)) ? 1 : 0
			case "PadLeftStickDown": return (-0.2 < gamepad.axes[9] && gamepad.axes[9] < 0.5) ? 1 : 0
			case "PadLeftStickLeft": return (0.4 < gamepad.axes[9] && gamepad.axes[9] < 1.1) ? 1 : 0
			case "PadLeftStickRight": return (-0.8 < gamepad.axes[9] && gamepad.axes[9] < 0) ? 1 : 0
		}
		return 0
	}
}

enum EventState { JustPressed, ShouldBeReset }
