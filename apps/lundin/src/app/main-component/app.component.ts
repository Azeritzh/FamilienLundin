import { Component, ComponentFactoryResolver, HostBinding, Type, ViewChild } from "@angular/core"
import { OverlayHostDirective } from "../directives/overlay-host.directive"
import { AuthService } from "../services/auth.service"
import { NavigationService } from "../services/navigation.service"

@Component({
	selector: "lundin-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	header = "Familien Lundin"
	navigationEntries: NavigationEntry[] = [
		{ text: "Hjem", link: "/", imageUrl: "/assets/images/icons/Home_icon.svg" },
		{ text: "Kalender", link: "/calendar", imageUrl: "/assets/images/icons/Calendar_icon.svg" },
		{ text: "Familie", link: "/ancestry", imageUrl: "/assets/images/icons/Family_icon.svg" },
		{ text: "Galleri", link: "/gallery", imageUrl: "/assets/images/icons/Gallery_icon.svg" },
		{ text: "Opskrifter", link: "/recipes", imageUrl: "/assets/images/icons/Recipes_icon.svg" },
		{ text: "Diverse", link: "/various", imageUrl: "/assets/images/icons/Home_icon.svg" },
	]
	@HostBinding("class.hidden-navigation") hideNavigation = false

	@ViewChild("overlayHost", { read: OverlayHostDirective, static: true }) overlayHost: OverlayHostDirective
	showingOverlay = false
	message = ""
	showingMessage = false

	constructor(
		public authService: AuthService,
		private componentFactoryResolver: ComponentFactoryResolver,
		private navigationService: NavigationService,
	) {
		this.navigationService.overlay$.subscribe(({ component, init }) => {
			this.overlayHost.viewContainerRef.clear()
			this.showingOverlay = false
			if (component)
				init(this.openAsOverlay(component))
		})
		this.navigationService.message$.subscribe(message => {
			this.showingMessage = !!message
			this.message = message
		})
	}

	private openAsOverlay<T>(component: Type<T>): T {
		const factory = this.componentFactoryResolver.resolveComponentFactory(component)
		const componentRef = this.overlayHost.viewContainerRef.createComponent(factory)
		this.showingOverlay = true
		return componentRef.instance
	}

	closeOverlay(event: MouseEvent) {
		event.stopPropagation()
		if (event.target === event.currentTarget)
			this.navigationService.closeOverlay()
	}

	closeMessage() {
		this.showingMessage = false
	}
}

interface NavigationEntry {
	text: string
	link: string
	imageUrl: string
}
