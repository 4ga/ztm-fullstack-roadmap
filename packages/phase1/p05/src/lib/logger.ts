export type LogMeta = {
  requestId: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
};

export interface Logger {
  info: (meta: LogMeta) => void;
  error: (meta: Record<string, unknown>) => void;
}

export const logger: Logger = {
  info: (meta) => {
    console.log(JSON.stringify(meta));
  },
  error: (meta) => {
    console.error(JSON.stringify(meta));
  },
};
