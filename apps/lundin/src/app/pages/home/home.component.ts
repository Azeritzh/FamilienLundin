import { Component } from "@angular/core"
import { AddThreadComponent } from "../../modules/message/add-thread/add-thread.component"
import { NavigationService } from "../../services/navigation.service"

@Component({
	selector: "lundin-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"]
})
export class HomeComponent {
	constructor(private navigationService: NavigationService) { }

	asdf() {
		this.navigationService.openAsOverlay(AddThreadComponent)
	}
}
