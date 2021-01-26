import { Component, EventEmitter, Output } from "@angular/core"

@Component({
	selector: "lundin-file-input",
	templateUrl: "./file-input.component.html",
	styleUrls: ["./file-input.component.scss"],
})
export class FileInputComponent {
	@Output() changeFile = new EventEmitter<File>()

	handleFiles = (files: File[]) => {
		this.changeFile.emit(files[0])
	}

	clickThrough(element) {
		element.dispatchEvent(new MouseEvent("click"))
	}

	fileDragHover(e) {
		e.stopPropagation()
		e.preventDefault()
		e.target.className = (e.type === "dragover" ? "dragover" : "")
	}

	fileSelectHandler(callback) {
		return (e) => {
			// cancel event and hover styling
			this.fileDragHover(e)
			const files = e.target.files || e.dataTransfer.files
			callback(files)
		}
	}
}
