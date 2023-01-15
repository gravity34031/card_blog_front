<template>
<div>
    <Header title='Редиктирование работы'/>
    <div class="container-fluid pt-2 pb-2 mb-2 bg-color">
    <div class='row'>
        <div class="container col-lg-5 col-12 mb-3">
            <h3 class='text-center mb-3'>Отредактируй работу:</h3>
            <div class='card shadow-sm px-4 py-2'>

            <Error :error='error' />

                <!-- ADD POST FORM -->
                <form @submit.stop.prevent='changePostBlog()'>


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
                            <div v-if='!$v.post.title.$invalid||!$v.post.title.$dirty' id='titleHelp' class='form-text'>Название используется на карте работы и хлебных крошках</div>
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
                        <input v-model='post.description' id='description' @change='$v.post.description.$touch()' :class="'form-control' + ($v.post.description.$invalid&&$v.post.description.$dirty?' is-invalid':' ')" type='text' aria-describedby='descriptionHelp' placeholder='Описание данной работы'>
                        <div v-if='!$v.post.description.$invalid||!$v.post.description.$dirty' id='descriptionHelp' class='form-text'>Описание используется на карте работы</div>
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
                        <textarea v-model='post.content' id='content' @change='$v.post.content.$touch()' :class="'form-control' + ($v.post.content.$invalid&&$v.post.content.$dirty?' is-invalid':' ')" type='text' rows='4' aria-describedby='contentHelp' placeholder='Основная информация о работе'></textarea>
                        <div v-if='!$v.post.content.$invalid||!$v.post.content.$dirty' id='contentHelp' class='form-text'>Контент - это основная текстовая часть работы</div>
                        <div class='invalid-feedback'>
                            <span v-if='!$v.post.content.required'>
                                {{validationMessages.requiredMessage}}
                            </span>
                        </div>
                    </div>
                    <div class='mb-3'>
                        <label for='tags' class='form-label mb-1'>Категории</label>
                        <input v-model='post.tags' id='tags' @change='$v.post.tags.$touch()' :class="'form-control' + ($v.post.tags.$invalid&&$v.post.tags.$dirty?' is-invalid':' ')" type='text' aria-describedby='tagsHelp' placeholder='новый год, день рождения, открытка'>
                        <div v-if='!$v.post.tags.$invalid||!$v.post.tags.$dirty' id='tagsHelp' class='form-text'>Категории - способ группировки постов. Каждую категорию писать через запятую</div>
                        <div class='invalid-feedback'>
                            <span v-if='!$v.post.tags.required'>
                                {{validationMessages.requiredMessage}}
                            </span>
                        </div>
                    </div>
                    <div class='mb-3'>
                        <label for='price' class='form-label mb-1'>Цена</label>
                        <input v-model='post.price' id='price' style='width: 110px' @change='$v.post.price.$touch()' :class="'form-control' + ($v.post.price.$invalid&&$v.post.price.$dirty?' is-invalid':' ')" type='number' aria-describedby='priceHelp' placeholder='500'>
                        <div v-if='!$v.post.price.$invalid||!$v.post.price.$dirty' id='priceHelp' class='form-text'>Цена работы</div>
                        <div class='invalid-feedback'>
                            <span v-if='!$v.post.price.maxValue'>
                                {{validationMessages.maxValueMessage}} {{$v.post.price.$params.maxValue.max}}
                            </span>
                            <span v-if='!$v.post.price.minValue'>
                                {{validationMessages.minValueMessage}} {{$v.post.price.$params.minValue.min}}
                            </span>
                            <span v-if='!$v.post.price.required'>
                                {{validationMessages.requiredMessage}}
                            </span>
                        </div>
                    </div>
                    <div class='mb-3'>
                        <div class='d-flex align-items-center'>
                            <button @click='changeIconAddPhoto' class='btn btn-link btn-link-hover p-0 text-decoration-none' type='button' data-bs-toggle='collapse' data-bs-target='#addImageDiv' aria-expanded='false' aria-controls='addImageDiv'>
                                <i id='iconPlusAddPhoto' class="fa-solid fa-plus fs-6"></i>
                                <i id='iconMinusAddPhoto' class="fa-solid fa-minus fs-6 d-none"></i>
                                <span class='h6 mb-0 ms-2'>Добавить изображения</span>
                            </button>
                        </div>
                    </div>
                





                
                    <div class='collapse' id='addImageDiv'>
                        <!-- add image form -->
                        <form class='mb-4'>
                            <div class='mb-2'>
                                <Error :error='errorPhoto'/>
                                <label for='ImageFile' class='form-label'>Выберите изображение для загрузки</label>
                                <input id='ImageFile' @change='addImage' :class="'form-control' + ($v.photo.image.$invalid&&$v.photo.image.$dirty?' is-invalid':' ')" type='file' accept='.png, .jpeg, .jpg'>
                                <div class='invalid-feedback'>
                                    <span v-if='!$v.photo.image.required'>
                                        {{validationMessages.requiredMessage}}
                                    </span>
                                </div>
                            </div>
                            <div class='row'>
                                <div class='col'>
                                    <label for='imageName' class='form-label mb-1'>Название</label>
                                    <input @input='convertImageTitleToSlug' v-model='photo.title' @change='$v.photo.title.$touch()' :class="'form-control' + ($v.photo.title.$invalid&&$v.photo.title.$dirty?' is-invalid':' ')" id='imageName' type='text' placeholder='Изображение 1'>
                                    <div class='invalid-feedback'>
                                        <span v-if='!$v.photo.title.maxLength'>
                                            {{validationMessages.maxLengthMessage}} {{$v.photo.title.$params.maxLength.max}}
                                        </span>
                                        <span v-if='!$v.photo.title.required'>
                                            {{validationMessages.requiredMessage}}
                                        </span>
                                    </div>
                                </div>
                                <div class='col'>
                                    <label for='imageSlug' class='form-label mb-1'>Слаг</label>
                                    <input v-model='photo.slug' @change='$v.photo.slug.$touch()' :class="'form-control' + ($v.photo.slug.$invalid&&$v.photo.slug.$dirty?' is-invalid':' ')" id='imageSlug' type='text' placeholder='izobrazhenie-1'>
                                    <div class='invalid-feedback'>
                                        <span v-if='!$v.photo.slug.maxLength'>
                                            {{validationMessages.maxLengthMessage}} {{$v.photo.slug.$params.maxLength.max}}
                                        </span>
                                        <span v-if='!$v.photo.slug.required'>
                                            {{validationMessages.requiredMessage}}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class='text-end mt-2'>
                                <button @click.stop.prevent='addPhoto()' :disabled='photoIsInvalid' class='btn btn-primary' type='submit'>Сохранить фото</button>
                            </div>
                        </form>


                        <hr class='mb-2 mt-0'>
                        <!-- add galery form -->
                        <div class='text-center h5'>
                            Выберите изображения, которые будут использованы в посте:
                        </div>
                        <form>
                            <div class='d-flex flex-wrap m-0 p-0'>

                                <label :for='`input${img.id}`' v-for='img of allPhotos' :key='img.id' class='form-check imageHover ps-0 pe-0 pb-2 mb-0 d-flex mx-auto'>
                                    <div class='position-relative mt-1' style='left:192px;margin-left: -25px'>
                                        <input v-model='checkedPhotos' :value='img' :id='`input${img.id}`' type='checkbox' class='check-image form-check-input rounded-circle ms-0'>
                                        <p v-if='checkedPhotos.indexOf(img) != -1' class='position-relative text-white text-center' style='margin-left: -2px;bottom:2px;text-shadow: 1px 1px 3px #000,1px 1px 3px #000; opacity:80%'>{{checkedPhotos.indexOf(img) + 1}}</p>
                                    </div>
                                    
                                    <div>
                                        <img :src='getCompressedImage(img.image)' class='img-thumbnail p-0' width='200px'>
                                    </div>
                                    <div class='position-relative' style='right: 195px; margin-right: -15px'>
                                        <a @click='deleteImage(img)' class='text-decoration-none deleteImage p-0'>
                                            <i class="fa-solid fa-trash" data-bs-toggle='tooltip' data-bs-title='Удалить фотографию'></i>
                                        </a>
                                    </div>
                                </label>

                            </div>
                            <!-- <div class='row'>
                                <div class='col'>
                                    <label for='galleryName' class='form-label mb-1'>Название</label>
                                    <input @input='convertToSlug' v-model='addPhoto.title' id='galleryName' type='text' class='form-control' placeholder='Изображение 1'>
                                </div>
                                <div class='col'>
                                    <label for='gallerySlug' class='form-label mb-1'>Слаг</label>
                                    <input v-model='addPhoto.slug' id='gallerySlug' type='text' class='form-control' placeholder='izobrazhenie-1'>
                                </div>
                            </div> -->
                            <!-- <div class='text-end mt-2'>
                                <button @click.stop.prevent='addGallery()' class='btn btn-primary' type='submit'>Подтвердить</button>
                            </div> -->

                        </form>
                    <hr>
                    </div>

                    
                    <div class='text-end mt-2'>
                        <button :disabled='postIsInvalid' class='btn btn-primary' type='submit'>Сохранить пост</button>
                    </div>
                </form>
                


                




                





            </div>


        </div>


        <div class='col-lg-7 col-12 text-break'>
            <h3 class='text-center mb-3'>Предпросмотр работы:</h3>
            <span class='form-control rounded-0 border-bottom-0'>http://127.0.0.1/blog/{{post.slug}}</span>
            <Header :title='post.h1' />
            <div class='container mt-2'>
                
                <!-- INSTANCE -->
                <div class='mb-5'>
                    <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb">
                        <ol class="breadcrumb breadcrumb-color rounded">
                            <li class="breadcrumb-item"><a href='#'>Главная</a></li>
                            <li class="breadcrumb-item active" aria-current="page">{{post.title}}</li>
                        </ol>
                    </nav>


                    <div v-if='checkedPhotos.length == 0' class="carousel slide">
                        <img src="/img/post_img_preview.jpg" class="d-block w-100 post-carousel-item-img" alt="...">
                    </div>

                    <div id="carouselPostBlog" class="carousel slide" data-bs-ride="carousel">
                        <div v-if='checkedPhotos.length > 1' class="carousel-indicators">
                        <button v-for='i in checkedPhotos' type="button" data-bs-target="#carouselPostBlog" :data-bs-slide-to="`${checkedPhotos.indexOf(i)}`" :class="`${checkedPhotos.indexOf(i)==0?'active':''}`"></button>
                        </div>

                        <div class="carousel-inner rounded">

                        <div v-for='photo in checkedPhotos' :class="photo==checkedPhotos[0]?'carousel-item active':'carousel-item'">
                            <img :src="getCompressedImage(photo.image)" class="d-block w-100 post-carousel-item-img" alt="...">
                        </div>
                        
                        </div>
                        <button v-if='checkedPhotos.length > 1' class="carousel-control-prev" type="button" data-bs-target="#carouselPostBlog" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                        </button>
                        <button v-if='checkedPhotos.length > 1' class="carousel-control-next" type="button" data-bs-target="#carouselPostBlog" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                    <hr>

                    
                    <h4 class="d-flex justify-content-center align-items-center">
                        <i class="fa-solid fa-coins me-2"></i>
                        <span>Цена: <span v-if='post.price'>{{post.price}} р.</span></span>
                        
                    </h4>
                    <h6 class="d-flex justify-content-center align-items-center">
                        <i class="fa-solid fa-key me-2"></i>
                        Код товара: {{postId}}
                        
                    </h6>


                    <hr>
                    <span style='white-space:pre-line' v-html='post.content'></span>
                    <hr v-if='post.content'>
                    <small class="d-flex justify-content-end">Опубликовано: {{transformTime(postCreated_at)}}</small>
                </div>



                <!-- CARD -->
                <h4 class='text-center'>Карта работы</h4>

                <div class="col-xxl-4 col-xl-6 col-lg-8 col-md-8 col-sm-10 col-12 card shadow-sm h-100 mx-auto">
                    <div class="position-relative">
                            <img v-if='checkedPhotos.length != 0' :src="getCompressedImage(checkedPhotos[0].image)" class="card-img-top" alt="...">
                            <img v-else src="/img/post_img_preview.jpg" class="card-img-top" alt="...">

                            <div class="btn btn-link position-absolute top-0 end-0 p-0 me-1" data-bs-toggle="button">
                                <img src="/img/icons/like-disabled.png" width="30" height="30" class="position-relative like" z-index="-1">
                            </div>
                    </div>
                    <div class="card-body d-flex flex-column justify-content-between">
                        
                        <div class="">
                                <h5 class="card-title">{{ post.title }}</h5>
                                <p class="card-text">
                                    {{ post.description }}
                                </p>
                                <p class="mb-0 d-flex justify-content-center align-items-center">
                                    <span>Цена: <span v-if='post.price' class='text-break'>{{post.price}} р.</span></span>
                                </p>
                                <p class="mb-0 d-flex justify-content-center align-items-center">
                                    Код: {{postId}}
                                </p>
                        </div>

                        <div class="mb-2 all-tags">
                            <button class="btn btn-link" v-if='post.tags' v-for='tag in tagsToArray(post.tags)'>
                                <span class="badge text-bg-success text-wrap">{{ tag }}</span>
                            </button>
                        </div>
                        
                        <div class="d-flex justify-content-between align-items-center">
                            <a href='#' class="btn btn-primary me-auto lh-1">Подробнее</a>
                            <small class="text-muted ms-4 text-end">{{transformTime(postCreated_at)}}</small>
                        </div>

                    </div>
                </div>



            </div>
        </div>

    </div>
    </div>
</div>
</template>
<!-- TAGS IS NOT REQUIRED! -->
<script>
import {mapState} from 'vuex';
import {required, minLength, maxLength, maxValue, minValue} from 'vuelidate/lib/validators';
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
            photo: {
                image: null,
                title: '',
                slug: ''
            },
            post: {
                h1: null,
                title: null,
                slug: null,
                description: null,
                content: null,
                tags: null,
                price: null,
                images: null,
                author: null
            },
            checkedPhotos: [],
            error: null,
            errorGallery: null,
            errorPhoto: null
        }
    },
    async asyncData(ctx){
        let postSlug = ctx.params.slug
        try{
            let post = await ctx.$axios.get(`${process.env.baseUrl}/api/blog_posts/${postSlug}`)
            const gallery = await ctx.$axios.get(`${process.env.baseUrl}/api/gallery/${post.data.images}`)
            let tags = []
            for(let tag of post.data.tags){
                tags.push(tag.name)
            }
            const allPhotos = await ctx.$axios.get(`${process.env.baseUrl}/api/photo/`)
            
            return{
                postSlug: postSlug,
                allPhotos: allPhotos.data,
                getPost: post.data,

                post: {
                        h1: post.data.h1,
                        title: post.data.title,
                        slug: post.data.slug,
                        description: post.data.description,
                        content: post.data.content,
                        tags: tags, //
                        price: post.data.price,
                        images: gallery.data.photos, //
                        author: post.data.author
                    },
                checkedPhotos: gallery.data.photos,
                postGallerySlug: post.data.images,
                postCreated_at: post.data.created_at,
                postId: post.data.id
            }
        } catch(err){
            ctx.redirect('/add_post_blog')
        }
    },
    methods: {
        async changePostBlog(){
                let post = {}
                Object.assign(post, this.post)
                
                if (this.post.tags){
                    let tags = this.tagsToArray(this.post.tags)
                    post['tags'] = tags
                }
                let user = this.user.username
                post['author'] = user
                //if photos were changed change gallery 
                if(this.checkedPhotos != this.post.images){
                    let gallery = await this.changeGallery()
                    if (!gallery){
                        this.errorGallery = 'Нужно выбрать изображение(я)'
                    }
                    post['images'] = gallery
                } else{
                    post['images'] = this.postGallerySlug
                }

                

            try{
                const response = await this.$axios.put(`${process.env.baseUrl}/api/blog_posts/${this.postSlug}/`, post)

                this.setErrorsOnNull()
                this.$v.post.$reset()
                this.$router.push(`/blog/${response.data.slug}`)
            } catch(err){
                this.error = err.response.data
                if (this.errorGallery&&this.error['images']){
                    this.error['images'][0] = this.errorGallery
                }
            }
        },
        tagsToArray(postTags){
            let tags = (' ' + postTags).slice(1) //copy tags
            let tagsArray = []
            if (tags && tags!==''){
                for(let tag of tags.split(',')) {
                    tagsArray.push(tag.trim().toLowerCase())
                }
            }
            return tagsArray
        },
        async changeGallery(){
           
            try{
                if (this.checkedPhotos.length == 0){
                    return false
                }
                let photos = this.checkedPhotos
                let photosSlug = []
                for (let photo of photos){
                    photosSlug.push(photo.slug)
                }

                const response = await this.$axios.put(`${process.env.baseUrl}/api/gallery/${this.postGallerySlug}/`, {
                    photos: photosSlug
                })

                //this.post['images'] = response.data.slug
                return response.data.slug
            } catch (err) {
                console.log(err.response)
            }
        },
        convertPostTitleToSlug(input){
            let title = input.target.value
            this.post.slug = this.generate_url(title)
        },
        getCompressedImage(img){
            return img.split('.').slice(0, -1).join('.') + '_compressed.webp'
        },
        /* START ADD PHOTO */
        async addPhoto(){
            if (!this.photo.image){
                this.errorPhoto = 'Изображение не выбрано'
                return undefined
            }
            let formData = new FormData()
            formData.append('title', this.photo.title)
            formData.append('slug', this.photo.slug)
            formData.append('image', this.photo.image)
            try{

                const response = await this.$axios.post(`${process.env.baseUrl}/api/photo/`, formData)
                
                this.setErrorsPhotoOnNull()
                this.$nuxt.refresh()
            }catch(err){
                this.errorPhoto = err.response.data
                this.$nuxt.refresh()
            }
        },
        addImage(e){
            this.$v.photo.image.$touch()
            const file = e.target.files[0]
            if(file){
                this.photo.image = file
                this.photo.title = file.name
                this.photo.slug = this.generate_url(file.name)
            } else {
                this.photo = {
                image: null,
                title: '',
                slug: ''
                }
            }
        },
        convertImageTitleToSlug(input){
            let title = input.target.value
            this.photo.slug = this.generate_url(title)
        },
        /* END ADD PHOTO */

        /* DELETE PHOTO */
        async deleteImage(img){
            try{
                const response = await this.$axios.delete(`${process.env.baseUrl}/api/photo/${img.slug}`)
                this.$nuxt.refresh()
            } catch(err) {
                console.log(err)
            }
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
        changeIconAddPhoto(){
            const plus = document.getElementById('iconPlusAddPhoto')
            const minus = document.getElementById('iconMinusAddPhoto')
            if (minus.classList.contains('d-none')) {
                plus.classList.add('d-none')
                minus.classList.remove('d-none')
            } else{
                plus.classList.remove('d-none')
                minus.classList.add('d-none')
            }
            
        },
        transformTime(time){
			let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
			let date = new Date(time)
			let datePlusUTC = date.toLocaleString('ru-RU', { timeZone: userTimezone })
			return datePlusUTC.substr(0, datePlusUTC.length - 3)
		},
        setErrorsOnNull(){
            this.error = null
        },
        setErrorsPhotoOnNull(){
            this.errorPhoto = null
        }
    },
    computed: {
        ...mapState(['validationMessages']),
        user(){
            return this.$auth.user
        },
        photoIsInvalid(){
            return this.$v.photo.$invalid
        },
        postIsInvalid(){
            return this.$v.post.$invalid
        }
    },
    validations:{
        photo: {
            image: {
                required
            },
            title: {
                required,
                maxLength: maxLength(250)
            },
            slug: {
                required,
                maxLength: maxLength(250)
            }
        },
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
            },
            tags: {
                required
            },
            price: {
                required,
                maxValue: maxValue(9999),
                minValue: minValue(0)
            },
            images: {
                required
            }
        }
    }
}
</script>

<style scoped>

</style>