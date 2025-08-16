
import { Component, ElementRef, ViewChild } from "@angular/core"

@Component({
	selector: "lundin-video",
	templateUrl: "./video.component.html",
	styleUrls: ["./video.component.scss"],
	imports: [],
})
export class VideoComponent {
	@ViewChild("videoPlayer") videoPlayer!: ElementRef<HTMLAudioElement>
	videoLibrary: any[] = []
	currentVideo: Video | null = null

	constructor() {
		fetch("/api/video/get-library")
			.then(async response => this.loadLibrary(await response.json()))
	}

	private loadLibrary(files: string[]) {
		this.videoLibrary = files.map(x => this.parseFileName(x)).filter(x => x !== null)
	}

	private parseFileName(file: string) {
		try {
			const [set, titleWithYear] = file.split("/")
			const [title, yearWithStuff] = titleWithYear.split(" (")
			const year = yearWithStuff.split(")")[0]
			return { title, set, year, file }
		}
		catch {
			console.error("Failed to parse file name", file)
			return null
		}
	}

	playVideo(video: Video) {
		this.currentVideo = video
		this.videoPlayer.nativeElement.src = "api/video/files/" + video.file
		this.videoPlayer.nativeElement.onloadeddata = () => this.videoPlayer.nativeElement.play()
	}
}

interface Video {
	title: string,
	set: string,
	year: string,
	file: string,
}
