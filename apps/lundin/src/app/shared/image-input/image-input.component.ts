import { CommonModule } from "@angular/common"
import { Component, EventEmitter, Input, Output } from "@angular/core"
import { FileInputComponent } from "../file-input/file-input.component"

@Component({
	selector: "lundin-image-input",
	templateUrl: "./image-input.component.html",
	styleUrls: ["./image-input.component.scss"],
	imports: [
		CommonModule,
		FileInputComponent,
	]
})
export class ImageInputComponent {
	@Input() imagePath: string | null = null
	@Output() changeFile = new EventEmitter<File>()

	handleFile(file: File) {
		const reader = new FileReader()
		reader.onload = x => this.imagePath = <string>x.target?.result
		reader.readAsDataURL(file)
		this.changeFile.emit(file)
	}

	resetImage() {
		this.imagePath = null
	}
}
