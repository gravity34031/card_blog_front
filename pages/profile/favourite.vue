<template>
<div>

    <Header title='Избранное'/>


    <div class="container-fluid pt-4 pb-2 mb-2 bg-color">
        <div class="container">


            <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb">
                <ol class="breadcrumb breadcrumb-color rounded">
                    <li class="breadcrumb-item"><nuxt-link to='/'>Главная</nuxt-link></li>
                    <li class="breadcrumb-item"><nuxt-link to='/profile'>Профиль</nuxt-link></li>
                    <li class="breadcrumb-item active">Избранное</li>
                </ol> 
            </nav>



            <!-- OTHER REVIEWS -->
            <div v-if='typeof posts ==="object"'>
                <span v-if='!posts.length > 0' class='fs-5'>
                    Вы ещё не добавили в избранное ни одной работы.<br>
                    Вы можете это сделать на странице любой из <nuxt-link to='/categories/'>работ</nuxt-link>
                </span>
                <div v-else>
                    <p class="lead mb-0">Всего в избранном: {{posts.length}}</p>
                    <h2 class="mb-3 text-center">Избранные работы</h2>
                </div>
            </div>
            <div v-else class="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status">
                </div>
            </div>


            <!-- POSTS -->
            <div class="row row-cols-1 row-cols-xl-3 row-cols-md-2 g-5 mb-2">
                <div class="col" v-for='post in posts' :key='post.id'>
                    <div class="card shadow-sm h-100 ">

                        <div class="position-relative">
                                <img :src="(function(dict, key){return (dict) ? dict[key] : ''})(getImages(post.images)[0], 'image')" class="card-img-top" alt="...">
                                <button v-if='!(post.favourite.some(e => e.username == (user ? user.username : "")))' @click.prevent='likePost({post_slug: post.slug, refreshNuxt: refreshNuxt})' class="btn btn-link position-absolute top-0 end-0 p-0 me-1" data-bs-toggle="button">
                                    <img src="/img/icons/like-disabled.png" width="30" height="30" class="position-relative like" z-index="-1">
                                </button>
                                <button v-else @click.prevent='likePost({post_slug: post.slug, refreshNuxt: refreshNuxt})' class="btn btn-link position-absolute top-0 end-0 p-0 me-1" data-bs-toggle="button">
                                    <img src="/img/icons/like.png" width="30" height="30" class="position-relative like" z-index="-1">
                                </button>
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
                                    <nuxt-link :to='`/tags/${tag.slug}`'>
                                        <span class="badge text-bg-success">{{ tag.name }}</span>
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
        

        </div>
    </div>


</div>
</template>

<script>
import axios from 'axios';
import {mapState, mapActions} from 'vuex'; //like post
import Header from '~/components/Header';
import ReviewList from '~/components/ReviewList';
export default {
    components: {
        Header,
        ReviewList
    },
    middleware: 'anonymRedirect',
    data(){
        return{
            comments: '',
            posts: '',
            galleries: ''
        }
    },
    async fetch(){
        const comments = await this.$axios.get(`${process.env.baseUrl}/api/profile/comments/`)
        const posts = await this.$axios.get(`${process.env.baseUrl}/api/favourite/`)
        const galleries = await axios.get(`${process.env.baseUrl}/api/gallery/`)
        this.comments = comments.data
        this.posts = posts.data
        this.galleries = galleries.data

    },
    methods:{
        ...mapActions(['likePost', 'isPostLiked']), //like post
        refreshNuxt(){ //like post
			this.$nuxt.refresh()
		},
        transformTime(time){
			let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
			let date = new Date(time)
			let datePlusUTC = date.toLocaleString('ru-RU', { timeZone: userTimezone })
			return datePlusUTC.substr(0, datePlusUTC.length - 3)
		},
        getImages(gallery_slug){
			for (let i of this.galleries){
				if(i.slug == gallery_slug){
					return i.photos
				}
			}
			return ''
		},
    },
    computed: {
		...mapState(['postIsLiked']), //like post
		loggedIn(){
			return this.$auth.loggedIn
		},
		user(){
			return this.$auth.user
		},
	},
}
</script>

<style scoped>

</style>