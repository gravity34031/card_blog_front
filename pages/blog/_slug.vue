<template>
<div>
    <Header :title='post.h1' />


    <div class="container-fluid pt-4 pb-2 bg-color">
    <div class="container">
        <div class="row mb-2">
            

            <div class="col-lg-8 col-12">


                <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb">
                    <ol class="breadcrumb breadcrumb-color rounded">
                        <li class="breadcrumb-item"><nuxt-link to="/">Главная</nuxt-link></li>
                        <li class="breadcrumb-item active" aria-current="page">{{post.title}}</li>
                    </ol>
                </nav>



                <!-- EDIT & DEL -->
                <div v-if='isSuperUser' class='mb-2 d-flex align-items-between'>
                    <div class='w-100 d-flex align-items-center text-decoration-none'>
                        <nuxt-link :to='`/add_post_blog/${post_blog_slug}`' class='delUpdPost d-flex'>
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


                <div id="carouselPostBlog" class="carousel slide" data-bs-ride="carousel">
                    <!-- <div class="carousel-indicators">
                      <button class="active" type="button" data-bs-target="#carouselPostBlog"></button>
                      <button v-for='i in post.images' type="button" data-bs-target="#carouselPostBlog"></button>
                    </div> -->
                    <div v-if='post.images && post.images.length > 1' class="carousel-indicators">
                      <button v-for='i in post.images' type="button" data-bs-target="#carouselPostBlog" :data-bs-slide-to="`${post.images.indexOf(i)}`" :class="`${post.images.indexOf(i)==0?'active':''}`"></button>
                    </div>

                    <div class="carousel-inner rounded">
                      <div v-for='photo in post.images' :class="photo==post.images[0]?'carousel-item active':'carousel-item'">
                        <img :src="getCompressedImage(photo.image)" class="d-block w-100 post-carousel-item-img" alt="...">
                      </div>
                      
                    </div>
                    <button v-if='post.images && post.images.length > 1' class="carousel-control-prev" type="button" data-bs-target="#carouselPostBlog" data-bs-slide="prev">
                      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Previous</span>
                    </button>
                    <button v-if='post.images && post.images.length > 1' class="carousel-control-next" type="button" data-bs-target="#carouselPostBlog" data-bs-slide="next">
                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Next</span>
                    </button>
                </div>
                <hr>

                <div v-if='typeof post == "object"'>
                    <h4 class="d-flex justify-content-center align-items-center">
                        <i class="fa-solid fa-coins me-2"></i>
                        Цена: {{post.price}} р.
                        
                    </h4>
                    <h6 class="d-flex justify-content-center align-items-center">
                        <i class="fa-solid fa-key me-2"></i>
                        Код товара: {{post.id}}
                        
                    </h6>


                    <hr>
                    <span style='white-space:pre-line' v-html='post.content'></span>
                    <hr>
                    <small class="d-flex justify-content-end">Опубликовано: {{ transformTime(post.created_at) }}</small>
                </div>

                
                <div class="mt-3 d-flex justify-content-between align-items">   
                
                <a v-if='user' class="nav-link pt-0" >
                    <button @click='setErrorsOnNull()' type="button" class="btn btn-warning text-dark" data-bs-toggle="modal" data-bs-target="#ReviewBackdrop">
                        Оставить отзыв
                    </button>
                    <!-- Modal -->
                    <div class="modal fade" id="ReviewBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="#ReviewBackdropLabel" aria-hidden="true">
                      <div class="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h1 class="modal-title fs-5" id="ReviewBackdropLabel">Отзыв</h1>
                            <button id='closeReview' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <Error :error='error'/>
                          <div class="modal-body">
                            <!-- REVIEW FORM -->
                            <form >
                                <h2 class="text-center">Оставьте отзыв здесь</h2>
                                <div class="form-floating mt-3 mx-2">
                                    <input v-model='review.first_name' @change='$v.review.first_name.$touch()' :class="'form-control' + ($v.review.first_name.$invalid&&$v.review.first_name.$dirty?' is-invalid':' ')" type="text" id="reviewName" placeholder="Ваше имя">
                                    <label for="reviewName">Имя</label>
                                    <div class='invalid-feedback'>
                                        <span v-if='!$v.review.first_name.required'>
                                            {{validationMessages.requiredMessage}}
                                        </span>
                                        <span v-if='!$v.review.first_name.maxLength'>
                                            {{validationMessages.maxLengthMessage}} {{$v.review.first_name.$params.maxLength.max}}
                                        </span>
                                    </div>
                                </div>
                                <div class="form-floating mt-3 mx-2">
                                    <input v-model='review.email' @change='$v.review.email.$touch()' :class="'form-control' + ($v.review.email.$invalid&&$v.review.email.$dirty?' is-invalid':' ')" type="email" id="reviewEmail" placeholder="Ваша почта">
                                    <label for="reviewEmail">Электронная почта</label>
                                    <div class='invalid-feedback'>
                                        <span v-if='!$v.review.email.email'>
                                            {{validationMessages.emailMessage}}
                                        </span>
                                        <span v-if='!$v.review.email.required'>
                                            {{validationMessages.requiredMessage}}
                                        </span>
                                        <span v-if='!$v.review.email.maxLength'>
                                            {{validationMessages.maxLengthMessage}} {{$v.review.email.$params.maxLength.max}}
                                        </span>
                                    </div>
                                </div>
                                <div class="row mt-3 mx-2 form-floating">
                                    <textarea v-model='review.comment' @change='$v.review.comment.$touch()' :class="'form-control' + ($v.review.comment.$invalid&&$v.review.comment.$dirty?' is-invalid':' ')" id="reviewComment" style="height:100px" placeholder="Оставьте отзыв"></textarea>
                                    <label for="reviewComment" class="form-label">Комментарий к отзыву</label>
                                    <div class='invalid-feedback'>
                                        <span v-if='!$v.review.comment.required'>
                                            {{validationMessages.requiredMessage}}
                                        </span>
                                    </div>
                                </div>
                                <div class="form-check mx-2 mt-2">
                                    <input v-model='review.is_anonymous' class='form-check-input' type="checkbox" value="" id="anonymousReview">
                                    <label class="form-check-label" for="anonymousReview">
                                        Анонимный отзыв
                                    </label>
                                </div>
                                <h5 class="mt-3 text-center">Поставьте оценку:</h5>

                                
                                <!-- RATING -->
                                <div class="container-wrapper">  
                                    <div class="container d-flex align-items-center justify-content-center">
                                      <div class="row justify-content-center">    
                                        <client-only>
                                        <form>
                                        <!-- star rating -->
                                        <div class="rating-wrapper d-flex flex-row-reverse">

                                          <!-- star 5 -->
                                          <input v-model='review.grade' type="radio" id="5-star-rating" name="star-rating" value="5">
                                          <label for="5-star-rating" class="star-rating">
                                            <i class="fa fa-star-o d-flex align-items-center" aria-hidden="true"></i>
                                          </label>
                                          
                                           <!-- star 4 -->
                                          <input v-model='review.grade' type="radio" id="4-star-rating" name="star-rating" value="4">
                                          <label for="4-star-rating" class="star-rating star">
                                            <i class="fa fa-star-o d-flex align-items-center" aria-hidden="true"></i>
                                          </label>
                                          
                                           <!-- star 3 -->
                                          <input v-model='review.grade' type="radio" id="3-star-rating" name="star-rating" value="3">
                                          <label for="3-star-rating" class="star-rating star">
                                            <i class="fa fa-star-o d-flex align-items-center" aria-hidden="true"></i>
                                          </label>
                                          
                                          <!-- star 2 -->
                                          <input v-model='review.grade' type="radio" id="2-star-rating" name="star-rating" value="2">
                                          <label for="2-star-rating" class="star-rating star">
                                            <i class="fa fa-star-o d-flex align-items-center" aria-hidden="true"></i>
                                          </label>
                                          
                                          <!-- star 1 -->
                                          <input v-model='review.grade' type="radio" id="1-star-rating" name="star-rating" value="1">
                                          <label for="1-star-rating" class="star-rating star">
                                            <i class="fa fa-star-o d-flex align-items-center" aria-hidden="true"></i>
                                          </label>
                                         </div>
                                        </form>
										</client-only>

                                      </div>
                                    </div>
                                  </div>



                                <div class="row mt-3 mx-2">
                                    <button @click.stop.prevent='addReview()' :disabled='reviewIsInvalid' type="submit" class="btn btn-primary btn-lg">Отправить</button>
									
                                </div>

                            </form>
							
                            <!--  -->
                          </div>
                  
                        </div>
                      </div>
                    </div>

					
					<!-- SECOND MODAL WINDOW -->
					<button id='ButtonReviewSuccess' type="button" class="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#reviewSuccess">
						Успех
					</button>

					<!-- Modal -->
					<div class="modal fade" id="reviewSuccess" tabindex="-1" aria-labelledby="reviewSuccessLabel" aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
							<div class="modal-content">
							<div class="modal-header">
								<h1 class="modal-title fs-5" id="reviewSuccessLabel">Отзыв</h1>
								<button id='closeReviewSuccess' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div class="modal-body">
								<p class='fs-5 mb-0'>Отзыв успешно оставлен!</p>
                				<p class='fs-5 mb-0 lh-sm'>Вы можете посмотреть свой отзыв <button @click='closeReview()' class='btn btn-link fs-5 p-0 pb-1'>в своем профиле</button></p>
								<small class="text-muted">Для закрытия нажмите в любой части экрана или на крестик.</small>
							</div>

							</div>
						</div>
					</div>


                </a>


				<button v-else type="button" class="btn btn-warning text-dark" data-bs-toggle="modal" data-bs-target="#ReviewUnauthorised">
                        Оставить отзыв
                </button>
				<div class="modal fade" id="ReviewUnauthorised" tabindex="-1" aria-labelledby="ReviewUnauthorisedLabel" aria-hidden="true">
					<div class="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
						<div class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title fs-5" id="ReviewUnauthorisedLabel">Отзыв</h1>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body">
							<p class='fs-5 mb-0'>Для того, чтобы оставить отзыв, необходимо зарегистрироваться и/или авторизоваться.</p>
						</div>

						</div>
					</div>
				</div>

                    <div v-if='typeof post == "object"' class='d-flex align-items-center'>
						<div class='me-3'>
							<i class="fa-solid fa-eye"></i>
							<span class=''>{{post.views}}</span>
						</div>
                        <button @click.prevent='likePost({post: post, user: user, refreshNuxt})' class="btn btn-link p-0" data-bs-toggle="button">
                            <img :id='`like${post.slug}`' :src='postIsLiked() ? likeImg : likeDisabledImg' width="30" height="30" class=" like" z-index="-1" >
                        </button>
						<!-- <button v-if='!(post.favourite.some(e => e.username == (user ? user.username : "")))' @click.prevent='likePost({post_slug: post.slug, refreshNuxt: refreshNuxt})' class="btn btn-link p-0" data-bs-toggle="button">
							<img src="/img/icons/like-disabled.png" width="30" height="30" class=" like" z-index="-1">
						</button>
						<button v-else @click.prevent='likePost({post_slug: post.slug, refreshNuxt: refreshNuxt})' class="btn btn-link p-0" data-bs-toggle="button">
							<img src="/img/icons/like.png" width="30" height="30" class=" like" z-index="-1">
						</button> -->

						<span class='ms-0'>{{post.favourite.length}}</span>
					</div>
                    
                
    
                </div>


                <Comments :post_blog_slug='post_blog_slug' :comments='comments' :user='user' /> 


            </div>



            <Aside :photosForAside='photosForAside' :post_blog_slug='post_blog_slug'/>


        </div>
    </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import {mapState, mapActions} from 'vuex';
import {required, minLength, maxLength, email} from 'vuelidate/lib/validators';
import Header from '~/components/Header';
import Aside from '~/components/Aside';
import Comments from '~/components/Comments';
import Error from '~/components/Error';
export default {
    components:{
        Header,
        Aside,
        Comments,
        Error
    },
    data(){
      return {
		post_blog_slug: null,
        review: {
          product: null, 
          grade: null,
          comment: null,
          is_anonymous: false,
		  first_name: null,
		  email: null
        },
        error: null,

        post: '',
        comments: [],
        photosForAside: [],
      }
    },
    async fetch(){

        let params = this.$nuxt.$route.params

		let post_blog_slug = params.slug

        let post = await axios.get(`${process.env.baseUrl}/api/blog_posts/${params.slug}`)
        const gallery = await axios.get(`${process.env.baseUrl}/api/gallery/${post.data.images}`)
        const photosForAside = await axios.get(`${process.env.baseUrl}/api/gallery/`)
		post.data.images = gallery.data.photos


        let comments = await axios.post(`${process.env.baseUrl}/api/get_comments/`, {
            slug: post_blog_slug,
            post: 'blog'
        })
        
        this.getAside()

        //return
        this.post = post.data
        this.comments = comments.data
        this.photosForAside = photosForAside.data
        this.post_blog_slug = post_blog_slug
    },
    methods:{
        ...mapActions(['likePost', 'getAside']), //like post
        postIsLiked(){
            let flag = false
            for (let user of this.post.favourite){
                if ((this.user ? this.user.username: '') == user.username){
                    flag = true
                }
            }
            return flag
        },
		refreshNuxt(){ //like post
			this.$nuxt.refresh()
		},
        getCompressedImage(img){
            return img.split('.').slice(0, -1).join('.') + '_compressed.webp'
        },
		async addReview(){
			if (this.user&&!this.review.first_name){
				this.review.first_name = this.user.first_name + (this.user.first_name?' ':'') + this.user.last_name
			}
			if (this.user&&!this.review.email){
				this.review.email = this.user.email
			}
			this.review.product = this.$route.params.slug
			
			try {
				let response = await this.$axios.post(`${process.env.baseUrl}/api/review/`, this.review)
				document.getElementById('closeReview').click()
				let buttonSuccess = document.getElementById('ButtonReviewSuccess')
				buttonSuccess.click()
				
				this.$v.review.$reset()
			} catch(err){
				this.error = err.response.data
			}
		},
        transformTime(time){
			let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
			let date = new Date(time)
			let datePlusUTC = date.toLocaleString('ru-RU', { timeZone: userTimezone })
			return datePlusUTC.substr(0, datePlusUTC.length - 3)
		},
		closeReview(){
            const closeReviewSuccess = document.getElementById('closeReviewSuccess')
            closeReviewSuccess.click()
            this.$router.push('/profile/review')
        },
        /* DEL POST */
        async deletePost(){
            try{
                let slug = this.post_blog_slug
                let tags = this.post.tags
                
                let response = await this.$axios.delete(`${process.env.baseUrl}/api/blog_posts/${slug}/`)
                console.log(response)

                for(let tag of tags){
                    let delTagResponse = await this.$axios.delete(`${process.env.baseUrl}/api/tag_del/${tag.slug}`)
                    console.log(delTagResponse)
                }
                
                const closeDeletePost = document.getElementById('closeDeletePostModal')
                closeDeletePost.click()
                this.$router.push('/')
            } catch(err){
                console.log(err)
            }
        },
        setErrorsOnNull(){
            this.error = null
        }
    },
    computed:{
        ...mapState(['likeImg', 'likeDisabledImg', 'validationMessages']), //like post
        user(){
			return this.$auth.user
		},
        isSuperUser(){
            if (this.$auth.user) {
                return this.$auth.user.is_superuser
            } return false
        },
        reviewIsInvalid(){
            return this.$v.review.$invalid
        }
    },
	created(){
		if (this.user){
            this.review.first_name = this.user.first_name + (this.user.first_name?' ':'') + this.user.last_name
            this.review.email = this.user.email
		}
	},
	async mounted(){

        await axios.get(`${process.env.baseUrl}/api/view/${this.$nuxt.$route.params.slug}`)
		const carouselPostBlog = new bootstrap.Carousel('#carouselPostBlog', {
			interval: 5000,
		});
	},
    validations: {
        review: {
            first_name: {
                required,
                maxLength: maxLength(30)
            },
            email: {
                required,
                maxLength: maxLength(200),
                email
            },
            comment: {
                required
            },
            grade: {
                required
            }
        }
    }
}
</script>

<style scoped>

</style>