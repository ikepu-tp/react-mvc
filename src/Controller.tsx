import { PropsWithChildren } from 'react';
import { View, ViewEditProps, ViewIndexProps, ViewShowProps } from './View';

export type ControllerWrapperProps = PropsWithChildren & {};
export type ControllerIndexProps = PropsWithChildren & {};
export type ControllerShowProps = PropsWithChildren & {};
export type ControllerEditProps = PropsWithChildren & {};
export class Controller<I = ViewIndexProps, S = ViewShowProps, E = ViewEditProps> {
	public view = new View<I, S, E>();

	public index(): JSX.Element {
		return this.indexView({} as I);
	}
	public indexView(props: I): JSX.Element {
		return this.view.index(props);
	}

	public show(): JSX.Element {
		return this.showView({} as S);
	}
	public showView(props: S): JSX.Element {
		return this.view.show(props);
	}

	public edit(): JSX.Element {
		return this.editView({} as E);
	}
	public editView(props: E): JSX.Element {
		return this.view.edit(props);
	}
}
const controller = new Controller();
export default {
	Index: controller.index,
	Show: controller.show,
	Edit: controller.edit,
};
