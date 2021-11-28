import { Component, EventEmitter, Input, Output } from "@angular/core"

@Component({
	selector: "lundin-image-input",
	templateUrl: "./image-input.component.html",
	styleUrls: ["./image-input.component.scss"],
})
export class ImageInputComponent {
	@Input() imagePath: string
	@Output() changeFile = new EventEmitter<File>()

	handleFile(file: File) {
		const reader = new FileReader()
		reader.onload = x => this.imagePath = <string>x.target.result
		reader.readAsDataURL(file)
		this.changeFile.emit(file)
	}

	resetImage() {
		this.imagePath = null
	}
}
