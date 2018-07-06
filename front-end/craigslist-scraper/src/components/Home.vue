<template>
    <div>
        <h1>Hi .... </h1>
        <h2>Enter Email</h2>
            <div>
                <input v-model='email' type="text" id='email'>
            </div>
        <h2>Enter City</h2>
            <div>
                <input v-model='city' type="text" id='city'>
            </div>
        <h2>Enter Search Term</h2>
            <div>
                <input v-model='searchTerm' type="text" id='searchTerm'>
                <button @click='sendEmail(city, searchTerm, email)' type="submit">Submit</button>
            </div>
    </div>
    

</template>


<script>

export default {
    props: [],
    data() {
        return {
            city: '',
            searchTerm: '',
            email: '',
            emails: []
        }
    },
    methods: {
        sendEmail (city, searchTerm, email) {
            this.emails.push(email)
            const URL = `http://localhost:5000/search/${city}/${searchTerm}/${email}`
            fetch(URL)
                .then(response => response.json())
                .then(result => {
                    console.log(result, this.emails)
                })
        }
    }
}
   
</script>


<style>

</style>
