export type UseCase<T> = {
  execute: () => T;
};

export type UseCaseWithParams<T, P> = {
  execute: (params: P) => T;
};
