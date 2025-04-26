import { Component } from "@angular/core"
import { PersonFile } from "@lundin/api-interfaces"
import { NavigationService } from "../../../services/navigation.service"

@Component({
	selector: "lundin-edit-file",
	templateUrl: "./edit-file.component.html",
	styleUrls: ["./edit-file.component.scss", "../../../styles/popup-box.scss"],
	standalone: false,
})
export class EditFileComponent {
	personId!: number
	file!: PersonFile

	constructor(
		private navigationService: NavigationService,
	) { }

	pathFor(file: PersonFile) {
		return `api/ancestry/file/${file.fileId}/${file.name}`
	}

	isImage(file: PersonFile) {
		const imageExtensions = [".jpg", ".png", ".bmp"]
		const fileName = file.name.toLowerCase()
		return imageExtensions.some(x => fileName.endsWith(x))
	}

	async save() {
		
	}

	cancel() {
		this.navigationService.closeOverlay()
	}
}
