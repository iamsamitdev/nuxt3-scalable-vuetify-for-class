<script setup lang="ts">
    
    definePageMeta({
        middleware: ["auth"]
    })

    // get token from cookie
    // const token = useCookie('token')

    // console.log(token.value)

    // sign out method
    const signOut = () => {

        // get token from cookie
        const token = useCookie('token')

        // remove token from cookie
        token.value = null

        // redirect to login page
        useRouter().push({path: '/'})
    }
   
</script>

<template>
    <div>
        <h1>Dashboard</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti consequatur porro reprehenderit adipisci natus aliquam error commodi fuga hic, dolorem sequi! Provident doloribus explicabo in reiciendis dolore, maiores corporis hic?</p>
        <v-btn outline color="primary" dark @click="signOut()">Log out</v-btn>
    </div>
</template>

<style scoped>

</style>