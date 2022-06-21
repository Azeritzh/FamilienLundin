import { GameRunner } from "@lundin/age"
import { defaultDisplayConfig } from "./defaults"
import { Renderend } from "./renderend"
import { RenderendDisplay } from "./renderend-display"
import { RenderendInput } from "./renderend-input"
import { RenderendAction } from "./state/renderend-action"

export class RenderendGame extends GameRunner<RenderendAction> {
	static createAt(hostElement: HTMLElement, displayConfig: any) {
		const renderend = new Renderend()
		const display = new RenderendDisplay({ ...defaultDisplayConfig, ...displayConfig }, renderend, hostElement)
		const input = new RenderendInput(display.canvas)
		return new RenderendGame(display, input, renderend)
	}
}
