<template>
    <div>
        <Header :title='title' />


        <div class="container-fluid pt-3 pb-3 bg-color">
            <div class="container">

                <div class='d-flex align-items-center ms-3 mb-3'>
                    <nuxt-link v-if='userIsSuperuser' to='add_news_blog/' class='btn-link-hover text-decoration-none'>
                        <i class="fa-solid fa-plus fs-3"></i>
                        <span class='h5 mb-0 ms-2'>Добавить новость</span>
                    </nuxt-link>
                </div>

                <div v-if="typeof posts == 'object'">
                    <div v-if='posts.length > 0' class="container-fluid">
                        <div class="card px-2 py-3">
                            <ul v-for='post in posts' class="list-group list-group-flush">
                                <li class="list-group-item">
                                    <h5 class="card-title">{{post.title}}</h5>
                                    <p class="card-text">{{post.description}}</p>
                                    <div class="d-flex justify-content-between">
                                        <small class="align-self-end">{{transformTime(post.created_at)}}</small>
                                        <nuxt-link :to='`/news/${post.slug}`' class="btn btn-secondary">Подробнее</nuxt-link>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div v-else>
                        <span class='lead'>Новостей нет</span>
                    </div>
                </div>
                <div v-else class="d-flex justify-content-center">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>
                


            </div>
        </div>
    </div>
</template>

<script>
import Header from '~/components/Header';
import axios from 'axios';
export default {
    components: {
        Header
    },
    data(){
        return{
            title: 'Новости',
            posts: '',
        }
    },
    async fetch(){
        let {data} = await axios.get(`${process.env.baseUrl}/api/news_posts/`)
        this.posts = data.results
    },
    methods:{
        transformTime(time){
			let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
			let date = new Date(time)
			let datePlusUTC = date.toLocaleString('ru-RU', { timeZone: userTimezone })
			let dateWithoutYear =  datePlusUTC.substr(0, 5) + datePlusUTC.substr(10)
			return dateWithoutYear.substr(0, dateWithoutYear.length - 3)
		},
    },
    computed: {
        user(){
            return this.$auth.user
        },
        userIsSuperuser(){
            return this.user ? this.user.is_superuser : false 
        }
    }
}
</script>

<style scoped>

</style>