import Function from './Function';
import Url, { ParamType } from './Url';

export type SendGetProps<Param = ParamType> = {
	path: string;
	param?: Param;
	headers?: HeadersInit;
};
export type SendPostProps<Param = ParamType> = SendGetProps<Param> & {
	body?: BodyInit;
};
export type SendPutProps<Param = ParamType> = SendPostProps<Param>;
export type SendPatchProps<Param = ParamType> = SendPostProps<Param>;
export type SendDeleteProps<Param = ParamType> = SendPostProps<Param>;
export type SendProps<Param = ParamType> = SendGetProps<Param> & {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: BodyInit;
};
export type ResponseStatusResource = {
	result: boolean;
	code: number;
	nonce: string;
};
export type ResponseResource = {
	status: ResponseStatusResource;
};
export type SuccessResponseResource<T = any> = ResponseResource & {
	payloads: T;
};
export type ErrorResource = {
	abstract: string;
	title: string;
	code: number;
	messages: (string | object)[];
};
export type FailedResponseResource = ResponseResource & {
	error: ErrorResource;
};
export type SuccessOrFailedResponseResource<T = any> = ResponseResource & {
	payloads?: T;
	error?: ErrorResource;
};
export default class Send<defaultResponse = SuccessOrFailedResponseResource> {
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
		this.default_headers['X-XSRF-TOKEN'] = Function.cookie('XSRF-TOKEN', '');
		this.default_headers['X-NONCE'] = Function.createKey();
	}

	protected afterSend(): void {
		if (this.responseBody === null) {
			this.resetCount();
			return;
		}
		if (!this.checkNonce()) this.unexpectedResponse();
		this.resetCount();
	}

	protected checkNonce(): boolean {
		if (!this.responseHeader) return false;
		return this.responseHeader.get('Request-Nonce') === this.default_headers['X-NONCE'];
	}

	protected async unexpectedResponse(): Promise<void> {
		if (this.count > 1) throw new Error('Unexpected response.');
		if (!this.sendProps) throw new Error('Unexpected response and failed');
		await this.send(this.sendProps);
	}

	protected setSendProps<Param = ParamType>(props: SendProps<Param>): void {
		this.sendProps = { ...{}, ...props } as SendProps;
	}

	public async send<R = defaultResponse, Param = ParamType>(props: SendProps<Param>): Promise<R | null> {
		this.countUp();
		this.setSendProps<Param>(props);

		this.beforeSend();

		const _option: RequestInit = {
			method: props.method || 'GET',
			headers: {
				...{},
				...this.default_headers,
				...(props.headers || {}),
			},
		};

		if (props.body) _option['body'] = props.body;

		const _response: Response = await fetch(this.Url.generateUrl(props.path, props.param || {}), _option);
		this.responseHeader = _response.headers;

		if (_response.status === 204) {
			this.responseBody = null;
			this.afterSend();
			this.resetCount();
			return null;
		}

		const _response_body: R = await _response.json();

		this.responseBody = _response_body;

		this.afterSend();

		return _response_body;
	}

	public async get<R = defaultResponse, Param = ParamType>(props: SendGetProps<Param>): Promise<R | null> {
		return this.send<R, Param>({ method: 'GET', ...props });
	}

	public async post<R = defaultResponse, Param = ParamType>(props: SendPostProps<Param>): Promise<R | null> {
		return this.send<R, Param>({ method: 'POST', ...props });
	}

	public async put<R = defaultResponse, Param = ParamType>(props: SendPutProps<Param>): Promise<R | null> {
		return this.send<R, Param>({ method: 'PUT', ...props });
	}

	public async patch<R = defaultResponse, Param = ParamType>(props: SendPatchProps<Param>): Promise<R | null> {
		return this.send<R, Param>({ method: 'PATCH', ...props });
	}

	public async delete<R = defaultResponse, Param = ParamType>(props: SendDeleteProps<Param>): Promise<R | null> {
		return this.send<R, Param>({ method: 'DELETE', ...props });
	}
}
