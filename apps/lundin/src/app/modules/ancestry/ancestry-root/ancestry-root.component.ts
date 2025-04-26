import { Component } from "@angular/core"
import { RouterModule } from "@angular/router"

@Component({
	selector: "lundin-ancestry-root",
	template: "<router-outlet></router-outlet>",
	styleUrls: ["./ancestry-root.component.scss"],
	imports: [
		RouterModule,
	]
})
export class AncestryRootComponent { }
