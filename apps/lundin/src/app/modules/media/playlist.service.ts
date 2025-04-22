import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { MusicPlaylist } from "@lundin/api-interfaces"
import { firstValueFrom } from "rxjs"

@Injectable()
export class PlaylistService {
	constructor(private httpClient: HttpClient) { }

	getPlaylists() {
		return firstValueFrom(this.httpClient.get<MusicPlaylist[]>("api/music/get-playlists"))
	}

	addPlaylist(playlist: MusicPlaylist){
		return firstValueFrom(this.httpClient.post<MusicPlaylist>("api/music/add-playlist", playlist))
	}

	updatePlaylist(playlist: MusicPlaylist) {
		return firstValueFrom(this.httpClient.post("api/music/update-playlist", playlist))
	}
}
