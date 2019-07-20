export type ListenerType = (prevData: any, nextData: any) => any;

export interface IPreserve {
  get: <T>() => T;
  set: <T>(data: T) => void;
  subscribe: (listener: ListenerType) => any;
  clearItem: () => void;
}
