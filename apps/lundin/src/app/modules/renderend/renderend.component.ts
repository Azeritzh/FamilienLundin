import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core"
import { RenderendGameComponent } from "./renderend-game/renderend-game.component"

@Component({
	selector: "lundin-renderend",
	templateUrl: "./renderend.component.html",
	styleUrls: ["./renderend.component.scss"],
})
export class RenderendComponent implements AfterViewInit {
	@ViewChild("gameArea", { static: true }) gameAreaElement: ElementRef<HTMLDivElement>
	@ViewChild(RenderendGameComponent, { static: true }) game: RenderendGameComponent

	ngAfterViewInit() {
		this.sizeToAvailableSpace()
		window.onresize = this.sizeToAvailableSpace
	}

	private sizeToAvailableSpace = () => {
		this.game.setSize(
			this.gameAreaElement.nativeElement.clientWidth,
			this.gameAreaElement.nativeElement.clientHeight,
		)
	}

	restart() {
		this.game.restart()
	}
}
