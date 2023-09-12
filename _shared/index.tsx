export const DEFAULT_DOMAIN_VALUE = { value: "", label: "Seleziona" };
export const DEFAULT_OFFICE_VALUE = { value: "", label: "Seleziona" };
export const DEFAULT_ROOM_VALUE = { value: "", label: "Seleziona" };

export enum StepperState {
	DOMAIN,
	OFFICE,
	ROOM,
}

export const enum DirectionMode {
	NEGATIVE = -1,
	POSITIVE = 1,
}

export const SUPERADMIN: string = "SUPERADMIN";
export const ADMIN: string = "ADMIN";
export const USER: string = "USER";

export const PRISTINE = 0;
export const ADD = 1;
export const DELETE = 2;
export const ADDALL = 3;
export const REQUESTALL = 4;
export const APPROVE = 5;
export const MANAGE = 6;
export const DISAPPROVE = 7;
export const CLEAN = 8;

export enum Actions {
	PRISTINE,
	ADD,
	DELETE,
	ADDALL,
	REQUESTALL,
	APPROVE,
	MANAGE,
	DISAPPROVE,
	CLEAN,
}

export const SEATS_MODAL = 1;
export const APPROVE_MODAL = 2;
export const LEGENDA_MODAL = 3;
export const EDIT_MODAL = 4;
export const READ_MODAL = 5;
export const CLEAN_MODAL = 6;
export const DELETE_MODAL = 7;

export enum ModalType {
	PRISTINE,
	SEATS,
	APPROVE,
	LEGENDA,
	EDIT,
	READ,
	CLEAN,
	DELETE,
}

export const AUTH_OK = "authenticated";
export const AUTH_KO = "unauthenticated";

export const OPTION_CHAIR = "chair";
export const OPTION_V_LINE_TOP = "vLineTop";
export const OPTION_V_LINE_BOTTOM = "vLineBottom";
export const OPTION_H_LINE_LEFT = "hLineLeft";
export const OPTION_H_LINE_RIGHT = "hLineRight";
export const OPTION_T_TABLE_RIGHT = "tr";
export const OPTION_T_TABLE_LEFT = "tl";
export const OPTION_B_TABLE_RIGHT = "br";
export const OPTION_B_TABLE_LEFT = "bl";

export const MEET_WHOLE = "meet-whole";
export const MEET_ROOM = "meet-room";
export const MEET = "meet";
export const PENDING = "pending";
export const APPROVED = "approved";
export const ACCEPTED = "accepted";
export const WHOLE = "whole";
