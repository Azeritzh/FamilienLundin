import { Component, EventEmitter, Input, Output } from "@angular/core"

@Component({
	selector: "lundin-image-input",
	templateUrl: "./image-input.component.html",
	styleUrls: ["./image-input.component.scss"],
})
export class ImageInputComponent {
	@Input() existingImagePath: string
	@Input() newImage: File
	@Output() changeFile = new EventEmitter<File>()

	handleFile(file: File) {
		this.changeFile.emit(file)
	}

	resetImage() {
		this.existingImagePath = null
		this.newImage = null
	}
}
