import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: {
            _id: "",
            name: "",
            email: "",
            role: "",
            photoUrl: "",
            description: "",
            enrolledCourses: [] // 🔥 IMPORTANT
        }
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload
        },
        logoutUser: (state) => {
            state.userData = {
                _id: "",
                name: "",
                email: "",
                role: "",
                photoUrl: "",
                description: "",
                enrolledCourses: []
            }
        }
    }
})

export const { setUserData, logoutUser } = userSlice.actions
export default userSlice.reducer