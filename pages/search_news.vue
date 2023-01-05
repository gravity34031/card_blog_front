<template>
    <div>
        <!-- HEADER -->
        <div id="carouselExampleSlidesOnly" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                <div class="carousel-item active main-header color">
                    <div class="carousel-caption pb-0">
                        <form class="d-flex flex-column" role="search">
                            <input v-model='search' class="form-control" type="search" placeholder="Введите запрос" aria-label="Search">
                            <div class="mt-2">
                                <button @click.stop.prevent='submit_search()' class="btn btn-outline-success" type="submit">Поиск</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>



        <div class="container-fluid pt-4 pb-2 bg-color">
            <div class="container">



                <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb">
                    <ol class="breadcrumb breadcrumb-color rounded">
                        <li class="breadcrumb-item"><nuxt-link to='/'>Главная</nuxt-link></li>
                        <li class="breadcrumb-item active" aria-current="page">Поиск по новостям</li>
                    </ol>
                </nav>
                
                
                
                <div class="text-center">
                    <h5>Поиск по</h5>
                    <div class="btn-group">
                        <nuxt-link to='/search' class="btn btn-primary" aria-current="page">Работам</nuxt-link>
                        <a class="btn btn-primary active">Новостям</a>
                    </div>
                </div>



                <span class='mt-4 lead text-break' v-if='querySearch'>По запросу: {{querySearch}}</span>
                <span class='mt-4 lead' v-else>По запросу: Все новости</span>
                <p class="lead mb-0">Найдено записей: {{count}}</p>

                <!-- POSTS -->
                <div v-if='posts.length > 0' class="container-fluid mb-2">
                    <div class="card px-2 py-3">
                        <ul v-for='post in posts' class="list-group list-group-flush">
                            <li class="list-group-item">
                                <h5 class="card-title">{{post.title}}</h5>
                                <p class="card-text">{{post.description}}</p>
                                <div class="d-flex justify-content-between">
                                    <small class="align-self-end">{{transformTime(post.created_at)}}</small>
                                    <nuxt-link :to='`/news/${post.slug}`' href="/post_detail_news.html" class="btn btn-secondary">Подробнее</nuxt-link>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
        

            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    watchQuery: ['search'],
    data(){
		return{
            search: '',
            querySearch: '',
		}
	},
    async asyncData(ctx){
		let query = ctx.route.query;
        let search = (query.search !== undefined) ? `?search=${encodeURIComponent(query.search)}` : ''
        let posts = await axios.get(`${process.env.baseUrl}/api/news_posts/${search}`);
		
        let querySearch = (query.search !== undefined) ? `${query.search}` : ''
        return {
            posts: posts.data.results,
            count: posts.data.count,
            querySearch: querySearch
        }
    },
    methods:{
        transformTime(time){
			let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
			let date = new Date(time)
			let datePlusUTC = date.toLocaleString('ru-RU', { timeZone: userTimezone })
			return datePlusUTC.substr(0, datePlusUTC.length - 3)
		},
        submit_search(){
            this.$router.push('/search_news?search=' + this.search)
        },

    },
}
</script>

<style scoped>

</style>