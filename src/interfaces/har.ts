export interface log {
    version: string;
    creator: HarCreator;
    entries: HarEntrie[];
    pages?: any;
}

export interface HarCreator {
    name: string;
    version: string;
}

export interface HarEntrie {
    startedDateTime: string;
    time: number;
    request: HarRequest;
    response: HarResponse;
    cache: any;
    timings: any;
    comment?: string;
    serverIPAddress?: string;
    connection?: string;
    pageref?: string;
}

export interface HarRequest {
    method: string;
    url: string;
    httpVersion: string;
    headers: NameValue[];
    queryString: NameValue[];
    cookies: any;
    headersSize: number;
    bodySize: number;
    settingEncodeUrl: boolean;
    postData?: PostData;
}

export interface HarResponse {
    status: number;
    statusText: string;
    httpVersion: string;
    headers: NameValue[];
    cookies: any;
    content: HarResponseContent;
    redirectURL: string;
    headersSize: number;
    bodySize: number;
}

export interface NameValue {
    name: string;
    value: string;
}

export interface PostData {
    mimeType?: string;
    text?: string;
    params?: NameValue[];
}

export interface HarResponseContent {
    size: string;
    mimeType: string;
    text: string;
    compression?: string;
    encoding?: string;
}

export interface Final {
    log: log;
}
