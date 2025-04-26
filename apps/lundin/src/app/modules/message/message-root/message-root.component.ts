import { Component } from "@angular/core"
import { RouterModule } from "@angular/router";

@Component({
	selector: "lundin-message-root",
	template: "<router-outlet></router-outlet>",
	styleUrls: ["./message-root.component.scss"],
	imports: [
		RouterModule,
	],
})
export class MessageRootComponent { }
