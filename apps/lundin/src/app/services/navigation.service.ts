import { Injectable, Type } from "@angular/core"
import { Router } from "@angular/router"
import { Subject } from "rxjs"

@Injectable()
export class NavigationService {
	overlay$ = new Subject<{ component?: Type<any>, init?: (component: any) => void }>()
	message$ = new Subject<string>()

	constructor(private router: Router) { }

	open(path: string) {
		this.router.navigateByUrl(path)
		this.closeOverlay()
	}

	openAsOverlay<T>(component: Type<T>) {
		return new Promise<T>(resolve => {
			this.overlay$.next({ component, init: (instance: T) => resolve(instance) })
		})
	}

	closeOverlay() {
		this.overlay$.next({})
	}

	showMessage(message: string) {
		this.message$.next(message)
	}

	closeMessage() {
		this.message$.next(null)
	}
}
