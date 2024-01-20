export default defineNuxtRouteMiddleware(async (to, from) => {
    
    // check local storage for token
    // const token = localStorage.getItem('token')

    // get token from cookie
    const token = useCookie('token')

    // console.log('token:', token.value)

    // if no token, redirect to login page
    if (!token.value) {
        return navigateTo('/')
    }

})
