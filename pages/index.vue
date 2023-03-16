<template>
    <div>
        <Slider />
		<AllPostBlog :posts='posts' :galleries='galleries' :next='next' 
		:previous='previous' :current_page='current_page' :total='total' 
		:query_params='query_params' :page='page' 
		:sorted='sorted' :page_size='page_size' :page_path='page_path' />
    </div>
</template>

<script>
import axios from 'axios';
import Slider from '~/components/Slider';
import AllPostBlog from '~/components/AllPostBlog';
export default {
    components: {
        Slider,
		AllPostBlog,
    },
	data(){
		return{
			sorted : null,
			page_size : null,
			page: null,
			page_path:null,


            posts: [],
            galleries: [],
            next: '',
            previous: '',
            current_page: '',
            total: 0,

            query_params: '',
            page: '',
            sorted: '',
            page_size: '',
            page_path: '',
		}
	},
	watchQuery: ['sorted', 'page'],
    watch: {
      '$route.query': '$fetch'   // This runs $fetch, defined below
    },
    async fetch(){
		/* queryset for posts */
		let query = this.$nuxt.$route.query
		let sorted = (query.sorted !== undefined) ? `sorted=${query.sorted}` : '';
		let page = (query.page !== undefined) ? `&page=${query.page}` : ''
		let page_size = (query.page_size !== undefined) ? `&page_size=${query.page_size}` : '';
		let query_params = '?' + sorted + (page?page:'&page=1') + page_size;
		let path = this.$nuxt.$route.path + query_params

        let posts = await axios.get(`${process.env.baseUrl}/api/blog_posts/${query_params}`);
		let galleries = await axios.get(`${process.env.baseUrl}/api/gallery/`)

		/* pagination */
		let next = '?' + sorted + (posts.data.next ? '&' + posts.data.next.split('?').pop().split('&')[0] : '') + page_size
		let previous = '?' + sorted + (posts.data.previous ? (posts.data.previous.includes('page=') ? '&' + posts.data.previous.split('?').pop().split('&')[0] : '&page=1') : '') + page_size
		let current_page = query.page ? query.page: '1'
		let total = Math.ceil(posts.data.count / (page_size ? page_size.split('=')[1] : 6))
		
		let page_path = this.$nuxt.$route.path

        // return
        this.posts = posts.data.results
        this.galleries = galleries.data

        this.next = next
        this.previous = previous
        this.current_page = Number(current_page)
        this.total = total

        this.query_params = query_params
        this.page = page
        this.sorted = sorted
        this.page_size = page_size

        this.page_path = page_path

    },
	
}
</script>

<style scoped>

</style>