import { PropsWithChildren } from 'react';

export type ViewWrapperProps = PropsWithChildren & {};
export type ViewIndexProps = PropsWithChildren & {};
export type ViewShowProps = PropsWithChildren & {};
export type ViewEditProps = PropsWithChildren & {};
export class View<I = ViewIndexProps, S = ViewShowProps, E = ViewEditProps> {
	public wrapper(props: ViewWrapperProps): JSX.Element {
		return <>{props.children}</>;
	}

	public index<T = I>(props: T): JSX.Element {
		return <div {...(props as ViewIndexProps)} />;
	}

	public show<T = S>(props: T): JSX.Element {
		return <div {...(props as ViewShowProps)} />;
	}

	public edit<T = E>(props: T): JSX.Element {
		return <div {...(props as ViewEditProps)} />;
	}
}

const view = new View();
export default {
	Index: view.index,
	Show: view.show,
	Edit: view.edit,
};
