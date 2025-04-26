import { Component } from "@angular/core"
import { NavigationService } from "../../../services/navigation.service"
import { FileInputComponent } from "../../../shared/file-input/file-input.component"
import { AncestryService } from "../ancestry.service"
import { LabellingDirective } from "../../../shared/directives/labelling.directive"
import { CommonModule } from "@angular/common"

@Component({
	selector: "lundin-add-file",
	templateUrl: "./add-file.component.html",
	styleUrls: ["./add-file.component.scss", "../../../styles/popup-box.scss"],
	imports: [
		CommonModule,
		FileInputComponent,
		LabellingDirective,
	],
})
export class AddFileComponent {
	personId!: number
	file: { description: string, data: File } = { description: "", data: null! }

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

	updateDescription(event: Event){
		this.file.description = (event.target as HTMLInputElement)?.value || ""
	}
}
