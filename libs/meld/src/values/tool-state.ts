import { Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Item } from "../state/item"

export class ToolState {
	constructor(
		public Action: ToolAction,
		public SourceItem: Item,
		public SubEntities: Id[],
		public Target: Vector3,
		public StartTime = 0,
		public EndTime = 0,
		public LockOrientation = false,
		public BlockMovement = false
	) { }

	static From(object: any) {
		return new ToolState(
			<ToolAction>(object?.Action ?? ToolAction.HammerStrike),
			Item.From(object?.SourceItem),
			object?.SubEntities ?? [],
			Vector3.From(object?.Target),
			object?.StartTime ?? 0,
			object?.EndTime ?? 0,
			object?.LockOrientation ?? false,
			object?.BlockMovement ?? false,
		)
	}
}

export enum ToolAction { HammerStrike }
