<template>
<div>

    <Header title='Ваши отзывы'/>


    <div class="container-fluid pt-4 pb-2 bg-color">
        <div class="container">


            <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb">
                <ol class="breadcrumb breadcrumb-color rounded">
                    <li class="breadcrumb-item"><nuxt-link to='/'>Главная</nuxt-link></li>
                    <li class="breadcrumb-item"><nuxt-link to='/profile'>Профиль</nuxt-link></li>
                    <li class="breadcrumb-item active">Отзывы</li>
                    
                </ol> 
            </nav>



            <!-- OTHER REVIEWS -->
            <div v-if='typeof reviews ==="object"'>
                <span v-if='!reviews.length > 0' class='fs-5'>
                    Вы ещё не написали ни одного отзыва.<br>
                    Вы можете это сделать
                    <nuxt-link to='/review'>на странице отзывов</nuxt-link>
                    или на странице любой из работ
                </span>
                
                <div v-else>
                    <p class="lead mb-0">Всего отзывов: {{reviews.length}}</p>
                    <p class="lead mb-2">Средняя оценка: {{averageGrade()}}</p>
                    <h2 class="mb-3 text-center">Отзывы</h2>
                </div>
            </div>
            <div v-else class="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status">
                </div>
            </div>
            <ReviewList :reviews='reviews' 
            :photosForReviewList='photosForReviewList' />
            


        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import Header from '~/components/Header';
import ReviewList from '~/components/ReviewList';
export default {
    components: {
        Header,
        ReviewList
    },
    middleware: 'anonymRedirect',
    data(){
        return{
            reviews: '',
            photosForReviewList: null,
        }
    },
    async fetch(){
        const reviews = await this.$axios.get(`${process.env.baseUrl}/api/profile/review/`)
        const photosForReviewList = await axios.get(`${process.env.baseUrl}/api/gallery/`)
        
        this.reviews = reviews.data
        this.photosForReviewList = photosForReviewList.data
    },
    methods:{
        averageGrade(){
            let sum = 0
            const quantity = this.reviews.length
            for (let review of this.reviews){
                sum += review.grade
            }
            return Math.round(sum/quantity * 10) / 10
        },
    },
}
</script>

<style scoped>

</style>