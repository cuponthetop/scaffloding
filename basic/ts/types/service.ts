
export interface Controllable {
  name: string;
  from: Date;
  until: Date;
  range: string;
}

export interface Service {
  init(): Promise<boolean>;
  destroy(): Promise<boolean>;
  immediateCleanup(): boolean;
}

export interface SharableService extends Service {
  takeControl(requester: Controllable): Promise<boolean>;
}