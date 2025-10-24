import { HttpClient } from "@angular/common/http"
import { Component } from "@angular/core"
import { ActivatedRoute } from "@angular/router"

@Component({
	selector: "lundin-sub-gallery",
	templateUrl: "./sub-gallery.component.html",
	styleUrls: ["./sub-gallery.component.scss"],
})
export class SubGalleryComponent {
	subGallery: string = ""
	folder: string = ""
	files: string[] = []

	constructor(
		private activatedRoute: ActivatedRoute,
		private httpClient: HttpClient,
	) {
		// Get sub-gallery from route params
		this.activatedRoute.paramMap.subscribe(params => {
			this.subGallery = params.get("sub-gallery") || ""
			this.folder = params.get("folder") || ""
			this.loadImages()
		})
	}

	private loadImages() {
		this.httpClient.get("api/gallery/get-files/" + this.subGallery + "/" + this.folder).subscribe(files => {
			this.files = files as any
		})
	}

	getVideoType(filename: string): string {
		if (filename.endsWith('.mp4')) return 'video/mp4'
		if (filename.endsWith('.webm')) return 'video/webm'
		if (filename.endsWith('.mkv')) return 'video/x-matroska'
		if (filename.endsWith('.avi')) return 'video/x-msvideo'
		return 'video/mp4' // fallback
	}
}
