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
            <div class="container ">



                <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb">
                    <ol class="breadcrumb breadcrumb-color rounded">
                        <li class="breadcrumb-item"><nuxt-link to='/'>Главная</nuxt-link></li>
                        <li class="breadcrumb-item active" aria-current="page">Поиск по работам</li>
                    </ol>
                </nav>
                
                
                
                <div class="text-center">
                    <h5>Поиск по</h5>
                    <div class="btn-group">
                        <a class="btn btn-primary active" aria-current="page">Работам</a>
                        <nuxt-link to='/search_news' class="btn btn-primary">Новостям</nuxt-link>
                    </div>
                </div>

                    <span class='mt-4 lead text-break' v-if='getQuerySearch'>По запросу: {{getQuerySearch}}</span>
                        <span class='mt-4 lead' v-else>
                            <span v-if='count!=null&& count==0'>По запросу: - </span>
                            <span v-else>По запросу: Все посты</span>
                        </span>
                <span class='mt-4 lead' v-else>По запросу: -</span>
                <p class="lead mb-0">Найдено записей: {{count}}</p>

        
                <!-- POSTS -->
                <div class="row row-cols-1 row-cols-xl-3 row-cols-md-2 g-5">
						<div class="col" v-for='post in posts' :key='post.id'>
								<div class="card shadow-sm h-100 ">
										<div class="position-relative">
												<button @click.prevent='likePost({post: post, user: user, refreshNuxt})' class="btn btn-link position-absolute top-0 end-0 p-0 me-1" data-bs-toggle="button">
													<img :id='`like${post.slug}`' :src='postIsLiked(post) ? likeImg : likeDisabledImg' width="30" height="30" class="position-relative like" z-index="-1" />
												</button>
												<img :src="chooseImage(post.images)" class="card-img-top" alt="..." />
										</div>
										<div class="card-body d-flex flex-column justify-content-between">
											
											<div class="">
													<h5 class="card-title">{{ post.title }}</h5>
													<p class="card-text">
														{{ post.description }}
													</p>
													<p class="mb-0 d-flex justify-content-center align-items-center">
														Цена: {{ post.price }} р.
													</p>
													<p class="mb-0 d-flex justify-content-center align-items-center">
														Код: {{ post.id }}
													</p>
											</div>

											<div class="mb-2 all-tags">
												<button class="btn btn-link" v-for='tag in post.tags'>
                                                    <nuxt-link :to='`/categories/${tag.slug}`'>
													    <span class="badge text-bg-success text-wrap">{{ tag.name }}</span>
                                                    </nuxt-link>
												</button>
											</div>
											
											<div class="d-flex justify-content-between align-items-center">
												<nuxt-link :to="`/blog/${post.slug}`" class="btn btn-primary me-auto">Подробнее</nuxt-link>
												<small class="text-muted ms-4 text-end">{{ transformTime(post.created_at) }}</small>
											</div>

										</div>
								</div>
						</div>
                </div>
        
                <!-- PAGINATION -->
                <nav v-if='posts && posts.length > 0' class='mt-4' aria-label="Page navigation">
					<ul class="pagination d-flex flex-wrap justify-content-center">
						<li :class='previous.includes("page=")?"page-item":"page-item disabled"'>
							<nuxt-link :to='`${page_url}${query_params.replace("page="+current_page, "page=1")}`' class="page-link" href="#" aria-label="Previous">
								<span aria-hidden="true">&laquo;</span>
							</nuxt-link>
						
						<li :class='previous.includes("page=")?"page-item":"page-item disabled"'>
							<nuxt-link :to='`${page_url}${previous}`' class="page-link">&lt</nuxt-link>
						</li>
						

						<li v-for='i in total' :class='(i==current_page)?"page-item active":"page-item"' aria-current="page">
							<nuxt-link :to='`${page_url}${query_params.replace("page="+current_page, "page="+i)}`' class="page-link" href="#">{{i}}</nuxt-link>
						</li>


						<li :class='next.includes("page=")?"page-item":"page-item disabled"'>
							<nuxt-link :to='`${page_url}${next}`' class="page-link" href="#">&gt</nuxt-link>
						</li>
						<li :class='next.includes("page=")?"page-item":"page-item disabled"'>
							<nuxt-link :to='`${page_url}${query_params.replace("page="+current_page, "page="+total)}`' class="page-link" href="#" aria-label="Next">
								<span aria-hidden="true">&raquo;</span>
							</nuxt-link>
						</li>
					</ul>
				</nav>

            
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import {mapState, mapActions} from 'vuex'; //like post
export default {
    watchQuery: ['page', 'search'],
    watch: {
        '$route.query': '$fetch'   // This runs $fetch, defined below
    },
    data(){
		return{
            search: '',
			page_size : null,
			page: null,
            page_url: '/search',


            query: '',

            posts : null,
            count : null,
            galleries : null,

            next : null,
            previous : null,
            current_page : null,
            total : null,
            query_params : '',



		}
	},
    mounted(){
        let query = this.$nuxt.$route.query.search
        this.query = query
    },
    async fetch(){
		//let query = this.$nuxt.$route.query;
        
        let query = this.query?this.query:this.$nuxt.$route.query.search

		let page = (this.$nuxt.$route.query.page !== undefined) ? `&page=${this.$nuxt.$route.query.page}` : ''
		let page_size = (this.$nuxt.$route.query.page_size !== undefined) ? `&page_size=${this.$nuxt.$route.query.page_size}` : '';
		let query_params = '?search=' + query + (page?page:'&page=1') + page_size;
        
        let posts = await axios.get(`${process.env.baseUrl}/api/blog_posts/${query_params}`);
		let galleries = await axios.get(`${process.env.baseUrl}/api/gallery/`)

		let next = '?search=' + query + (posts.data.next ? '&' + posts.data.next.split('?').pop().split('&')[0] : '') + page_size
		let previous = '?search=' + query + (posts.data.previous ? (posts.data.previous.includes('page=') ? '&' + posts.data.previous.split('?').pop().split('&')[0] : '&page=1') : '') + page_size
		let current_page = this.$nuxt.$route.query.page ? this.$nuxt.$route.query.page: '1'
		let total = Math.ceil(posts.data.count / (page_size ? page_size.split('=')[1] : 6))

        //return
        this.posts = posts.data.results
        this.count = posts.data.count
        this.galleries = galleries.data

        this.next = next
        this.previous = previous
        this.current_page = Number(current_page)
        this.total = total
        this.query_params = query_params
        this.page = page
        this.page_size = page_size


    },
    methods:{
        ...mapActions(['likePost', 'isPostLiked']), //like post
        refreshNuxt(){ //like post
			this.$nuxt.refresh()
		},
        postIsLiked(post){
            let flag = false
            for (let user of post.favourite){
                if ((this.user ? this.user.username: '') == user.username){
                    flag = true
                }
            }
            return flag
        },
        getImages(gallery_slug){
			for (let i of this.galleries){
				if(i.slug == gallery_slug){
					return i.photos
				}
			}
			return ''
		},
        chooseImage(images){
            const image = (function(dict, key){return (dict) ? dict[key] : ''})(this.getImages(images)[0], 'image')
            return image.split('.').slice(0, -1).join('.') + '_compressed.webp'
        },
        transformTime(time){
			let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
			let date = new Date(time)
			let datePlusUTC = date.toLocaleString('ru-RU', { timeZone: userTimezone })
			return datePlusUTC.substr(0, datePlusUTC.length - 3)
		},
        submit_search(){
            this.$router.push('/search?search=' + encodeURIComponent(this.search))
            
            let query = this.search
            this.query = query
            this.$nuxt.refresh()
        },
    },
    computed: {
        ...mapState(['likeImg', 'likeDisabledImg']), //like post
		loggedIn(){
			return this.$auth.loggedIn
		},
		user(){
			return this.$auth.user
		},
        getQuerySearch(){
            return this.$nuxt.$route.query.search
        }
	},
}
</script>

<style scoped>

</style>