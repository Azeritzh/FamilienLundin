import { Component } from "@angular/core"
import { NavigationService } from "../../../services/navigation.service"
import { LabellingDirective } from "../../../shared/directives/labelling.directive"
import { FileInputComponent } from "../../../shared/file-input/file-input.component"
import { GalleryService } from "../gallery.service"

@Component({
	selector: "lundin-add-image",
	templateUrl: "./add-image.component.html",
	styleUrls: ["./add-image.component.scss", "../../../styles/popup-box.scss"],
	imports: [
		LabellingDirective,
		FileInputComponent,
	],
})
export class AddImageComponent {

	constructor(
		private galleryService: GalleryService,
		private navigationService: NavigationService,
	) { }

	async save() {
		//await this.galleryService.addImage(this.personId, this.file)
		this.navigationService.closeOverlay()
	}

	cancel() {
		this.navigationService.closeOverlay()
	}
}
