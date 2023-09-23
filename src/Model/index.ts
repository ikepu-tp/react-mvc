import Send, { ResponseResource } from 'src/Send';
import Url, { ParamType } from 'src/Url';

export default class Model<defaultResponse = ResponseResource> {
	protected url: Url = new Url();
	protected send: Send = new Send<defaultResponse>();

	constructor(
		default_param: ParamType | undefined = undefined,
		default_headers: { [s: string]: string } | undefined = undefined,
		send: Send | undefined = undefined
	) {
		if (send) this.send = send;
		if (default_param) this.send.setDefaultParam(default_param);
		if (default_headers) this.send.setDefaultHeaders(default_headers);
	}
}
