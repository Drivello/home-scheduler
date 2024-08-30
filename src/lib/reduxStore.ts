import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/core/entities/user";

interface UserState {
    user: User | null;
}

const initialState: UserState = {
    user: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state: UserState, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        clearUser(state: UserState) {
            state.user = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
