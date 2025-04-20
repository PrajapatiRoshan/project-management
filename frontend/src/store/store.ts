import { create, StateCreator } from 'zustand';
import createSelectors from './selectors';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type AuthState = {
  accessToken: string | null;
  user: null;
  setAccessToekn: (token: string) => void;
  clearAccessToekn: () => void;
};

const createAuthSlice: StateCreator<AuthState> = (set) => ({
  accessToken: null,
  user: null,
  setAccessToekn: (token) => set({ accessToken: token }),
  clearAccessToekn: () => set({ accessToken: null }),
});

type StoreType = AuthState;

export const useStoreBase = create<StoreType>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createAuthSlice(...a),
      })),
      {
        name: 'session-storage', // Name of the item in localStorage (or sessionStorage)
        getStorage: () => sessionStorage, // (optional) by default it's localStorage
      }
    )
  )
);

export const useStore = createSelectors(useStoreBase);

