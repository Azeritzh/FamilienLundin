import { Component, EventEmitter, Output } from "@angular/core"

@Component({
	selector: "lundin-file-input",
	templateUrl: "./file-input.component.html",
	styleUrls: ["./file-input.component.scss"],
	standalone: false,
})
export class FileInputComponent {
	@Output() changeFile = new EventEmitter<File>()

	handleFiles = (event: Event) => {
		const files = (event.target as HTMLInputElement)?.files ?? []
		this.changeFile.emit(files[0])
	}

	clickThrough(element: any) {
		element.dispatchEvent(new MouseEvent("click"))
	}

	fileDragHover(e: any) {
		e.stopPropagation()
		e.preventDefault()
		e.target.className = (e.type === "dragover" ? "dragover" : "")
	}

	fileSelectHandler(callback: any) {
		return (e: any) => {
			// cancel event and hover styling
			this.fileDragHover(e)
			const files = e.target.files || e.dataTransfer.files
			callback(files)
		}
	}
}
