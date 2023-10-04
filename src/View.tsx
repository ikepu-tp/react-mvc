import { PropsWithChildren } from 'react';

export type ViewWrapperProps = PropsWithChildren & {};
export type ViewIndexProps = PropsWithChildren & {};
export type ViewShowProps = PropsWithChildren & {};
export type ViewEditProps = PropsWithChildren & {};
export class View<I = ViewIndexProps, S = ViewShowProps, E = ViewEditProps> {
	public wrapper(props: ViewWrapperProps): JSX.Element {
		return <>{props.children}</>;
	}

	public callWrapper<T = ViewWrapperProps>(
		children: JSX.Element | undefined = undefined,
		props: T | undefined = undefined
	): JSX.Element {
		return this.wrapper({ children: children, ...(props || {}) });
	}

	public index(props: I): JSX.Element {
		return this.callWrapper(<div {...(props as ViewIndexProps)} />);
	}

	public show(props: S): JSX.Element {
		return this.callWrapper(<div {...(props as ViewShowProps)} />);
	}

	public edit(props: E): JSX.Element {
		return this.callWrapper(<div {...(props as ViewEditProps)} />);
	}
}

const view = new View();
export default {
	Index: view.index,
	Show: view.show,
	Edit: view.edit,
};
