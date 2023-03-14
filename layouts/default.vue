<template>
<div>
    <div class='d-flex flex-column justify-content-between body_div'>
        <div>
        <client-only>
            <Navbar />
            <Nuxt />
        </client-only>
        </div>
    <Footer />
    </div>
</div>
</template>

<script>
import Navbar from '~/components/Navbar';
import Footer from '@/components/Footer';

export default {
    components: {
        Navbar,
        Footer,
    }
};
</script>

<style scoped>
.body_div{
    height: 100vh;
    background-color: #f7fbfd;
}
</style>