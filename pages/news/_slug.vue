<template>
<div>
    <Header :title='post.title' />


    <div class="container-fluid pt-4 pb-2 bg-color">
    <div class="container">
        <div class="row mb-2">
            

            <div class="col-lg-8 col-12">


                <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb">
                    <ol class="breadcrumb breadcrumb-color rounded">
                        <li class="breadcrumb-item"><nuxt-link to="/">Главная</nuxt-link></li>
                        <li class="breadcrumb-item"><nuxt-link to="/news">Новости</nuxt-link></li>
                        <li class="breadcrumb-item active" aria-current="page">{{post.h1}}</li>
                    </ol>
                </nav>


                <!-- EDIT & DEL -->
                <div v-if='isSuperUser' class='mb-2 d-flex align-items-between'>
                    <div class='w-100 d-flex align-items-center text-decoration-none'>
                        <nuxt-link :to='`/add_news_blog/${news_blog_slug}`' class='delUpdPost d-flex'>
                            <i class="fs-5 fa-solid fa-pen-to-square "></i>
                            <span class='h6 mb-0 ms-2'>Редактировать</span>
                        </nuxt-link>
                    </div>

                    <a class='d-flex align-items-center text-decoration-none' data-bs-toggle="modal" data-bs-target="#deletePostModal">
                        <span class='delUpdPost d-flex'>
                            <i class="fs-5 fa-solid fa-trash-can"></i>
                            <span class='h6 mb-0 ms-2'>Удалить</span>
                        </span>
                    </a>
                </div>
                


                <!-- MODAL DELETE POST -->


                <!-- Modal -->
                <div class="modal fade" id="deletePostModal" tabindex="-1" aria-labelledby="deletePostModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="deletePostModalLabel">Удаление работы</h1>
                            <button id='closeDeletePostModal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p class='mb-0'>Вы уверены, что хотите удалить работу?</p>
                            <p class='mb-0'>Действие нельзя будет отменить</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отменить</button>
                            <button @click.stop.prevent='deletePost()' type="button" class="btn btn-danger">Удалить</button>
                        </div>
                        </div>
                    </div>
                </div>


                <div class="detail-news">
                    <img v-show='imgIsLoaded' @load='checkImgIsLoaded()' :src="post.image" class="news-img" alt='...'>
                    <hr v-if='post.image'>      
                    <span v-html='post.content'></span>
                    <hr>
                    <small class="d-flex justify-content-end">Опубликовано: {{ transformTime(post.created_at) }}</small>
                </div>


                <Comments :news_blog_slug='news_blog_slug' :comments='comments' :user='user' />


            </div>


            <Aside :photosForAside='photosForAside' :news_blog_slug='news_blog_slug'/>


        </div>
    </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import {mapActions} from 'vuex';
import Header from '~/components/Header';
import Aside from '~/components/Aside';
import Comments from '~/components/Comments';
export default{
    components:{
        Header,
        Aside,
        Comments,
    },
    data(){
      return {
		news_blog_slug: null,
        imgIsLoaded: false
      }
    },
    async asyncData({params}){

		let news_blog_slug = params.slug

        let post = await axios.get(`${process.env.baseUrl}/api/news_posts/${params.slug}`)

        const photosForAside = await axios.get(`${process.env.baseUrl}/api/gallery/`)

        let comments = await axios.post(`${process.env.baseUrl}/api/get_comments/`, {
            slug: news_blog_slug,
            post: 'news'
        })
		//console.log(comments.data)
        return {
            post: post.data,
            comments: comments.data,
			photosForAside: photosForAside.data,
			news_blog_slug: news_blog_slug,
        }
    },
	mounted(){
		this.getAside()
	},
    methods:{
        checkImgIsLoaded(){
            this.imgIsLoaded = true
        },
        ...mapActions(['getAside']),
        async deletePost(){
            try{
                let slug = this.news_blog_slug

                let response = await this.$axios.delete(`${process.env.baseUrl}/api/news_posts/${slug}/`)
                console.log(response)

                
                const closeDeletePost = document.getElementById('closeDeletePostModal')
                closeDeletePost.click()
                this.$router.push('/news')
            } catch(err){
                console.log(err)
            }
        },
        transformTime(time){
			let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
			let date = new Date(time)
			let datePlusUTC = date.toLocaleString('ru-RU', { timeZone: userTimezone })
			return datePlusUTC.substr(0, datePlusUTC.length - 3)
		},
    },
    computed:{
        user(){
			return this.$auth.user
		},
        isSuperUser(){
            if (this.$auth.user) {
                return this.$auth.user.is_superuser
            } return false
        }
    },
}
</script>

<style scoped>

</style>