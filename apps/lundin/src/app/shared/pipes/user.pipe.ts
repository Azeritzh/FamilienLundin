import { Pipe, PipeTransform } from "@angular/core"
import { User } from "@lundin/api-interfaces"
import { map } from "rxjs/operators"
import { UserService } from "../../services/user.service"

@Pipe({ name: "user" })
export class UserPipe implements PipeTransform {
	constructor(private userService: UserService) { }
	transform(id: number) {
		return this.userService.users$.pipe(
			map(this.selectById(id)),
			map(x => x.name),
		)
	}

	private selectById = (id: number) => (users: User[]) => {
		return users.find(x => x._id === id) ?? { _id: id, name: "UNKNOWN" }
	}
}
