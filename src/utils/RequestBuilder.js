export default class RequestBuilder {
  constructor(baseAPI, path) {
    this.baseAPI = baseAPI;
    this.path = path;
    this.options = {};
    this.headers = {};
  }

  /* {method, body, queries}  */
  setOptions(options) {
    this.options = {...options, ...this.options}
    if ("body" in options) {
      this.options.body = JSON.stringify(options.body);
      this.headers["Content-Type"] = "application/json";
    }
  }

  setHeaders(headers) {
    this.headers = { ...this.headers, ...headers };
  }

  getRequest(){
    this.options.headers = this.headers;
    return new Request(this.baseAPI + this.path, this.options)
  }

}
