import { Component } from "@angular/core"
import { NavigationService } from "../../../services/navigation.service"
import { AddImageComponent } from "../add-image/add-image.component"
import { EditImageComponent } from "../edit-image/edit-image.component"

@Component({
	selector: "lundin-gallery",
	templateUrl: "./gallery.component.html",
	styleUrls: ["./gallery.component.scss"],
})
export class GalleryComponent {

	constructor(
		private navigationService: NavigationService,
	) {	}

	add() {
		this.navigationService.openAsOverlay(AddImageComponent)
	}

	edit() {
		this.navigationService.openAsOverlay(EditImageComponent)
	}
}
