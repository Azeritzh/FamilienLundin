import { Component } from "@angular/core"
import { Minestryger } from "@lundin/minestryger"

@Component({
	selector: "lundin-minestryger",
	templateUrl: "./minestryger.component.html",
	styleUrls: ["./minestryger.component.scss"],
})
export class MinestrygerComponent {
	game = new Minestryger()
}
