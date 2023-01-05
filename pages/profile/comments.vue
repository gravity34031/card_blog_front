<template>
<div>

    <Header title='Комментарии'/>


    <div class="container-fluid pt-4 pb-2 mb-2 bg-color">
        <div class="container">


            <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb">
                <ol class="breadcrumb breadcrumb-color rounded">
                    <li class="breadcrumb-item"><nuxt-link to='/'>Главная</nuxt-link></li>
                    <li class="breadcrumb-item"><nuxt-link to='/profile'>Профиль</nuxt-link></li>
                    <li class="breadcrumb-item active">Комментарии</li>
                </ol> 
            </nav>



            <!-- OTHER REVIEWS -->
            <div v-if='typeof comments ==="object"'>
                <span v-if='!comments.length > 0' class='fs-5'>
                    Вы ещё не написали ни одного комментария.<br>
                    Вы можете это сделать на странице любой из <nuxt-link to='/categories/'>работ</nuxt-link> или <nuxt-link to='/news'>новостей</nuxt-link>
                </span>
                <div v-else>
                    <p class="lead mb-3">Всего комментариев: {{comments.length}}</p>
                </div>
            </div>
            <div v-else class="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status">
                </div>
            </div>

            <div v-if='comments.length > 0'>
                <div v-for='i of comments.keys()'>
                    <!-- postBlogHeader -->
                    <div v-if='commentsWithPostBlogOnly.length > 0'>
                        <h2 v-if='comments[i] == comments[0]' class='text-center'><hr class='mb-2 mt-0'>Работы<hr class='mb-0 mt-2'></h2>
                        <div v-if='comments[i].post_blog && (comments[i].post_blog.id != comments[Math.max(0, i-1)].post_blog.id || comments[i] == comments[0])' class="d-flex align-items-center mt-4">
                            <h4 class='mb-0'><nuxt-link :to='`/blog/${comments[i].post_blog.slug}`' class='text-decoration-none'>
                                {{comments[i].post_blog.title}}
                            </nuxt-link></h4>
                            <p class="ms-3 mb-0">Код товара: {{comments[i].post_blog.id}}</p>
                        </div>
                    </div>

                    <!-- postNewsHeader -->
                    <div v-if='commentsWithPostNewsOnly.length > 0'>
                        <h2 v-if='comments[i] == comments[commentsWithPostBlogOnly.length]' class='text-center'><hr class='mb-2 mt-5'>Новости<hr class='mb-0 mt-2'></h2>
                        <div v-if='comments[i].post_news && (comments[i].post_news.id != comments[Math.max(commentsWithPostBlogOnly.length, i-1)].post_news.id || comments[i] == comments[commentsWithPostBlogOnly.length])' class="d-flex align-items-center mt-4">
                            <h4 class='mb-0'><nuxt-link :to='`/news/${comments[i].post_news.slug}`' class='text-decoration-none'>
                                {{comments[i].post_news.title}}
                            </nuxt-link></h4>
                            <p class="ms-3 mb-0">Код товара: {{comments[i].post_news.id}}</p>
                        </div>
                    </div>

                    <!-- comment -->
                    <div class="mt-2 border rounded-4 bg-white px-3 py-2">
                        <div class='text-wrap text-break'>
                            <div class='mb-2 d-flex align-items-center'>
                                <img :src="`${comments[i].author.avatar}`" class="me-3 border rounded-circle d-sm-block" height="45px" width="45px" alt="Аватар">
                                <div class='d-block d-sm-flex justify-content-between w-100'>
                                    <div>
                                        <h5 class='mb-0 text-wrap text-break'>{{comments[i].author.username}}</h5>
                                        <small class='lh-1 text-wrap text-break'>{{comments[i].author.first_name}} {{comments[i].author.last_name}}</small>
                                    </div>
                                    <small>{{transformTime(comments[i].created_at)}}</small>
                                </div>
                            </div>
                            <span class=''>
                                <span style='white-space: pre-line'>{{sliceComment(comments[i].content)[0]}}<span :id='`comment${comments[i].id}`' class='d-none'>{{sliceComment(comments[i].content)[1]}}</span></span>
                                <p v-if='sliceComment(comments[i].content)[1]'>
                                    <a :id='`link${comments[i].id}`' @click='showFullComment(comments[i].id)' class="comment-link">
                                        Показать полностью
                                    </a>
                                </p>
                            </span>
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
import Header from '~/components/Header';
export default {
    components: {
        Header,
    },
    middleware: 'anonymRedirect',
    data(){
        return{
            comments: '',
            commentsWithPostBlogOnly: '',
            commentsWithPostNewsOnly: '',
        }
    },
    async fetch(){
        const comments = await this.$axios.get(`${process.env.baseUrl}/api/profile/comments/`)

        let commentsWithPostBlogOnly = []
        let commentsWithPostNewsOnly = []
        for (let i in comments.data){
            if (comments.data[i].post_blog){
                commentsWithPostBlogOnly.push(comments.data[i])
            }
            if (comments.data[i].post_news){
                commentsWithPostNewsOnly.push(comments.data[i])
            }
        }

        this.comments = comments.data
        this.commentsWithPostBlogOnly = commentsWithPostBlogOnly
        this.commentsWithPostNewsOnly = commentsWithPostNewsOnly
    },
    methods:{
        transformTime(time){
			let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
			let date = new Date(time)
			let datePlusUTC = date.toLocaleString('ru-RU', { timeZone: userTimezone })
			return datePlusUTC.substr(0, datePlusUTC.length - 3)
		},
        sliceComment(text){
            let textArray = []
            textArray[0] = text.slice(0, 300)
            textArray[1] = text.slice(300)
            textArray[0] = textArray[0]
            return textArray
        },
        showFullComment(id){
            const commentId = 'comment'+ id
            const linkId = 'link' + id
            const comment = document.getElementById(commentId)
            const link = document.getElementById(linkId)
            comment.className = 'd-inline'
            link.className = 'd-none'
        }
    }
}
</script>

<style scoped>

</style>