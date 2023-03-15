<template>
    <div>
        <Header :title='`${title?"# " + title:""}`' />


        <div class="container-fluid pt-4 bg-color">
		    <div class="container">

                <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb">
                    <ol class="breadcrumb breadcrumb-color rounded">
                        <li class="breadcrumb-item"><nuxt-link to='/'>Главная</nuxt-link></li>
                        <li class="breadcrumb-item"><nuxt-link to='/categories'>Категории</nuxt-link></li>
                        <li class="breadcrumb-item active" aria-current="page">{{title}}</li>
                    </ol>
                </nav>


                <div class='d-flex align-items-center mb-2'>
                    <nuxt-link v-if='userIsSuperuser' to='../delete_tags/' class='btn-link-hover text-decoration-none'>
                        <i class="fa-solid fa-wrench fs-5"></i>
                        <span class='h5 mb-0 ms-2'>Удалить категорию</span>
                    </nuxt-link>
                </div>


				<div class="all-tags">
					<p class="lead m-0 lh-1">Другие категории:</p>
					<button v-if='tag.slug != tag_slug' v-for='tag in tags' class="btn btn-link mt-1" type="button">
						<nuxt-link :to='`/categories/${tag.slug}`'><span class="badge text-bg-success">{{tag.name}}</span></nuxt-link>
					</button>
				</div>
                
                <div v-if='typeof posts == "object"'>
                    <AllPostBlog v-if='posts.length>0' :posts='posts' :galleries='galleries' :next='next' 
                    :previous='previous' :current_page='current_page' :total='total' 
                    :query_params='query_params' :page='page' :sorted='sorted' 
                    :page_size='page_size' :page_path='page_path' />
                    <div class='mt-3' v-else>
                        <span class='lead'>Постов с такой категорией нет</span>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios';
import Header from '~/components/Header';
import AllPostBlog from '~/components/AllPostBlog';
export default {
    components: {
        Header,
		AllPostBlog,
    },
	data(){
		return{
			sorted : null,
			page_size : null,
			page: null,
            page_path: null,
            title: '',

            posts: '',
            galleries: [],
            tags: [],

            next: '',
            previous: '',
            current_page: '',
            total: 0,

            query_params: '',
            tag_slug: ''
		}
	},
	watchQuery: ['sorted', 'page'],
    async fetch(){
        let route = this.$nuxt.$route
        /* queryset for posts */
        let tag_slug = route.params.slug
		let query = route.query;
		let sorted = (query.sorted !== undefined) ? `sorted=${query.sorted}` : '';
		let page = (query.page !== undefined) ? `&page=${query.page}` : ''
		let page_size = (query.page_size !== undefined) ? `&page_size=${query.page_size}` : '';
		let query_params = '?' + sorted + (page?page:'&page=1') + page_size;
		let path = route.path + query_params

        let posts = await axios.get(`${process.env.baseUrl}/api/tags/${tag_slug}${query_params}`);
		let galleries = await axios.get(`${process.env.baseUrl}/api/gallery/`)
        let tags = await axios.get(`${process.env.baseUrl}/api/tags`)

        /* pagination */
		let next = '?' + sorted + (posts.data.next ? '&' + posts.data.next.split('?').pop().split('&')[0] : '') + page_size
		let previous = '?' + sorted + (posts.data.previous ? (posts.data.previous.includes('page=') ? '&' + posts.data.previous.split('?').pop().split('&')[0] : '&page=1') : '') + page_size
		let current_page = query.page ? query.page: '1'
		let total = Math.ceil(posts.data.count / (page_size ? page_size.split('=')[1] : 6))

        let page_path = route.path


        // title
        let title = ''
        if (tags.data){
            for (let tag of tags.data){
                if (tag.slug == tag_slug){
                    title = tag.name
                }
            }
        }

        // return
        this.title = title

        this.posts = posts.data.results
        this.galleries = galleries.data
        this.tags = tags.data

        this.next = next
        this.previous = previous
        this.current_page = Number(current_page)
        this.total = total

        this.query_params = query_params
        this.page = page
        this.sorted = sorted
        this.page_size = page_size

        this.page_path = page_path
        this.tag_slug = tag_slug
    },
    computed: {
        user(){
            return this.$auth.user
        },
        userIsSuperuser(){
            if (this.user){
                return this.$auth.user.is_superuser
            }
        }
    }
}
</script>

<style scoped>

</style>