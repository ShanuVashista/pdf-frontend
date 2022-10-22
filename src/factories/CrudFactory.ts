import {CrudRequest, RequestOptions} from "@crud/core";
import {chooseFile} from "@crud/web";

export interface ResponseType<T = any> {
    data: T,
    message: string,
    type?: "error" | "success",
    status: 200 | 400 | 401 | number
}

const messages = {
    401: "Invalid username or password",
    404: "Not Found"
};

export class CrudFactory extends CrudRequest {

    baseUrl = env.API_URL;

    getUrl = (...segments) => segments.reduce((url, segment) => url + segment, this.baseUrl);

    async get<Request = any, Response = any>(url: string, data: any = {}, requestOptions: RequestInit = {}): Promise<ResponseType<Response>> {
        return this.send({
            method: "GET",
            url,
            data,
            ...requestOptions
        });
    }

    async post<Request = any, Response = any>(url: string, data: any = {}, requestOptions: RequestOptions = {}): Promise<ResponseType<Response>> {
        return this.send({
            method: "POST",
            url,
            data,
            ...requestOptions
        });
    }

    async put<Request = any, Response = any>(url: string, data: any = {}, requestOptions: RequestOptions = {}): Promise<ResponseType<Response>> {
        return this.send({
            method: "PUT",
            url,
            data,
            ...requestOptions
        });
    }

    async delete<Request = any, Response = any>(url: string, data: any = {}, requestOptions: RequestOptions = {}): Promise<ResponseType<Response>> {
        return this.send({
            method: "DELETE",
            url,
            data,
            ...requestOptions
        });
    }

    async send(requestOptions: RequestOptions = {}): Promise<ResponseType<any>> {

        const {url, data, method, notify = true} = requestOptions;

        const options: RequestInit = {
            ...requestOptions.ajaxOptions,
            method
        };

        let fullUrl;

        options.headers = {
            ...options.headers,
            Accept: "application/json",
            Authorization: localStorage.getItem("login_token")

        };

        if (!(data instanceof FormData)) {
            options.headers["Content-Type"] = "application/json";
        }

        fullUrl = this.getUrl(url);

        if (options.method === "GET") {
            const queryString = new URLSearchParams(JSON.parse(JSON.stringify(data)));
            fullUrl += `?${queryString}`;
        } else if (data instanceof FormData) {
            options.body = data;
        } else {
            options.body = JSON.stringify(data);
        }


        let res: ResponseType = {
            data: [],
            message: "",
            type: "error",
            status: null
        };

        try {
            const response = await fetch(fullUrl, options);

            if (response.status === 200) {
                res = await response.json();
                const {
                    status,
                    message = "We're facing some technical issue. Please try again after some time"
                } = res;
                const is_success = status === 200;
                if (notify && (method !== "GET" || !is_success)) {
                    this.notify({
                        message,
                        type: is_success ? "success" : "error",
                    });
                }
            } else {
                try {
                    res = await response.json();
                } finally {
                    throw {
                        message: res.message,
                        status: response.status
                    }
                }
            }
        } catch (e) {
            console.error(e);
            this.notify({
                message: e.message,
                type: "error",
            });
            throw e;
        }

        const {status} = res;

        if (status !== 200)
            throw res;

        return res;
    }

}

export const $crud = new CrudFactory();
$crud.config(chooseFile);