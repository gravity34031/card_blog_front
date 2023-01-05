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
			page_path:null
		}
	},
	watchQuery: ['sorted', 'page'],
    async asyncData(ctx){
		/* queryset for posts */
		let query = ctx.route.query;
		let sorted = (query.sorted !== undefined) ? `sorted=${query.sorted}` : '';
		let page = (query.page !== undefined) ? `&page=${query.page}` : ''
		let page_size = (query.page_size !== undefined) ? `&page_size=${query.page_size}` : '';
		let query_params = '?' + sorted + (page?page:'&page=1') + page_size;
		let path = ctx.route.path + query_params

        let posts = await axios.get(`${process.env.baseUrl}/api/blog_posts/${query_params}`);
		let galleries = await axios.get(`${process.env.baseUrl}/api/gallery/`)
		//console.log(galleries)

		/* pagination */
		let next = '?' + sorted + (posts.data.next ? '&' + posts.data.next.split('?').pop().split('&')[0] : '') + page_size
		let previous = '?' + sorted + (posts.data.previous ? (posts.data.previous.includes('page=') ? '&' + posts.data.previous.split('?').pop().split('&')[0] : '&page=1') : '') + page_size
		let current_page = query.page ? query.page: '1'
		let total = Math.ceil(posts.data.count / (page_size ? page_size.split('=')[1] : 6))
		
		let page_path = ctx.route.path
		/* console.log(next)
		console.log(previous)
		console.log(current_page) */

		/* let new_posts = {}
		Object.assign(new_posts, posts)
		let i = 0
		for (let post of posts.data.results){
			let gallery_slug = post.images
			let photo_response = await axios.get(`${process.env.baseUrl}/api/gallery/${gallery_slug}`)
			let galleries = photo_response.data.galleries
			new_posts.data.results[i].images = galleries
			i++
		}
		console.log(new_posts.data.results) */


		return {
            posts: posts.data.results,
			galleries: galleries.data,

			next: next,
			previous: previous,
			current_page: Number(current_page),
			total: total,
			
			query_params: query_params,
			page: page,
			sorted: sorted,
			page_size: page_size,

			page_path: page_path,
        }
    },
	
}
</script>

<style scoped>

</style>