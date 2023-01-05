<template>
<div>
    <div class="container-fluid pt-4 bg-color">
		<div class="container">


				<h2 class="text-center mb-4">Последние работы</h2>


				<nav class="navbar">
					<div class="container-fluid pe-4">
						<!-- change the grid -->
						<div class="btn-group" role="group" aria-label="Basic radio toggle button group">

							<input type="radio" class="btn-check" name="btnradio" id="changeGrid1" autocomplete="off" checked>
							<label class="btn btn-outline-primary pt-2" for="changeGrid1">
                                <i class="fa-solid fa-border-all fs-4"></i>
                            </label>

							<input type="radio" class="btn-check" name="btnradio" id="changeGrid2" autocomplete="off">
							<label class="btn btn-outline-primary pt-2" for="changeGrid2">
                                <i class="fa-solid fa-bars fs-4"></i>
                            </label>

						</div>
						<nav aria-label="breadcrumb">
							<ol class="breadcrumb mt-2">
								<li class="breadcrumb-item">Сортировка</li>
								<li v-if="sorted=='sorted=most_viewed'" class="breadcrumb-item active nav-item dropdown" aria-current="page">
									<button class="btn btn-link nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
										Популярные
									</button>
                                    
									<ul class="dropdown-menu dropdown-menu-end dropdown-menu-xxl-start">
										<li><button @click.stop.prevent='sortNew()' class="btn btn-link dropdown-item rounded-0" href="#">Новые</button></li>
										<li><button @click.stop.prevent='sortMostLiked()' class="btn btn-link dropdown-item rounded-0" href="#">Наиболее понравившееся</button></li>
									</ul>
								</li>

                                <li v-else-if="sorted=='sorted=most_liked'" class="breadcrumb-item active nav-item dropdown" aria-current="page">
									<button class="btn btn-link nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
										Наиболее понравившееся
									</button>
                                    
									<ul class="dropdown-menu dropdown-menu-end dropdown-menu-xxl-start">
										<li><button @click.stop.prevent='sortNew()' class="btn btn-link dropdown-item rounded-0" href="#">Новые</button></li>
										<li><button @click.stop.prevent='sortPopular()' class="btn btn-link dropdown-item rounded-0" href="#">Популярные</button></li>
									</ul>
								</li>

                                <li v-else class="breadcrumb-item active nav-item dropdown" aria-current="page">
									<button class="btn btn-link nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
										Новые
									</button>
                                    
									<ul class="dropdown-menu dropdown-menu-end dropdown-menu-xxl-start">
										<li><button @click.stop.prevent='sortPopular()' class="btn btn-link dropdown-item rounded-0" href="#">Популярные</button></li>
										<li><button @click.stop.prevent='sortMostLiked()' class="btn btn-link dropdown-item rounded-0" href="#">Наиболее понравившееся</button></li>
									</ul>
								</li>
							</ol>
						</nav>
					</div>
				</nav>


				<div class="row row-cols-1 row-cols-xl-3 row-cols-md-2 g-5">
						<div class="col" v-for='post in posts'>
								<div class="card shadow-sm h-100 ">
										<div class="position-relative">
												<img :src="post.images['photos'][0]" class="card-img-top" alt="...">
												<button v-if='!is_liked(post)' @click.prevent='likePost(post, post.slug)' class="btn btn-link position-absolute top-0 end-0 p-0 me-1" data-bs-toggle="button">
													<img src="/img/icons/like-disabled.png" width="30" height="30" class="position-relative like" z-index="-1">
													
												</button>
												<button v-else @click.prevent='likePost(post, post.slug)' class="btn btn-link position-absolute top-0 end-0 p-0 me-1" data-bs-toggle="button">
													<img src="/img/icons/like.png" width="30" height="30" class="position-relative like">
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
												<nuxt-link :to="`/post_blog/${post.slug}`" class="btn btn-primary me-auto">Подробнее</nuxt-link>
												<small class="text-muted">{{ transformTime(post.created_at) }}</small>
											</div>

										</div>
								</div>
						</div>
                </div>



				<nav class='mt-4' aria-label="Page navigation">
					<ul class="pagination justify-content-center">
						<li class="page-item">
							<a class="page-link" href="#" aria-label="Previous">
								<span aria-hidden="true">&laquo;</span>
							</a>
						</li>
						<li class="page-item">
							<a class="page-link">&lt</a>
						</li>
						<li class="page-item"><a class="page-link" href="#">1</a></li>
						<li class="page-item active" aria-current="page">
							<a class="page-link" href="#">2</a>
						</li>
						<li class="page-item"><a class="page-link" href="#">3</a></li>
						<li class="page-item">
							<a class="page-link" href="#">&gt</a>
						</li>
						<li class="page-item">
							<a class="page-link" href="#" aria-label="Next">
								<span aria-hidden="true">&raquo;</span>
							</a>
						</li>
					</ul>
				</nav>


		</div>
        </div>
</div>
</template>

<script>
import axios from 'axios';
export default{
    props: ['posts', 'sorted', 'page_size'],
    data() {
        return{
            liked: false,
        }
    },
    methods: {
        async likePost(post, post_slug){
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
		},
		transformTime(time){
			let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
			let date = new Date(time)
			let datePlusUTC = date.toLocaleString('ru-RU', { timeZone: userTimezone })
			let dateWithoutYear =  datePlusUTC.substr(0, 5) + datePlusUTC.substr(10)
			return dateWithoutYear.substr(0, dateWithoutYear.length - 3)
			/* let timeForMoment = date.getFullYear() + '-' + date.getMonth() + '-' + date.getUTCDate()
			+ ' ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds()
			let hourMinSec = date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds()
			let fullTime = this.$moment('2020-01-01 00:00:01').tz(userTimezone)
			let resultDate = String(fullTime).split(' ')[4] */
		},
        sortPopular(){
            this.$router.push('/?' + 'sorted=most_viewed' + this.page_size)
        },
        sortMostLiked(){
            this.$router.push('/?' + 'sorted=most_liked' + this.page_size)
        },
        sortNew(){
            this.$router.push('/?' + 'sorted=new' + this.page_size)
        },
    },
	computed: {
		loggedIn(){
			return this.$auth.loggedIn
		},
		user(){
			return this.$auth.user
		},
	}
}
</script>

<style>

</style>