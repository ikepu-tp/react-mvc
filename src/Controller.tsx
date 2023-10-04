import { PropsWithChildren } from 'react';
import { View, ViewEditProps, ViewIndexProps, ViewShowProps } from './View';

export type ControllerWrapperProps = PropsWithChildren & {};
export type ControllerIndexProps = PropsWithChildren & {};
export type ControllerShowProps = PropsWithChildren & {};
export type ControllerEditProps = PropsWithChildren & {};
export class Controller<I = ViewIndexProps, S = ViewShowProps, E = ViewEditProps> {
	public view = new View<I, S, E>();

	public index(): JSX.Element {
		return this.indexView<null>(null);
	}
	public indexView<T = I>(props: T): JSX.Element {
		return this.view.index<T>(props);
	}

	public show(): JSX.Element {
		return this.showView<null>(null);
	}
	public showView<T = S>(props: T): JSX.Element {
		return this.view.show<T>(props);
	}

	public edit(): JSX.Element {
		return this.editView<null>(null);
	}
	public editView<T = E>(props: T): JSX.Element {
		return this.view.edit<T>(props);
	}
}
const controller = new Controller();
export default {
	Index: controller.index,
	Show: controller.show,
	Edit: controller.edit,
};
