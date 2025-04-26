import { Component } from "@angular/core"
import { RouterModule } from "@angular/router"

@Component({
	selector: "lundin-recipes-root",
	template: "<router-outlet></router-outlet>",
	styleUrls: ["./recipes-root.component.scss"],
	imports: [
		RouterModule,
	],
})
export class RecipesRootComponent { }
