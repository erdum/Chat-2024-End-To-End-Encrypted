import { create } from 'zustand'

export const useStore = create((set) => ({
  selectedUser: null,
  isSidebarOpen: false,
  messages: [],

  setSidebarOpen: () => set((state) => ({ ...state, isSidebarOpen: true })),
  setSidebarClose: () => set((state) => ({ ...state, isSidebarOpen: false })),

  setSelectedUser: (user) => set((state) => ({ ...state, selectedUser: user })),

  setMessages: (messages) => set((state) => ({ ...state, messages })),
}));
