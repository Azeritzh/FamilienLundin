import { HttpClient } from "@angular/common/http"
import { Component } from "@angular/core"
import { NavigationService } from "../../../services/navigation.service"
import { ActivatedRoute, Router } from "@angular/router"

@Component({
	selector: "lundin-sub-gallery",
	templateUrl: "./sub-gallery.component.html",
	styleUrls: ["./sub-gallery.component.scss"],
})
export class SubGalleryComponent {
	subGallery: string = ""
	folder: string = ""
	images: string[] = []

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
			this.images = files as any
		})
	}
}
