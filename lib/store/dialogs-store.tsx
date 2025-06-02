import { BehaviorSubject } from 'rxjs';

export type DialogsState = {
  open:
  | 'new-cost-center'
  | 'new-appointment'
  | 'appointment-details'
  | 'new-field'
  | 'edit-field'
  | 'new-section'
  | 'edit-section'
  | 'new-template'
  | 'edit-template'
  | 'edit-appointment'
  | 'import-section'
  | 'new-role'
  | 'edit-role'
  | 'delete-role'
  | 'new-class'
  | 'edit-class'
  | 'delete-class'
  | 'new-company'
  | 'edit-company'
  | 'delete-company'
  | 'edit-user'
  | 'delete-user'
  | 'edit-user-role'
  | 'new-business-unit'
  | 'edit-business-unit'
  | 'delete-business-unit'
  | 'add-user-business-unit'
  | 'add-patient-business-unit'
  | 'delete-user-business-unit'
  | 'delete-patient-business-unit'
  | "new-account"
  | "new-journal"
  | "new-account-type"
  | "edit-account"
  | "confirm-billed-po"
  | false;
  payload?: any;
};

const initalState: DialogsState = {
  open: false,
  payload: undefined,
};

const dialogsState$ = new BehaviorSubject(initalState);

export const setDialogsState = (state: DialogsState) => {
  dialogsState$.next(state);
};

export const getDialogsState = () => {
  return dialogsState$.getValue();
};

export const closeDialogs = () => {
  dialogsState$.next({ open: false, payload: undefined });
};

export const dialogsStateObservable = dialogsState$.asObservable();
