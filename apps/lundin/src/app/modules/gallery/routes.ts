import { Routes } from "@angular/router"
import { GalleryComponent } from "./gallery/gallery.component"
import { SubGalleryComponent } from "./gallery/sub-gallery.component"

export const galleryRoutes: Routes = [
	{ path: "", component: GalleryComponent },
	{ path: ":sub-gallery/:folder", component: SubGalleryComponent },
]
