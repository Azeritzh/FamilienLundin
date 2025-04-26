import { Item } from "../state/item"

export class SelectableTools {
	constructor(
		public Items: (Item | null)[],
		public CurrentToolIndex = 0
	) { }

	CurrentTool() {
		return this.Items[this.CurrentToolIndex]
	}

	SelectTool(index: number) {
		if (index > 3)
			index = 0
		if (index < 0)
			index = 3
		return new SelectableTools(this.Items, index)
	}
}
