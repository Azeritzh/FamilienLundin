import { Component } from "@angular/core"
import { RouterModule } from "@angular/router"

@Component({
	selector: "lundin-gallery-root",
	template: "<router-outlet></router-outlet>",
	styleUrls: ["./gallery-root.component.scss"],
	imports: [
		RouterModule,
	],
})
export class GalleryRootComponent { }
