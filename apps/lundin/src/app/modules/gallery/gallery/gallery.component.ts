import { HttpClient } from "@angular/common/http"
import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { GalleryStructure } from "@lundin/api-interfaces"

@Component({
	selector: "lundin-gallery",
	templateUrl: "./gallery.component.html",
	styleUrls: ["./gallery.component.scss"],
})
export class GalleryComponent {
	structure: GalleryStructure = {
		"Kristjan": [],
	}
	subGalleries: string[] = []

	constructor(
		private router: Router,
		httpClient: HttpClient,
	) {
		httpClient.get("api/gallery/get-folders").subscribe(folders => {
			this.structure = folders as any
			this.subGalleries = Object.keys(this.structure)
		})
	}

	openSubGallery(subGallery: string) {
		this.router.navigate([`/gallery/${subGallery}`])
	}
}
