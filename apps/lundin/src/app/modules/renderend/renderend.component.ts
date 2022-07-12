import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core"
import { RenderendGame } from "@lundin/renderend"

@Component({
	selector: "lundin-renderend",
	templateUrl: "./renderend.component.html",
	styleUrls: ["./renderend.component.scss"],
})
export class RenderendComponent implements OnInit, OnDestroy {
	@ViewChild("gameHost", { static: true }) gameHost: ElementRef<HTMLDivElement>
	private game: RenderendGame

	constructor(private ngZone: NgZone) { }

	ngOnInit() {
		this.game = RenderendGame.createAt(this.gameHost.nativeElement, { AssetFolder: "assets/images/renderend/" })

		this.ngZone.runOutsideAngular(() => {
			this.game.startDisplayLoop()
			this.game.startGameLoop()
		})
	}

	ngOnDestroy() {
		this.game.onDestroy()
	}
}
