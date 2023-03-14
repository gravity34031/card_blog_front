<template>
<div>
    <footer class="footer footer-color">
	<div class="container py-3">
		<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">


			<div class="col">
				<h3><i class="fa fa-phone-square me-2"></i>Контакты</h3>
				<ul class="list-unstyled fs-5 ms-3 text-break">
					<li class="d-flex align-items-center">
						<a :href='instagram.link' class="text-body text-decoration-none link-hover" target="_blank">
							<span>
                                <i class="fa fa-instagram me-2"></i>
							    {{instagram.nickname}}
                            </span>
					</a>
					</li>
					<li class="d-flex align-items-center">
						<a :href='telegram.link' class="text-body text-decoration-none link-hover" target="_blank">
							<span>
                                <i class="fa fa-telegram me-2"></i>
							    {{telegram.nickname}}
                            </span>
                        </a>
					</li>
					<li class="d-flex align-items-center">
						<span>
                            <i class="fa fa-envelope-o me-2"></i>
						    {{email}}
                        </span>
					</li>
					<li class="d-flex align-items-center">
						<nuxt-link to='/contact' class="text-body text-decoration-none link-hover">
							<span>
                                <i class="fa fa-phone me-2"></i>
                                Обратная связь
                            </span>
						</nuxt-link>
					</li>
				</ul><hr class="d-block d-md-none">
			</div>
            

            <div class="col d-block d-md-flex align-items-end align-items-lg-center flex-column">
				<h3><i class="fa fa-bookmark me-2"></i>Полезное</h3>
				<ul class="list-unstyled fs-5 ms-3 text-break">
					<li class="d-flex align-items-center">
						<nuxt-link to='/review' class="text-body text-decoration-none link-hover">
							<span>
                                <i class="fa fa-star-o me-2"></i>
							    Отзывы
                            </span>
						</nuxt-link>
					</li>
                    <li class="d-flex align-items-center">
						<nuxt-link to='/news' class="text-body text-decoration-none link-hover">
                            <span>
							    <i class="fa fa-newspaper-o me-2"></i>
							    Новости
                            </span>
						</nuxt-link>
					</li>
				</ul><hr class="d-block d-md-none">
			</div>


            <div class="col d-block d-lg-flex align-items-end flex-column">
				<ul class="list-unstyled fs-5 text-break">
				<h3><i class="fa fa-navicon me-2"></i>Категории</h3>
					<div>
					<li v-for='tag in tags[0]' class="ms-3">
						<nuxt-link :to='`/categories/${tag.slug}`' class="text-body text-decoration-none link-catalog">
							<span>&raquo {{tag.name}}</span>
						</nuxt-link>
					</li>
					</div>
					<button v-if='tags[1] && tags[1].length > 0' id='showMoreTagsOnFooter' @click='showMoreTags()' class="btn btn-sm">
                        Показать все
                    </button>
					<div id='secondPartOfTagsOnFooter' class='d-none'>
					<li v-for='tag in tags[1]' class="ms-3">
						<nuxt-link :to='`/categories/${tag.slug}`' class="text-body text-decoration-none link-catalog">
							<span>&raquo {{tag.name}}</span>
						</nuxt-link>
					</li>
					</div>
					<button v-if='tags[1] && tags[1].length > 0' id='hideMoreTagsOnFooter' @click='hideMoreTags()' class="btn btn-sm d-none">
                        Скрыть лишнее
                    </button>
				</ul>
			</div>


		</div>
		
	</div>
    </footer>
</div>
</template>

<script>
import {mapGetters, mapActions, mapState} from 'vuex';
export default{
	methods:{
		...mapActions(['getAllTags']),
		showMoreTags(){
            const showbtn = document.getElementById('showMoreTagsOnFooter')
			const hidebtn = document.getElementById('hideMoreTagsOnFooter')
            const tags = document.getElementById('secondPartOfTagsOnFooter')
            
			showbtn.classList.add("d-none")
			hidebtn.classList.remove("d-none")
            tags.classList.remove("d-none")
        },
		hideMoreTags(){
            const showbtn = document.getElementById('showMoreTagsOnFooter')
			const hidebtn = document.getElementById('hideMoreTagsOnFooter')
            const tags = document.getElementById('secondPartOfTagsOnFooter')
            
			showbtn.classList.remove("d-none")
			hidebtn.classList.add("d-none")
            tags.classList.add("d-none")
        },
	},
	computed:{
		...mapState(['telegram', 'instagram', 'email']),
		...mapGetters(['tags']),
	},
	mounted(){
		this.getAllTags()
	}
}
</script>

<style>

</style>