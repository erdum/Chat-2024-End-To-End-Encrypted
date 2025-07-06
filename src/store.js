import { create } from 'zustand'

export const useStore = create((set) => ({
  selectedUser: null,
  isSidebarOpen: false,
  messages: {},

  setSidebarOpen: () => set((state) => ({ isSidebarOpen: true })),
  setSidebarClose: () => set((state) => ({ isSidebarOpen: false })),

  setSelectedUser: (user) => set((state) => ({ selectedUser: user })),

  addMessage: (userEmail, messagePayload) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [userEmail]: [
          ...(state.messages[userEmail] || []),
          messagePayload,
        ],
      },
    })),

  setMessages: (userEmail, messagesArray) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [userEmail]: messagesArray,
      },
    })),
}));
