import Url, { ParamType } from './../Url';
import { cookie, createKey } from './../functions';

export type SendGetProps = {
	path: string;
	param?: ParamType;
	headers?: HeadersInit;
};
export type SendPostProps = SendGetProps & {
	body?: BodyInit;
};
export type SendPutProps = SendPostProps;
export type SendPatchProps = SendPostProps;
export type SendDeleteProps = SendPostProps;
export type SendProps = SendGetProps & {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: BodyInit;
};
export type ResponseResource = {
	status: {
		result: boolean;
		code: number;
		nonce: string;
	};
};
export default class Send<defaultResponse = ResponseResource> {
	protected Url: Url = new Url();
	protected default_param: ParamType = {};
	protected default_headers: HeadersInit & { [s: string]: string } = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	protected count: number = 0;
	protected sendProps: SendProps | undefined;
	protected responseHeader: Headers | undefined;
	protected responseBody: any;

	constructor(url: Url | undefined = undefined) {
		if (url) this.Url = url;
	}

	public setDefaultParam(param: ParamType) {
		this.default_param = { ...{}, ...param };
	}

	public setDefaultHeaders(headers: { [s: string]: string }) {
		this.default_headers = { ...{}, ...headers };
	}

	protected countUp(): void {
		++this.count;
	}

	protected countDown(): void {
		--this.count;
	}

	protected resetCount(): void {
		this.count = 0;
	}

	protected beforeSend(): void {
		this.default_headers['X-XSRF-TOKEN'] = cookie('XSRF-TOKEN', '');
		this.default_headers['X-NONCE'] = createKey();
	}

	protected afterSend(): void {
		if (!this.checkNonce()) this.unexpectedResponse();
	}

	protected checkNonce(): boolean {
		if (!this.responseHeader) return false;
		return this.responseHeader.get('Request-Nonce') !== this.default_headers['X-NONCE'];
	}

	protected async unexpectedResponse(): Promise<void> {
		if (this.count > 1) throw new Error('Unexpected response.');
		if (this.sendProps) await this.send(this.sendProps);
	}

	protected setSendProps(props: SendProps): void {
		this.sendProps = { ...{}, ...props };
	}

	public async send<R = defaultResponse>(props: SendProps): Promise<R | null> {
		this.countUp();
		this.setSendProps(props);

		this.beforeSend();

		const _option: RequestInit = {
			method: props.method || 'GET',
			headers: {
				...{},
				...this.default_headers,
				...(props.headers || {}),
			},
		};

		const _response: Response = await fetch(this.Url.generateUrl(props.path, props.param || {}), _option);
		const _response_body: R | null = await _response.json();

		this.responseHeader = _response.headers;
		this.responseBody = _response_body;

		this.afterSend();

		this.resetCount();

		return _response_body;
	}

	public async get<R = defaultResponse>(props: SendGetProps): Promise<R | null> {
		return this.send<R>({ method: 'GET', ...props });
	}

	public async post<R = defaultResponse>(props: SendPostProps): Promise<R | null> {
		return this.send<R>({ method: 'POST', ...props });
	}

	public async put<R = defaultResponse>(props: SendPutProps): Promise<R | null> {
		return this.send<R>({ method: 'PUT', ...props });
	}

	public async patch<R = defaultResponse>(props: SendPatchProps): Promise<R | null> {
		return this.send<R>({ method: 'PATCH', ...props });
	}

	public async delete<R = defaultResponse>(props: SendDeleteProps): Promise<R | null> {
		return this.send<R>({ method: 'DELETE', ...props });
	}
}
