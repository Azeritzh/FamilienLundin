export enum Input {
	// Normal mode:
	NormalModeMoveUp,
	NormalModeMoveDown,
	NormalModeMoveLeft,
	NormalModeMoveRight,

	NormalModeUseItem,
	NormalModeToolPrimary,
	NormalModeToolSecondary,
	NormalModeAction,

	// Non-normal mode:
	MoveUp,
	MoveDown,
	MoveLeft,
	MoveRight,

	UseItem,
	ToolPrimary,
	ToolSecondary,
	Action,

	// Selection mode:
	ToggleSelection,
	HoldSelection,

	SelectionModeSelectTopItem,
	SelectionModeSelectBottomItem,
	SelectionModeSelectLeftItem,
	SelectionModeSelectRightItem,

	SelectionModeSelectTopTool,
	SelectionModeSelectBottomTool,
	SelectionModeSelectLeftTool,
	SelectionModeSelectRightTool,

	// Non-selection mode:
	SelectTopItem,
	SelectBottomItem,
	SelectLeftItem,
	SelectRightItem,

	SelectTopTool,
	SelectBottomTool,
	SelectLeftTool,
	SelectRightTool,

	// Camera mode:
	ToggleCamera,
	HoldCamera,

	CameraModeMoveCameraUp,
	CameraModeMoveCameraDown,
	CameraModeMoveCameraLeft,
	CameraModeMoveCameraRight,

	CameraModeLookUp,
	CameraModeLookDown,
	CameraModeRotateCameraLeft,
	CameraModeRotateCameraRight,

	// Non-camera mode:
	MoveCameraUp,
	MoveCameraDown,
	MoveCameraLeft,
	MoveCameraRight,

	LookUp,
	LookDown,
	RotateCameraLeft,
	RotateCameraRight,

	// Modeless/extra:
	ToggleInventory,
	ToggleMenu,
	ToggleChat,

	SelectTopItemSet,
	SelectBottomItemSet,
	SelectLeftItemSet,
	SelectRightItemSet,

	SelectNextItem,
	SelectPreviousItem,

	HoldWalk,
	ToggleWalk,
}
