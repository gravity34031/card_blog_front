<template>

            <div class="col-lg-4 col-12">


                <div class="card">
                    <h5 class="card-header">Категории</h5>
                    <div class="card-body">
                        <div class="row row-cols-1 row-cols-sm-3 row-cols-lg-2 g-2 mb-2">
                            <div v-for='tag in tags[0]' class="col">
                                <div class="card border-0 h-100">
                                    <nuxt-link :to='`../categories/${tag.slug}`' class="lh-1 h-100 text-decoration-none">
                                        <div class="bg-success text-white rounded-1 p-1 ps-2 pb-2 text-break text-wrap h-100 d-flex align-items-center">
                                            {{tag.name}}
                                        </div>
                                    </nuxt-link>
                                </div>
                            </div>
                        </div>
                        
                        <button id='showMoreTags' @click='showMoreTags()' class="btn btn-light w-100">
                            Показать все
                        </button>
                        
                        <div class="row row-cols-1 row-cols-sm-3 row-cols-lg-2 g-2 d-none" id='secondPartOfTags'>
                            <div v-for='tag in tags[1]' class="col">
                                <div class="card border-0 h-100">
                                    <nuxt-link :to='`../categories/${tag.slug}`' class="lh-1 h-100 text-decoration-none">
                                        <div class="bg-success text-white rounded-1 p-1 ps-2 pb-2 text-break text-wrap h-100 d-flex align-items-center">
                                            {{tag.name}}
                                        </div>
                                    </nuxt-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="card mt-3">
                    <h5 class="card-header">Последние работы</h5>
                    <ul class="list-group list-group-flush">
                        <li v-for='post in asideBlog' v-if='post.slug!=post_blog_slug' class="list-group-item">
                            <h5 class="card-title">{{post.title}}</h5>
                            <p class="card-text">{{post.description}}</p>
                            <img :src="`${getImages(post.images)[0].image}`" class="card-img-top aside-img rounded">
                            <div class="mt-3 mx-auto d-lg-flex d-grid col-12 col-sm-9 col-md-6 col-lg-12 flex-row-reverse">
                                <nuxt-link :to='`../blog/${post.slug}`' class="btn btn-secondary btn-sm">Перейти</nuxt-link>
                            </div>
                        </li>
                    </ul>
                </div>


                <div class="card mt-3">
                    <h5 class="card-header">Последние новости</h5>
                    <ul class="list-group list-group-flush">
                        <li v-for='post in asideNews' v-if='post.slug!=news_blog_slug' class="list-group-item">
                            <h5 class="card-title">{{post.title}}</h5>
                            <p class="card-text">{{post.description}}</p>
                            <div class="mt-2 mx-auto d-lg-flex d-grid col-12 col-sm-9 col-md-6 col-lg-12 flex-row-reverse">
                                <nuxt-link :to='`../news/${post.slug}`' class="btn btn-light btn-sm">Перейти</nuxt-link>
                            </div>
                        </li>
                    </ul>
                </div>


            </div>

</template>

<script>
import {mapGetters, mapActions} from 'vuex';
export default{
    props:['photosForAside', 'post_blog_slug', 'news_blog_slug'],
    computed:{
        ...mapGetters(['tags', 'asideBlog', 'asideNews']),
    },
    methods:{
        showMoreTags(){
            const btn = document.getElementById('showMoreTags')
            const tags = document.getElementById('secondPartOfTags')
            btn.classList.add("d-none")
            tags.classList.remove("d-none")
        },
        getImages(gallery_slug){
            for (let i of this.photosForAside){
                if(i.slug == gallery_slug){
                    return i.photos
                }
            }
            return ''
        },
    }
}
</script>

<style scoped>
    
</style>






<!-- data(){
        return{
            tags: [],
            asideBlog: null,
            asideNews: null
        }
    },
    async created(){
        const tags = await this.$axios.get(`${process.env.baseUrl}/api/tags/`)
        const asideBlog = await this.$axios.get(`${process.env.baseUrl}/api/aside-blog/`)
        const asideNews = await this.$axios.get(`${process.env.baseUrl}/api/aside-news/`)
        this.tags[0] = tags.data.slice(0, 6)
        this.tags[1] = tags.data.slice(6)

        this.asideBlog = asideBlog.data
        this.asideNews = asideNews.data
        return {
            asideBlog: asideBlog.data,
            asideNews: asideNews.data
        }
    }, -->