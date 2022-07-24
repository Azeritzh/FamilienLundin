import { Item } from "../state/item"

export class SelectableItems {
	constructor(
		public Items: Item[],
		public CurrentSet = 0,
		public CurrentItemInSet = 0
	) { }

	CurrentItem() {
		return this.Items[this.CurrentSet * 4 + this.CurrentItemInSet]
	}

	ItemInCurrentSet(item: number) {
		return this.Items[this.CurrentSet * 4 + item]
	}

	SelectItem(index: number) {
		if (index > 3)
			index = 0
		if (index < 0)
			index = 3
		return new SelectableItems(this.Items, this.CurrentSet, index)
	}
}
