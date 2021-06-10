/// <reference types="node" />
import * as http from 'http';
import { Router } from '../targets/router';
export interface ServerOptions {
  port: number;
  hostname: string;
  development: boolean;
}
export interface Server {
  application: any;
  start(options?: Partial<ServerOptions>): Promise<http.Server>;
}
export declare const createServer: (router: Router, options?: Partial<ServerOptions>) => Server;
