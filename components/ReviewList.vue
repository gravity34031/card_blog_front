<template>
<div>

    <div v-for='review in reviews' v-if='reviews' class="mb-3 border rounded-4 bg-white px-3 py-2 comment-hover">
        <div class="mb-3 d-flex align-items-center text-wrap text-break">
            <img :src="`${back_path}${review.user.avatar}`" class="border mt-2 me-3 rounded-circle d-sm-block" height="50px" width="50px" alt="Аватар">
            <div class="d-block d-sm-flex justify-content-between w-100">
                <div>
                    <h5 class='mb-0 text-wrap text-break'>{{review.user.username}}</h5>
                    <small v-if='!review.is_anonymous' class='lh-1 text-wrap text-break'>{{review.first_name}}</small>
                    <small v-else class='lh-1 text-wrap text-break'>Аноним</small>
                </div>
                <small>{{transformTime(review.created_at)}}</small>
            </div>
        </div>

        <!-- POST -->
        <div v-if='review.product'>
            <div class="col-12 col-sm-9 col-md-6 col-lg-5 col-xl-4 col-xxl-3">
                <img :src="chooseImage(review.product.images)" class="card-img-top review-img rounded">
            </div>


            
                <h5 class="mb-0 mt-3">
                    <nuxt-link :to='`/blog/${review.product.slug}`' class="link-primary text-decoration-none">
                        {{review.product.title}}
                    </nuxt-link>
                </h5>
            
            <p class="lead mb-0">Код товара: {{review.product.id}}</p>
        </div>


        <div class="mt-3 d-flex">
            <div class="container-wrapper">  

                <div class="container d-flex align-items-center justify-content-center p-0">
                    <div class="row justify-content-center">
                        
                        <form>
                        <!-- star rating -->
                        <div class="rating-wrapper-profile-review d-flex flex-row-reverse">

                        <!-- star 5 -->
                        <input :checked='review.grade == 5' type="radio" :id="`${review.id}5-star-rating`" name="star-rating" disabled value="5">
                        <label :for="`${review.id}5-star-rating`" class="star-rating">
                            <i class="fa fa-star-o d-flex align-items-center" aria-hidden="true"></i>
                        </label>
                        
                        <!-- star 4 -->
                        <input :checked='review.grade == 4' type="radio" :id="`${review.id}4-star-rating`" name="star-rating" disabled value="4" checked>
                        <label :for="`${review.id}4-star-rating`" class="star-rating star">
                            <i class="fa fa-star-o d-flex align-items-center" aria-hidden="true"></i>
                        </label>
                        
                        <!-- star 3 -->
                        <input :checked='review.grade == 3' type="radio" :id="`${review.id}3-star-rating`" name="star-rating" disabled value="3">
                        <label :for="`${review.id}3-star-rating`" class="star-rating star">
                            <i class="fa fa-star-o d-flex align-items-center" aria-hidden="true"></i>
                        </label>
                        
                        <!-- star 2 -->
                        <input :checked='review.grade == 2' type="radio" :id="`${review.id}2-star-rating`" name="star-rating" disabled value="2">
                        <label :for="`${review.id}2-star-rating`" class="star-rating star">
                            <i class="fa fa-star-o d-flex align-items-center" aria-hidden="true"></i>
                        </label>
                        
                        <!-- star 1 -->
                        <input :checked='review.grade == 1' type="radio" :id="`${review.id}1-star-rating`" name="star-rating" disabled value="1">
                        <label :for="`${review.id}1-star-rating`" class="star-rating star">
                            <i class="fa fa-star-o d-flex align-items-center" aria-hidden="true"></i>
                        </label>
                        </div>
                        </form>

                    </div>
                </div>

            </div>

            <h5 class="d-none d-sm-inline">Отзыв</h5>
        </div>
            

        <span class=''>
            <span style='white-space: pre-line'>{{sliceComment(review.comment)[0]}}<span :id='`comment${review.id}`' class='d-none'>{{sliceComment(review.comment)[1]}}</span></span>
            <p v-if='sliceComment(review.comment)[1]'>
                <a :id='`link${review.id}`' @click='showFullComment(review.id)' class="comment-link">
                    Показать полностью
                </a>
            </p>
        </span>
        <div v-if='user' class='text-end'>
            <a v-if='review.user.username == user.username || user.is_superuser' type='button' data-bs-toggle='modal' data-bs-target='#deleteReviewModal' :data-bs-reviewId='review.id' class='text-decoration-none deleteComment p-0'>
                <i class="fa-solid fa-trash" data-bs-toggle='tooltip' data-bs-title='Удалить отзыв'></i>
            </a>
        </div>
        
            

    </div>

    <div v-else>
        <span class='lead'>Отзывов нет</span>
    </div>


    <!-- Modal del review -->
    <div class="modal fade" id="deleteReviewModal" tabindex="-1" aria-labelledby="deleteReviewModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="deleteReviewModalLabel">Удаление отзыва</h1>
                <button id='closeDeleteReviewModal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p class='mb-0'>Вы уверены, что хотите удалить отзыв?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отменить</button>
                <button @click.stop.prevent='deleteReview(reviewId)' type="button" class="btn btn-danger">Удалить</button>
            </div>
            </div>
        </div>
    </div>



</div>
</template>

<script>
export default {
    props: ['reviews', 'photosForReviewList'],
    data(){
        return{
            back_path: '',
        }
    },
    created(){
        if (!this.$route.path.includes('profile')){
            this.back_path = process.env.baseUrl
        }
    },
    methods:{
        transformTime(time){
			let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
			let date = new Date(time)
			let datePlusUTC = date.toLocaleString('ru-RU', { timeZone: userTimezone })
			return datePlusUTC.substr(0, datePlusUTC.length - 3)
		},
        getImages(gallery_slug){
			for (let i of this.photosForReviewList){
				if(i.slug == gallery_slug){
					return i.photos
				}
			}
			return ''
		},
        chooseImage(images){
            const image = (function(dict, key){return (dict) ? dict[key] : ''})(this.getImages(images)[0], 'image')
            return image.split('.').slice(0, -1).join('.') + '_compressed.webp'
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
        },
        async deleteReview(reviewId){
            try{
                const closeDeleteReview = document.getElementById('closeDeleteReviewModal')
                closeDeleteReview.click()
                let response = await this.$axios.delete(`${process.env.baseUrl}/api/review/`, {
                    data:{
                        id: reviewId
                    }
                })
                console.log(response)
                this.$nuxt.refresh()
            } catch(err){
                console.log(err.response)
            }
        },
    },
    computed: {
        user(){
            return this.$auth.user
        }
    },
    mounted(){
        const deleteReviewModal = document.getElementById('deleteReviewModal')
        deleteReviewModal.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget
            const reviewId = button.getAttribute('data-bs-reviewId')
            this.reviewId = reviewId
        })
    }
}
</script>

<style scoped>

</style>