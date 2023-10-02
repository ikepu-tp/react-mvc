import { PropsWithChildren } from 'react';

export type ViewIndexProps = PropsWithChildren & {};
export type ViewShowProps = PropsWithChildren & {};
export type ViewEditProps = PropsWithChildren & {};
export class View<I = ViewIndexProps, S = ViewShowProps, E = ViewEditProps> {
	public index(props: I): JSX.Element {
		return <div {...(props as ViewIndexProps)} />;
	}

	public show(props: S): JSX.Element {
		return <div {...(props as ViewShowProps)} />;
	}

	public edit(props: E): JSX.Element {
		return <div {...(props as ViewEditProps)} />;
	}
}

const view = new View();
export default {
	Index: view.index,
	Show: view.show,
	Edit: view.edit,
};
