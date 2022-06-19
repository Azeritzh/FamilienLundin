import { Component, ElementRef, NgZone, OnInit, ViewChild } from "@angular/core"
import { GameRunner } from "@lundin/age"
import { defaultDisplayConfig, Renderend, RenderendDisplay, RenderendInput } from "@lundin/renderend"

@Component({
	selector: "lundin-renderend",
	templateUrl: "./renderend.component.html",
	styleUrls: ["./renderend.component.scss"],
})
export class RenderendComponent implements OnInit {
	@ViewChild("gameHost", { static: true }) gameHost: ElementRef<HTMLDivElement>
	game: GameRunner<any>

	constructor(private ngZone: NgZone) { }

	ngOnInit() {
		const renderend = new Renderend()
		const display = new RenderendDisplay({...defaultDisplayConfig, assetFolder: "assets/images/renderend/"}, renderend, this.gameHost.nativeElement)
		const input = new RenderendInput(display.canvas)
		this.game = new GameRunner(display, input, renderend)

		input.restart()
		this.game.updateGame()

		this.sizeToAvailableSpace()
		window.onresize = this.sizeToAvailableSpace
		this.ngZone.runOutsideAngular(() => {
			this.game.startDisplayLoop()
			this.game.startGameLoop()
		})
	}

	private sizeToAvailableSpace = () => {
		this.game.setSize(
			this.gameHost.nativeElement.clientWidth,
			this.gameHost.nativeElement.clientHeight,
		)
	}
}
