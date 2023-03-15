<template>
<div>
    <Header title='Редактирование новости'/>
    <div class="container-fluid pt-2 pb-2 mb-2 bg-color">
    <div class='row'>
        <div class="container col-lg-5 col-12 mb-3">
            <h3 class='text-center mb-3'>Отредактируй новость:</h3>
            <div class='card shadow-sm px-4 py-2'>

            <Error :error='error' />

                <!-- ADD POST FORM -->
                <form @submit.stop.prevent='addNewsBlog()'>


                    <div class='mb-3'>
                        <label for='h1' class='form-label mb-1'>Заголовок</label>
                        <input v-model='post.h1' id='h1' @change='$v.post.h1.$touch()' :class="'form-control' + ($v.post.h1.$invalid&&$v.post.h1.$dirty?' is-invalid':' ')" type='text' aria-describedby='h1Help' placeholder='Заголовок 1'>
                        <div v-if='!$v.post.h1.$invalid||!$v.post.h1.$dirty' id='h1Help' class='form-text'>Заголовок выводится в верхней части страницы.</div>
                        <div class='invalid-feedback'>
                            <span v-if='!$v.post.h1.maxLength'>
                                {{validationMessages.maxLengthMessage}} {{$v.post.h1.$params.maxLength.max}}
                            </span>
                            <span v-if='!$v.post.h1.required'>
                                {{validationMessages.requiredMessage}}
                            </span>
                        </div>
                    </div>
                    <div class='mb-3 row'>
                        <div class='col'>
                            <label for='title' class='form-label mb-1'>Название</label>
                            <input v-model='post.title' @input='convertPostTitleToSlug' @change='$v.post.title.$touch()' :class="'form-control' + ($v.post.title.$invalid&&$v.post.title.$dirty?' is-invalid':' ')" id='title' type='text' aria-describedby='titleHelp' placeholder='Название 1'>
                            <div v-if='!$v.post.title.$invalid||!$v.post.title.$dirty' id='titleHelp' class='form-text'>Название используется на карте новости и хлебных крошках</div>
                            <div class='invalid-feedback'>
                            <span v-if='!$v.post.title.maxLength'>
                                {{validationMessages.maxLengthMessage}} {{$v.post.title.$params.maxLength.max}}
                            </span>
                            <span v-if='!$v.post.title.required'>
                                {{validationMessages.requiredMessage}}
                            </span>
                        </div>
                        </div>
                        <div class='col'>
                            <label for='slug' class='form-label mb-1'>Слаг</label>
                            <input v-model='post.slug' id='slug' @change='$v.post.slug.$touch()' :class="'form-control' + ($v.post.slug.$invalid&&$v.post.slug.$dirty?' is-invalid':' ')" type='text' aria-describedby='slugHelp' placeholder='nazvanie-1'>
                            <div v-if='!$v.post.slug.$invalid||!$v.post.slug.$dirty' id='slugHelp' class='form-text'>Используется в url. Не заполнять для автоматического заполнения</div>
                            <div class='invalid-feedback'>
                            <span v-if='!$v.post.slug.maxLength'>
                                {{validationMessages.maxLengthMessage}} {{$v.post.slug.$params.maxLength.max}}
                            </span>
                            <span v-if='!$v.post.slug.required'>
                                {{validationMessages.requiredMessage}}
                            </span>
                        </div>
                        </div>
                    </div>
                    <div class='mb-3'>
                        <label for='description' class='form-label mb-1'>Описание</label>
                        <input v-model='post.description' id='description' @change='$v.post.description.$touch()' :class="'form-control' + ($v.post.description.$invalid&&$v.post.description.$dirty?' is-invalid':' ')" type='text' aria-describedby='descriptionHelp' placeholder='Описание данной новости'>
                        <div v-if='!$v.post.description.$invalid||!$v.post.description.$dirty' id='descriptionHelp' class='form-text'>Описание используется на карте новости</div>
                        <div class='invalid-feedback'>
                            <span v-if='!$v.post.description.maxLength'>
                                {{validationMessages.maxLengthMessage}} {{$v.post.description.$params.maxLength.max}}
                            </span>
                            <span v-if='!$v.post.description.required'>
                                {{validationMessages.requiredMessage}}
                            </span>
                        </div>
                    </div>
                    <div class='mb-3'>
                        <label for='content' class='form-label mb-1'>Контент</label>
                        <textarea v-model='post.content' id='content' @change='$v.post.content.$touch()' :class="'form-control' + ($v.post.content.$invalid&&$v.post.content.$dirty?' is-invalid':' ')" type='text' rows='4' aria-describedby='contentHelp' placeholder='Основная информация о новости'></textarea>
                        <div v-if='!$v.post.content.$invalid||!$v.post.content.$dirty' id='contentHelp' class='form-text'>Контент - это основная текстовая часть новости</div>
                        <div class='invalid-feedback'>
                            <span v-if='!$v.post.content.required'>
                                {{validationMessages.requiredMessage}}
                            </span>
                        </div>
                    </div>
                    <div class='mb-3'>
                        <div class='mb-2'>
                            <label for='ImageFile' class='form-label'>Выберите изображение для загрузки</label>
                            <input id='ImageFile' @change='addImage' class='form-control' type='file' accept='.png, .jpeg, .jpg'>
                        </div>
                    </div>
                    <div class='text-end mt-2'>
                        <button :disabled='postIsInvalid' class='btn btn-primary' type='submit'>Сохранить пост</button>
                    </div>
                </form>
                


            </div>


        </div>


        <div class='col-lg-7 col-12 text-break'>
            <h3 class='text-center mb-3'>Предпросмотр новости:</h3>
            <span class='form-control rounded-0 border-bottom-0'>http://127.0.0.1/blog/{{post.slug}}</span>
            <Header :title='post.h1' />
            <div class='container mt-2'>
                
                <!-- INSTANCE -->
                <div class='mb-5'>
                    <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb">
                        <ol class="breadcrumb breadcrumb-color rounded">
                            <li class="breadcrumb-item"><a href='#'>Главная</a></li>
                            <li class="breadcrumb-item"><a href='#'>Новости</a></li>
                            <li class="breadcrumb-item active" aria-current="page">{{post.title}}</li>
                        </ol>
                    </nav>

                    <div class="detail-news">
                        <img v-if='postImage||photoPreviewURL' :src='photoPreviewURL?photoPreviewURL:postImage' class='news-img'>

                        <hr v-if='photoPreviewURL&&post.content'>
                        <span style='white-space:pre-line' v-html='post.content'></span>
                        <hr v-if='post.content||photoPreviewURL'>
                        <small class="d-flex justify-content-end">Опубликовано: {{transformTime(post.created_at)}}</small>
                    </div>
                </div>



                <!-- CARD -->
                <h4 class='text-center'>Карта новости</h4>

                <div class="card px-2 py-3">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <h5 class="card-title">{{post.title}}</h5>
                            <p class="card-text">{{post.description}}</p>
                            <div class="d-flex justify-content-between">
                                <small class="align-self-end">{{transformTime(post.created_at)}}</small>
                                <a href='#' class="btn btn-secondary">Подробнее</a>
                            </div>
                        </li>
                    </ul>
                </div>


            </div>
        </div>



    </div>
    </div>
</div>
</template>
<!-- TAGS IS NOT REQUIRED! -->
<script>
import axios from 'axios';
import {mapState} from 'vuex';
import {required, minLength, maxLength} from 'vuelidate/lib/validators';
import Header from '@/components/Header';
import Error from '~/components/Error';
export default {
    components: {
        Header,
        Error
    },
    middleware: 'isSuperUser',
    data(){
        return{
            photoPreviewURL: null,
            post: {
                h1: null,
                title: null,
                slug: null,
                description: null,
                content: null,
                author: null
            },
            postImage: null,
            newsExists: true,
            error: null,

            postSlug: '',
            postImage: '',
        }
    },
    async fetch(){
        let postSlug = this.$nuxt.$route.params.slug
        try{
            let post = await axios.get(`${process.env.baseUrl}/api/news_posts/${postSlug}`)

            // return
            this.post = {
                    h1: post.data.h1,
                    title: post.data.title,
                    slug: post.data.slug,
                    description: post.data.description,
                    content: post.data.content,
                    author: post.data.author,
                    created_at: post.data.created_at,
                }
            this.postSlug = postSlug
            this.postImage = post.data.image
        } catch(err){
            console.log('Данной новости не существует. Создайте новую')
            return {newsExists: false}
        }
    },
    methods: {
        async addNewsBlog(){
            if(this.newsExists){
                try{
                    let data = this.post
                    if (this.post.image){
                        let formData = new FormData()
                        formData.append('image', this.post.image)
                        formData.append('h1', this.post.h1)
                        formData.append('title', this.post.title)
                        formData.append('slug', this.post.slug)
                        formData.append('description', this.post.description)
                        formData.append('content', this.post.content)
                        formData.append('author', this.post.author)
                        data = formData
                    } 
                    const response = await this.$axios.put(`${process.env.baseUrl}/api/news_posts/${this.postSlug}/`, data)

                    this.setErrorsOnNull()
                    this.$v.post.$reset()
                    this.$router.push(`/news/${response.data.slug}`)
                } catch(err){
                    try{
                        this.error = err.response.data
                    } catch(e){
                        this.error = 'Неизвестная ошибка. Выберите другое фото'
                    }
                }
            } else{
                let post = this.post    
                let user = this.user.username

                let formData = new FormData()
                if(this.post.image){
                    formData.append('image', this.post.image)
                }
                if(this.post.image){
                    formData.append('image', this.post.image)
                }
                if(this.post.h1){
                    formData.append('h1', this.post.h1)
                }
                if(this.post.title){
                    formData.append('title', this.post.title)
                }
                if(this.post.slug){
                    formData.append('slug', this.post.slug)
                }
                if(this.post.description){
                    formData.append('description', this.post.description)
                }
                if(this.post.content){
                    formData.append('content', this.post.content)
                }
                if(user){
                    formData.append('author', user)
                }
                try{
                    const response = await this.$axios.post(`${process.env.baseUrl}/api/news_posts/`, formData)
                    
                    this.setErrorsOnNull()
                    this.$v.post.$reset()
                    this.$router.push(`/news/${response.data.slug}`)
                } catch(err){
                    this.error = err.response.data
                }
            }
        },
        convertPostTitleToSlug(input){
            let title = input.target.value
            this.post.slug = this.generate_url(title)
        },
        addImage(e){
            const file = e.target.files[0]
            if (file){
                this.photoPreviewURL = URL.createObjectURL(file)
            } else {
                this.photoPreviewURL = null
            }
            this.post.image = file
        },
        /* START CONVERT STRING TO SLUG */
        generate_url(str){
            var url = str.replace(/[\s]+/gi, '-');
            url = this.translit(url);
            url = url.replace(/[^0-9a-z_\-]+/gi, '').toLowerCase();	
            return url;
        },
        translit(str){
            var ru=("А-а-Б-б-В-в-Ґ-ґ-Г-г-Д-д-Е-е-Ё-ё-Є-є-Ж-ж-З-з-И-и-І-і-Ї-ї-Й-й-К-к-Л-л-М-м-Н-н-О-о-П-п-Р-р-С-с-Т-т-У-у-Ф-ф-Х-х-Ц-ц-Ч-ч-Ш-ш-Щ-щ-Ъ-ъ-Ы-ы-Ь-ь-Э-э-Ю-ю-Я-я").split("-")   
            var en=("A-a-B-b-V-v-G-g-G-g-D-d-E-e-E-e-E-e-ZH-zh-Z-z-I-i-I-i-I-i-J-j-K-k-L-l-M-m-N-n-O-o-P-p-R-r-S-s-T-t-U-u-F-f-H-h-TS-ts-CH-ch-SH-sh-SCH-sch-'-'-Y-y-'-'-E-e-YU-yu-YA-ya").split("-")   
                var res = '';
            for(var i=0, l=str.length; i<l; i++)
            { 
                var s = str.charAt(i), n = ru.indexOf(s); 
                if(n >= 0) { res += en[n]; } 
                else { res += s; } 
                } 
                return res;  
        },
        /* END CONVERT STRING TO SLUG */
        transformTime(time){
			let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
			let date = new Date(time)
			let datePlusUTC = date.toLocaleString('ru-RU', { timeZone: userTimezone })
			return datePlusUTC.substr(0, datePlusUTC.length - 3)
		},
        setErrorsOnNull(){
            this.error = null
        },
    },
    computed: {
        ...mapState(['validationMessages']),
        user(){
            return this.$auth.user
        },
        postIsInvalid(){
            return this.$v.post.$invalid
        }
    },
    validations:{
        post: {
            h1: {
                required,
                maxLength: maxLength(100)
            },
            title: {
                required,
                maxLength: maxLength(50)
            },
            slug: {
                required,
                maxLength: maxLength(50)
            },
            description: {
                required,
                maxLength: maxLength(200)
            },
            content: {
                required
            }
        }
    }
}
</script>

<style scoped>

</style>