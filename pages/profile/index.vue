<template>
    <div>
        <Header :title='title' />

        <div class="container-fluid bg-color">
        <div class="container pt-4 pb-4">


            <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb">
                <ol class="breadcrumb breadcrumb-color rounded">
                    <li class="breadcrumb-item"><nuxt-link to='/'>Главная</nuxt-link></li>
                    <li class="breadcrumb-item active">Профиль</li>
                </ol>
            </nav>


            <div class="card shadow">
                <div class="d-flex flex-column align-items-center mx-auto mt-3 text-wrap text-break px-3">  <!-- border border-3 border-secondary -->
                    <img :src="`${back_path}${user.avatar}`" class="rounded-circle" height="125px" width="125px" alt="Аватар">
                    <h5 v-if='!user.first_name && !user.last_name' class="mt-2">{{user.username}}</h5>
                    <h5 class="mt-2">{{user.first_name}} {{user.last_name}}</h5>
                </div>
                <div class="card-body d-flex flex-column ps-0 pe-0 pb-0">
                    <hr class="m-0">
                    <div class="d-grid">
                        <nuxt-link to='profile/settings' class="py-2 btn btn-light rounded-0 text-start">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                <i class="fa-solid fa-gear me-1"></i>
                                    Настройки профиля
                                </div>
                                <i class="fa-solid fa-angle-right text-secondary"></i>
                            </div>
                        </nuxt-link>
                    </div>
                    <hr class="m-0">

                    <div class="d-grid">
                    <nuxt-link to='profile/favourite' class="py-2 btn btn-light rounded-0 text-start">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                <i class="fa-regular fa-heart me-1"></i>
                                Избранное
                            </div>
                            <i class="fa-solid fa-angle-right text-secondary"></i>
                        </div>
                    </nuxt-link>
                    </div>
                    <div class="d-grid">
                        <nuxt-link to='profile/comments' class="py-2 btn btn-light rounded-0 text-start">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <i class="fa-regular fa-comment me-1"></i>
                                    Комментарии
                                </div>
                                <i class="fa-solid fa-angle-right text-secondary"></i>
                            </div>
                        </nuxt-link>
                    </div>
                    <div class="d-grid">
                        <nuxt-link to='profile/review' class="py-2 btn btn-light rounded-0 text-start">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <i class="fa-regular fa-star me-1"></i>
                                    Отзывы
                                </div>
                                <i class="fa-solid fa-angle-right text-secondary"></i>
                            </div>
                        </nuxt-link>
                    </div>
                    <hr class="m-0">
                    
                    <div class="d-grid">
                        <button @click='logout()' class="py-2 btn btn-light rounded-0 text-start">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <i class="fa-solid fa-arrow-right-from-bracket me-1"></i>
                                    Выйти
                                </div>
                                <i class="fa-solid fa-angle-right text-secondary"></i>
                            </div>
                        </button>
                    </div>
                </div>
        </div>


        </div>
        </div>
    </div>
</template>

<script>
import Header from '~/components/Header'
export default {
    components:{
        Header,
    },
    middleware: 'anonymRedirect',
    data() {
        return {
            title: null,
            back_path: null,
        }
    },
    created(){
        this.title = 'Профиль ' + this.user.username;
        this.back_path = process.env.baseUrl;
    },
    methods: {
        async logout(){
			await this.$auth.logout()
		},
    },
    computed: {
        user(){
            return this.$auth.user
        }
    }
}
</script>

<style scoped>

</style>