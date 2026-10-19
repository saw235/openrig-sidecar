import http from "node:http";
export interface SidecarServerOptions {
    port?: number;
    host?: string;
    daemonUrl?: string;
    bearerToken?: string;
}
export interface RunningSidecar {
    server: http.Server;
    url: string;
    port: number;
}
export declare function startSidecarServer(opts?: SidecarServerOptions): Promise<RunningSidecar>;
