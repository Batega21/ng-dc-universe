import { DialogData } from '../interfaces/dialog';

export const DELETE_DIALOG_DATA: DialogData = {
  title: '',
  message: 'Are you sure you want to delete this hero? Flash can revert it, but it will be in another Alternate Timeline.',
  confirmButtonText: 'YES! Delete',
  cancelButtonText: 'Well, maybe not',
  confirmButtonIcon: 'delete',
  cancelButtonIcon: 'cancel',
};

export const ADD_DIALOG_DATA: DialogData = {
  title: 'Add a new hero',
  message: 'Great! Another hero is on the way.',
  confirmButtonText: 'Add it',
  cancelButtonText: 'Nope, cancel',
  confirmButtonIcon: 'add',
  cancelButtonIcon: 'cancel',
  actionType: 'add',
};

export const EDIT_DIALOG_DATA: DialogData = {
  title: '',
  message: 'Updating this hero may result in creating another Multiverse... Are you sure you want to proceed?',
  confirmButtonText: 'Yes, update it',
  cancelButtonText: 'Nope, cancel',
  confirmButtonIcon: 'save',
  cancelButtonIcon: 'cancel',
  actionType: 'edit',
};