<template>
<div>
    <div class="container-fluid pt-4 bg-color">
		<div class="container">
			

				<h2 class="text-center mb-4">Последние работы</h2>


				<nav class="navbar">
					<div class="container-fluid pe-4 d-block d-sm-flex">
						<!-- change the grid -->
						<!-- <div class="btn-group" role="group" aria-label="Basic radio toggle button group">

							<input type="radio" class="btn-check" name="btnradio" id="changeGrid1" autocomplete="off" checked>
							<label class="btn btn-outline-primary pt-2" for="changeGrid1">
                                <i class="fa-solid fa-border-all fs-4"></i>
                            </label>

							<input type="radio" class="btn-check" name="btnradio" id="changeGrid2" autocomplete="off">
							<label class="btn btn-outline-primary pt-2" for="changeGrid2">
                                <i class="fa-solid fa-bars fs-4"></i>
                            </label>

						</div> -->
                        <div class='d-flex align-items-center'>
                            <nuxt-link v-if='userIsSuperuser' to='add_post_blog/' class='btn-link-hover text-decoration-none'>
                                <i class="fa-solid fa-plus fs-3"></i>
                                <span class='h5 mb-0 ms-2'>Добавить работу</span>
                            </nuxt-link>
                        </div>
						<nav aria-label="breadcrumb">
							<ol class="breadcrumb mt-2 d-block d-sm-flex">
								<li class="breadcrumb-item">Сортировка</li>
								<li v-if="sorted=='sorted=most_viewed'" class="breadcrumb-item active nav-item dropdown" aria-current="page">
									<button class="btn btn-link nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
										Популярные
									</button>
                                    
									<ul class="dropdown-menu dropdown-menu-start dropdown-menu-sm-end">
										<li><button @click.stop.prevent='sortPosts("new")' class="btn btn-link dropdown-item rounded-0" href="#">Новые</button></li>
										<li><button @click.stop.prevent='sortPosts("most_liked")' class="btn btn-link dropdown-item rounded-0" href="#">Наиболее понравившееся</button></li>
									</ul>
								</li>

                                <li v-else-if="sorted=='sorted=most_liked'" class="breadcrumb-item active nav-item dropdown" aria-current="page">
									<button class="btn btn-link nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
										Наиболее понравившееся
									</button>
                                    
									<ul class="dropdown-menu dropdown-menu-start dropdown-menu-sm-end">
										<li><button @click.stop.prevent='sortPosts("new")' class="btn btn-link dropdown-item rounded-0" href="#">Новые</button></li>
										<li><button @click.stop.prevent='sortPosts("most_viewed")' class="btn btn-link dropdown-item rounded-0" href="#">Популярные</button></li>
									</ul>
								</li>

                                <li v-else class="breadcrumb-item active nav-item dropdown" aria-current="page">
									<button class="btn btn-link nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
										Новые
									</button>
                                    
									<ul class="dropdown-menu dropdown-menu-start dropdown-menu-sm-end">
										<li><button @click.stop.prevent='sortPosts("most_viewed")' class="btn btn-link dropdown-item rounded-0" href="#">Популярные</button></li>
										<li><button @click.stop.prevent='sortPosts("most_liked")' class="btn btn-link dropdown-item rounded-0" href="#">Наиболее понравившееся</button></li>
									</ul>
								</li>
							</ol>
						</nav>
					</div>
				</nav>


				<div class="row row-cols-1 row-cols-xl-3 row-cols-md-2 g-5">
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



				<nav class='mt-4' aria-label="Page navigation">
					<ul class="pagination d-flex flex-wrap justify-content-center">
						<li :class='previous.includes("page=")?"page-item":"page-item disabled"'>
							<nuxt-link :to='`${page_path}${query_params.replace("page="+current_page, "page=1")}`' class="page-link" href="#" aria-label="Previous">
								<span aria-hidden="true">&laquo;</span>
							</nuxt-link>
						
						<li :class='previous.includes("page=")?"page-item":"page-item disabled"'>
							<nuxt-link :to='`${page_path}${previous}`' class="page-link">&lt</nuxt-link>
						</li>
						

						<li v-for='i in total' :class='(i==current_page)?"page-item active":"page-item"' aria-current="page">
							<nuxt-link :to='`${page_path}${query_params.replace("page="+current_page, "page="+i)}`' class="page-link" href="#">{{i}}</nuxt-link>
						</li>


						<li :class='next.includes("page=")?"page-item":"page-item disabled"'>
							<nuxt-link :to='`${page_path}${next}`' class="page-link" href="#">&gt</nuxt-link>
						</li>
						<li :class='next.includes("page=")?"page-item":"page-item disabled"'>
							<nuxt-link :to='`${page_path}${query_params.replace("page="+current_page, "page="+total)}`' class="page-link" href="#" aria-label="Next">
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
export default{
    props: [
		'posts', 'galleries', 'next', 'previous', 'current_page', 
		'total', 'query_params', 'page', 'sorted', 'page_size', 
		'page_path'
	],
	methods: {
		...mapActions(['likePost', 'isPostLiked']), //like post
		refreshNuxt(){ //like post
			this.$nuxt.refresh()
		},
		/* test(favourite){
			let names = ''
			for (let name of favourite){
				names = names + name.username + ' '
			}
			return names
		}, */
		/* isPostLiked(post){
			const favourite = post.favourite;
			const username = this.$auth.user.username
			let liked = false;
			for (let i of favourite){
				if (username == i.username){
					liked = true;
				}
			}
			this.$nuxt.refresh()
			console.log(liked)
			return liked
		}, */
		getImages(gallery_slug){
			for (let i of this.galleries){
				if(i.slug == gallery_slug){
					return i.photos
				}
			}
			return ''
		},
		transformTime(time){
			let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
			let date = new Date(time)
			let datePlusUTC = date.toLocaleString('ru-RU', { timeZone: userTimezone })
			return datePlusUTC.substr(0, datePlusUTC.length - 3)
			//let dateWithoutYear =  datePlusUTC.substr(0, 5) + datePlusUTC.substr(10)
			//return dateWithoutYear.substr(0, dateWithoutYear.length - 3)
			/* let timeForMoment = date.getFullYear() + '-' + date.getMonth() + '-' + date.getUTCDate()
			+ ' ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds()
			let hourMinSec = date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds()
			let fullTime = this.$moment('2020-01-01 00:00:01').tz(userTimezone)
			let resultDate = String(fullTime).split(' ')[4] */
		},
		sortPosts(query){
			this.$router.push(`${this.page_path}?` + `sorted=${query}` + this.page + this.page_size)
		}
        /* sortPopular(){
            this.$router.push(`${this.page_path}?` + 'sorted=most_viewed' + this.page + this.page_size)
        },
        sortMostLiked(){
            this.$router.push(`${this.page_path}?` + 'sorted=most_liked' + this.page + this.page_size)
        },
        sortNew(){
            this.$router.push(`${this.page_path}?` + 'sorted=new' + this.page + this.page_size)
        }, */
		/* async test(){
			function sleep(ms) {
    			return new Promise(resolve => setTimeout(resolve, ms));
			}
			await sleep(500)
			this.$nuxt.refresh()
		}, */
    },
	computed: {
		...mapState(['postIsLiked']), //like post
		loggedIn(){
			return this.$auth.loggedIn
		},
		user(){
			return this.$auth.user
		},
        userIsSuperuser(){
            return this.user ? this.user.is_superuser : false 
        }
	},
}
</script>

<style>

</style>




<!-- async likePost(post, post_slug){
			this.liked = this.is_liked(post)
			//console.log(this.is_liked(post))
			for(let favourite of post.favourite){
				if (favourite.username == this.$auth.user.username){
					this.liked = true
				}
			}
			try {
				let data = {'slug': post_slug};
				if (!this.liked){
					let response = await this.$axios.post(`${process.env.baseUrl}/api/favourite/`, data);
					this.liked = true;
				} else {
					let response = await this.$axios.delete(`${process.env.baseUrl}/api/favourite/`, {data});
					this.liked = false;
				}
				//console.log(response)
				await this.$nuxt.refresh()
			}
			catch(err){
				this.liked = false;
			}
        },
		is_liked(post){
			let users = []
			for(let i of post.favourite){
				users.push(i.username)
			}
			if (this.$auth.user){
				return users.includes(this.$auth.user.username)
			}
			return false
		}, -->