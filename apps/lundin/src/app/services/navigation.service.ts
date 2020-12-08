import { Injectable, Type } from "@angular/core"
import { Router } from "@angular/router"
import { Subject } from "rxjs"

@Injectable()
export class NavigationService {
	openOverlay$ = new Subject<{ component?: Type<any>, init?: (component: any) => void }>()
	constructor(private router: Router) { }

	open(path: string) {
		this.router.navigateByUrl(path)
		this.closeOverlay()
	}

	openAsOverlay<T>(component: Type<T>) {
		return new Promise<T>(resolve => {
			this.openOverlay$.next({ component, init: (instance: T) => resolve(instance) })
		})
	}

	closeOverlay() {
		this.openOverlay$.next({})
	}
}
