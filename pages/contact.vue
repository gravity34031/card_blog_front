<template>
<div>
    <Header title='Контакты' />

    <div class="modal fade" id="loadingModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="loadingModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-fullscreen justify-content-center">
            <div class=''>
                <div class="spinner-border text-primary" style="width:3rem; height:3rem" role="status">
                    <span class="visually-hidden">Загрузка...</span>
                </div>
            </div>
        </div>
    </div>

    <div class="container-fluid pt-4 pb-2 mb-2 bg-color">
        <div class="container">
                
            <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb">
                <ol class="breadcrumb breadcrumb-color rounded">
                    <li class="breadcrumb-item"><nuxt-link to='/'>Главная</nuxt-link></li>
                    <li class="breadcrumb-item active" aria-current="page">Контакты</li>
                </ol>
            </nav>


            <div>
                <span class='lead'>
                    Вы можете связаться со мной, написав:
                </span>
                <ul class='list-unstyled ms-3 mt-3'>
                    <li>В инстаграме: <a :href='instagram.link' target='_blank'>{{instagram.nickname}}</a></li>
                    <hr class='my-2'>
                    <li>В телеграме: <a :href='telegram.link' target='_blank'>{{telegram.nickname}}</a></li>
                    <hr class='my-2'>
                    <li>На почту: {{email}}</li>
                    <hr class='my-2'>
                    <li>ИЛИ заполнить бланк ниже, чтобы отправить письмо:</li>
                </ul>
            </div>

            <Error :error='error'/>

            <div v-if='user' class="mb-5">
                <form>
                    
                    <div class="form-floating mt-3">
                        <input v-model='contact.name' @change='$v.contact.name.$touch()' :class="'form-control' + ($v.contact.name.$invalid&&$v.contact.name.$dirty?' is-invalid':' ')" type="text" id="contactName" placeholder="Ваше имя">
                        <label for="contactName">Имя</label>
                        <div class='invalid-feedback'>
                            <span v-if='!$v.contact.name.minLength'>
                                {{validationMessages.minLengthMessage}} {{$v.contact.name.$params.minLength.min}}
                            </span>
                            <span v-if='!$v.contact.name.maxLength'>
                                {{validationMessages.maxLengthMessage}} {{$v.contact.name.$params.maxLength.max}}
                            </span>
                            <span v-if='!$v.contact.name.required'>
                                {{validationMessages.requiredMessage}}
                            </span>
                        </div>
                    </div>

                    <div class="form-floating mt-3">
                        <input v-model='contact.email' @change='$v.contact.email.$touch()' :class="'form-control' + ($v.contact.email.$invalid&&$v.contact.email.$dirty?' is-invalid':' ')" type="email" id="contactEmail" placeholder="Ваша почта">
                        <label for="contactEmail">Электронная почта</label>
                        <div class='invalid-feedback'>
                            <span v-if='!$v.contact.email.email'>
                                {{validationMessages.emailMessage}}
                            </span>
                            <span v-if='!$v.contact.email.required'>
                                {{validationMessages.requiredMessage}}
                            </span>
                            <span v-if='!$v.contact.email.maxLength'>
                                {{validationMessages.maxLengthMessage}} {{$v.contact.email.$params.maxLength.max}}
                            </span>
                        </div>
                    </div>

                    <div class="form-floating mt-3">
                        <input v-model='contact.subject' @change='$v.contact.subject.$touch()' :class="'form-control' + ($v.contact.subject.$invalid&&$v.contact.subject.$dirty?' is-invalid':' ')" type="text" id="contactSubject" placeholder="Тема вашего письма">
                        <label for="contactSubject">Тема письма</label>
                        <div class='invalid-feedback'>
                            <span v-if='!$v.contact.subject.minLength'>
                                {{validationMessages.minLengthMessage}} {{$v.contact.subject.$params.minLength.min}}
                            </span>
                            <span v-if='!$v.contact.subject.required'>
                                {{validationMessages.requiredMessage}}
                            </span>
                        </div>
                    </div>

                    <div class="form-floating mt-3">
                        <input v-model='contact.message' @change='$v.contact.message.$touch()' :class="'form-control' + ($v.contact.message.$invalid&&$v.contact.message.$dirty?' is-invalid':' ')" type="text" id="contactMessage" placeholder="Ваше сообщение">
                        <label for="contactMessage">Сообщение</label>
                        <div class='invalid-feedback'>
                            <span v-if='!$v.contact.message.minLength'>
                                {{validationMessages.minLengthMessage}} {{$v.contact.message.$params.minLength.min}}
                            </span>
                            <span v-if='!$v.contact.message.required'>
                                {{validationMessages.requiredMessage}}
                            </span>
                        </div>
                    </div>

                    <div class="d-grid d-md-block mt-3 text-end">
                        <button @click.stop.prevent='sendEmail(), setErrorsOnNull()' :disabled='contactIsInvalid' type="submit" class="btn btn-primary btn-lg">Отправить</button>
                    </div>
                </form>
            </div>
            <div v-else class='card-text mb-5'>
                Зарегистрируйтесь или авторизуйтесь, чтобы отправить письмо
            </div>

        </div>
    </div>


    <!-- SUCCESS -->
    <div class="modal fade" id="contactSuccess" tabindex="-1" aria-labelledby="contactSuccessLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="contactSuccessLabel">Контакт</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p class='fs-5 mb-0'>Письмо успешно отправлено!</p>
                <small class="text-muted">Для закрытия нажмите в любой части экрана или на крестик.</small>
            </div>

            </div>
        </div>
    </div>


</div>
</template>

<script>
import {mapState} from 'vuex';
import {required, minLength, maxLength, email} from 'vuelidate/lib/validators';
import Header from '~/components/Header';
import Error from '~/components/Error';
export default {
    components:{
        Header,
        Error
    },
    data(){
        return{
            contact: {
                name: null,
                email: null,
                subject: null,
                message: null
            },
            error: null,
            isLoading: false
        }
    },
    methods:{
        async sendEmail(){
            const loadingModal = new bootstrap.Modal('#loadingModal')
            loadingModal.show()
            /* set contact user name & email if blank*/
			if (this.user&&!this.contact.name){
				this.contact.name = this.user.first_name + (this.user.first_name?' ':'') + this.user.last_name
			}
			if (this.user&&!this.contact.email){
				this.contact.email = this.user.email
			}

            try{
                const response = await this.$axios.post(`${process.env.baseUrl}/api/contact/`, this.contact)
                
                /* modal window */
                const modalReviewSuccess = new bootstrap.Modal('#contactSuccess')
                loadingModal.hide()
                modalReviewSuccess.show()

            } catch(err){
                this.error = err.response.data
            }
        },
        setErrorsOnNull(){
            this.error = null
        }
    },
    computed:{
        ...mapState(['telegram', 'instagram', 'email', 'validationMessages']),
        user(){
			return this.$auth.user
		},
        contactIsInvalid(){
            return this.$v.contact.$invalid
        }
    },
	created(){
		if (this.user){
		    this.contact.name = this.user.first_name + (this.user.first_name?' ':'') + this.user.last_name
		    this.contact.email = this.user.email
		}
	},
    validations: {
        contact: {
            name: {
                required,
                minLength: minLength(2),
                maxLength: maxLength(50)
            },
            email: {
                required,
                email,
                maxLength: maxLength(200)
            },
            subject: {
                required,
                minLength: minLength(4),
            },
            message: {
                required,
                minLength: minLength(6),
            }
        },
    },
}
</script>

<style scoped>

</style>