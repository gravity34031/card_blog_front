<template>
    <div>
        <Header title='Отзывы'/>


        <div class="container-fluid pt-4 pb-2 bg-color">
            <div class="container">


                <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb">
                    <ol class="breadcrumb breadcrumb-color rounded">
                        <li class="breadcrumb-item"><nuxt-link to='/'>Главная</nuxt-link></li>
                        <li class="breadcrumb-item active" aria-current="page">Отзывы</li>
                    </ol> 
                </nav>


                <!-- WRITE REVIEW -->
                <div v-if='user' class="mb-5">
                    <form>
                        <div class="lh-1 mb-3">
                            <h2 class="mb-0">Оставьте отзыв</h2>
                            <!-- <small class="text-muted">Перед публикацией отзывы проходят модерацию</small> -->
                        </div>
                        <Error :error='error'/>
                        <div class="form-floating mt-3">
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
                        <div class="form-floating mt-3">
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


                        <!-- review product -->
                        <div class="mt-3 border rounded px-2 pb-2 pt-1">
                            <form class="mt-2 m-auto" role="search">
                                <p class="mb-2 lh-1">Выберите товар</p>
                                <div class="d-flex">
                                    <input v-model='searchProduct' @input='searchProductForReview()' id="searchProduct" type="search" class="form-control pe-2" placeholder="Название/Код товара" aria-label="Search">
                                    <!-- <button @click.stop.prevent='searchProductForReview()' class="btn btn-sm btn-outline-success" type="submit">Поиск</button> -->
                                </div>
                            </form>
                            <select v-model='selectedProduct' v-if='products && products.length > 0' class="mt-2 form-select form-select-sm" aria-label="Default select example">
                                <option v-for='post in products' :value='post.slug'>
                                    <span>{{post.title}} - код: {{post.id}}</span>
                                </option>
                            </select>
                            <select v-if='!selectedProduct && !justCreated' class="mt-2 form-select form-select-sm is-invalid">
                                <option selected disabled>
                                    Не найдено
                                </option>
                            </select>
                            <div class='invalid-feedback'>
                                Товар не выбран
                            </div>
                        </div>
                        

                        <div class="mt-3 d-flex align-items-center">
                        <!-- RATING -->
                        <div class="container-wrapper">  
                            <div class="ps-0 pe-2 container d-flex align-items-center justify-content-center">
                            <div class="row justify-content-center">    
                                
                                <form>
                                <!-- star rating -->
                                <div class="rating-wrapper rating-wrapper-review d-flex flex-row-reverse">

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

                            </div>
                            </div>
                        </div>

                        <h5 class="m-0 d-none d-sm-inline">Оценка</h5>
                        </div>



                        <div class="row mt-3 mx-0 form-floating">
                            <textarea v-model='review.comment' @change='$v.review.comment.$touch()' :class="'form-control' + ($v.review.comment.$invalid&&$v.review.comment.$dirty?' is-invalid':' ')" style='height:100px' id="reviewComment" placeholder="Оставьте отзыв"></textarea>
                            <label for="reviewComment" class="form-label">Комментарий к отзыву</label>
                            <div class='invalid-feedback'>
                                <span v-if='!$v.review.comment.required'>
                                    {{validationMessages.requiredMessage}}
                                </span>
                            </div>
                        </div>
                        <div class="form-check mx-0 mt-2">
                        <input v-model='review.is_anonymous' class="form-check-input" type="checkbox" value="" id="anonymousReview">
                        <label class="form-check-label" for="anonymousReview">
                            Анонимный отзыв
                        </label>
                        </div>
                        


                        <div class="d-grid d-md-block mt-3 text-end">
                            <button @click.stop.prevent='addReview(), setErrorsOnNull()' :disabled='reviewIsInvalid' type="submit" class="btn btn-primary btn-lg">Отправить</button>
                        </div>
                    </form>
                </div>
                <div v-else class='card-text mb-5'>
                    Зарегистрируйтесь или авторизуйтесь, чтобы оставить отзыв
                </div>



                <!-- SUCCESS -->
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



                <!-- OTHER REVIEWS -->
                <h2 class="mb-3 text-center">Другие отзывы</h2>

                <ReviewList :reviews='reviews' 
                :photosForReviewList='photosForReviewList' />
                


            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import {mapState} from 'vuex';
import {required, minLength, maxLength, email} from 'vuelidate/lib/validators';
import Header from '~/components/Header';
import ReviewList from '~/components/ReviewList';
import Error from '~/components/Error';
export default {
    components: {
        Header,
        ReviewList,
        Error
    },
    data(){
        return{
            searchProduct: '',
            selectedProduct: '',
            products: [],
            justCreated: true,
            review: {
                product: null, 
                grade: null,
                comment: null,
                is_anonymous: false,
                first_name: null,
		        email: null
            },
            error: null,
            reviews: null,
            photosForReviewList: null
        }
    },
    async fetch(){
        const reviews = await this.$axios.get(`${process.env.baseUrl}/api/review`)
        const photosForReviewList = await this.$axios.get(`${process.env.baseUrl}/api/gallery/`)

        this.reviews = reviews.data
        this.photosForReviewList = photosForReviewList.data
    },
    methods:{
        async addReview(){
            /* set review user name & email if blank*/
			if (this.user&&!this.review.first_name){
				this.review.first_name = this.user.first_name + (this.user.first_name?' ':'') + this.user.last_name
			}
			if (this.user&&!this.review.email){
				this.review.email = this.user.email
			}
			this.review.product = this.selectedProduct
			
			try {
				let response = await this.$axios.post(`${process.env.baseUrl}/api/review/`, this.review)
                
                /* reset review form */
                if (this.user){
                    this.review.first_name = this.user.first_name + (this.user.first_name?' ':'') + this.user.last_name
                    this.review.email = this.user.email
                } else{
                    this.review.first_name = null
                    this.review.email = null
                }
                this.review.product = null
                this.review.grade = null
                this.review.comment = null
                this.review.is_anonymous = null

                this.searchProduct = ''
                this.selectedProduct = ''
                this.products = []
                this.justCreated = true

                /* modal window */
                const modalReviewSuccess = new bootstrap.Modal('#reviewSuccess')
                modalReviewSuccess.show()

                this.$nuxt.refresh()
                this.$v.review.$reset()
                this.$v.selectedProduct.$reset()

			} catch(err){
				this.error = err.response.data
			}
		},
        async searchProductForReview(){
            let products = await this.$axios.get(`${process.env.baseUrl}/api/search_blog_review/?search=${this.searchProduct}`)
            this.products = products.data
            this.justCreated = false
            if (products.data.length > 0){
                this.selectedProduct = products.data[0].slug
            } else{
                this.selectedProduct = ''
            }
        },
        closeReview(){
            const closeReviewSuccess = document.getElementById('closeReviewSuccess')
            closeReviewSuccess.click()
            this.$router.push('/profile/review')
        },
        setErrorsOnNull(){
            this.error = null
        },
    },
    computed:{
        ...mapState(['validationMessages']),
        user(){
			return this.$auth.user
		},
        reviewIsInvalid(){
            return this.$v.review.$invalid || this.$v.selectedProduct.$invalid
        }
    },
	created(){
		if (this.user){
		    this.review.first_name = this.user.first_name + (this.user.first_name?' ':'') + this.user.last_name
		    this.review.email = this.user.email
		}
	},
    mounted(){
        // auto textarea
        const tx = document.getElementsByTagName("textarea");
        for (let i = 0; i < tx.length; i++) {
            tx[i].setAttribute("style", "height:" + Math.max(100, (tx[i].scrollHeight)) + "px;overflow-y:hidden;");
            tx[i].addEventListener("input", OnInput, false);
        }

        function OnInput() {
            this.style.height = 0;
            this.style.height = Math.max(100, (this.scrollHeight)) + "px";
        }
    },
    validations: {
        selectedProduct: {
            required
        },
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