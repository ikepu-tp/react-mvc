import { PropsWithChildren } from 'react';
import View from './View';

export type ControllerWrapperProps = PropsWithChildren & {};
export type ControllerIndexProps = PropsWithChildren & {};
export type ControllerShowProps = PropsWithChildren & {};
export type ControllerEditProps = PropsWithChildren & {};
export class Controller {
	public view = View;

	public wrapper(props: ControllerWrapperProps): JSX.Element {
		return <>{props.children}</>;
	}

	public index(props: ControllerIndexProps): JSX.Element {
		return (
			<this.wrapper {...props}>
				<this.view.Index></this.view.Index>
			</this.wrapper>
		);
	}

	public show(props: ControllerShowProps): JSX.Element {
		return (
			<this.wrapper {...props}>
				<this.view.Show></this.view.Show>
			</this.wrapper>
		);
	}

	public edit(props: ControllerEditProps): JSX.Element {
		return (
			<this.wrapper {...props}>
				<this.view.Edit></this.view.Edit>
			</this.wrapper>
		);
	}
}
const controller = new Controller();
export default {
	Index: controller.index,
	Show: controller.show,
	Edit: controller.edit,
};
