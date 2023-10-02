import { PropsWithChildren } from 'react';

export type ControllerWrapperProps = PropsWithChildren & {};
export type ControllerIndexProps = PropsWithChildren & {};
export type ControllerShowProps = PropsWithChildren & {};
export type ControllerEditProps = PropsWithChildren & {};
export class Controller {
	public wrapper(props: ControllerWrapperProps): JSX.Element {
		return <>{props.children}</>;
	}

	public index(props: ControllerIndexProps): JSX.Element {
		return <this.wrapper {...props}></this.wrapper>;
	}

	public show(props: ControllerShowProps): JSX.Element {
		return <this.wrapper {...props}></this.wrapper>;
	}

	public edit(props: ControllerEditProps): JSX.Element {
		return <this.wrapper {...props}></this.wrapper>;
	}
}
const controller = new Controller();
export default {
	Index: controller.index,
	Show: controller.show,
	Edit: controller.edit,
};
