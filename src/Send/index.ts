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
	protected path: string = '/path/{required_parameters}/{optional_paramters?}';
	protected default_param: ParamType = {};
	protected default_headers: HeadersInit & { [s: string]: string } = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};

	constructor(url: Url | undefined = undefined) {
		if (url) this.Url = url;
	}

	public setDefaultParam(param: ParamType) {
		this.default_param = { ...{}, ...param };
	}

	public setDefaultHeaders(headers: { [s: string]: string }) {
		this.default_headers = { ...{}, ...headers };
	}

	protected beforeSend(): void {
		this.default_headers['X-XSRF-TOKEN'] = cookie('XSRF-TOKEN', '');
		this.default_headers['X-NONCE'] = createKey();
	}

	protected afterSend<R = defaultResponse>(response: R | null, headers: Headers): void {
		if (headers.get('Request-Nonce') !== this.default_headers['X-NONCE']) throw new Error('Unexpected response.');
		if (response) return;
	}

	public async send<R = defaultResponse>(props: SendProps): Promise<R | null> {
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
		const _response_header: Headers = _response.headers;

		this.afterSend(_response_body, _response_header);

		return _response_body;
	}

	public async sendGet<R = defaultResponse>(props: SendGetProps): Promise<R | null> {
		return this.send<R>({ method: 'GET', ...props });
	}

	public async sendPost<R = defaultResponse>(props: SendPostProps): Promise<R | null> {
		return this.send<R>({ method: 'POST', ...props });
	}

	public async sendPut<R = defaultResponse>(props: SendPutProps): Promise<R | null> {
		return this.send<R>({ method: 'PUT', ...props });
	}

	public async sendPatch<R = defaultResponse>(props: SendPatchProps): Promise<R | null> {
		return this.send<R>({ method: 'PATCH', ...props });
	}

	public async sendDelete<R = defaultResponse>(props: SendDeleteProps): Promise<R | null> {
		return this.send<R>({ method: 'DELETE', ...props });
	}
}
