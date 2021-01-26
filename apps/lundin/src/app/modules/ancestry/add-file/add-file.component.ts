import { Component } from "@angular/core"
import { NavigationService } from "../../../services/navigation.service"
import { AncestryService } from "../ancestry.service"

@Component({
	selector: "lundin-add-file",
	templateUrl: "./add-file.component.html",
	styleUrls: ["./add-file.component.scss", "../../../styles/popup-box.scss"],
})
export class AddFileComponent {
	personId: number
	file: { description: string, data: File } = { description: "", data: null}

	constructor(
		private ancestryService: AncestryService,
		private navigationService: NavigationService,
	) { }

	handleFile(file: File) {
		this.file.data = file
	}

	async save() {
		await this.ancestryService.addFile(this.personId, this.file)
		this.navigationService.closeOverlay()
	}

	cancel() {
		this.navigationService.closeOverlay()
	}
}
