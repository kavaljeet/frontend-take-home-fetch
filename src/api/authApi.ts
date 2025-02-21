import apiClient from "./apiClient";

//login user
export const loginUser = async ( name : string , email: string ) => {
    await apiClient.post("/auth/login" , {name , email})
}
//logout user 
export const logoutUser = async (): Promise<void> => {
    await apiClient.post("/auth/logout")
}