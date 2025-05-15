import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import type { Connection, Message, Request, User } from "../@types/types";

interface GlobalState {
    user: User | null;
    feed: User[];
    requests: Request[];
    connections: Connection[];
    messages: Message[];

    addUser: (userData: User) => void;
    clearUser: () => void;

    addFeed: (feedData: User[]) => void;
    updateFeed: (userId: string) => void;
    clearFeed: () => void;

    addRequests: (requestData: Request[]) => void;
    updateRequests: (requestId: string) => void;
    clearRequests: () => void;

    addConnections: (connectionsData: Connection[]) => void;
    clearConnections: () => void;

    addMessages: (messagesData: Message[]) => void;
    updateMessages: (newMessage: Message) => void;
    clearMessages: () => void;
}

export const useGlobalStore = create<GlobalState>()(
    devtools(
        persist(
            (set) => ({
                // States
                user: null,
                feed: [],
                requests: [],
                connections: [],
                messages: [],

                // Actions
                addUser: (userData: User) => set({ user: userData }),
                clearUser: () => {
                    set({ user: null });
                    localStorage.removeItem("devtinder_userInfo");
                },

                addFeed: (feedData: User[]) => set({ feed: feedData }),
                updateFeed: (userId: string) => set((state) => ({ feed: state.feed.filter((user) => String(user._id) !== String(userId)) })),
                clearFeed: () => set({ feed: [] }),

                addRequests: (requestData: Request[]) => set({ requests: requestData }),
                updateRequests: (requestId: string) =>
                    set((state) => ({ requests: state.requests.filter((request) => String(request._id) !== String(requestId)) })),
                clearRequests: () => set({ requests: [] }),

                addConnections: (connectionsData: Connection[]) => set({ connections: connectionsData }),
                clearConnections: () => set({ connections: [] }),

                addMessages: (messagesData: Message[]) => set({ messages: messagesData }),
                updateMessages: (newMessage: Message) => set((state) => ({ messages: [...state.messages, newMessage] })),
                clearMessages: () => set({ messages: [] })
            }),
            {
                name: "devtinder_userInfo",
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({ user: state.user })
            }
        )
    )
);
