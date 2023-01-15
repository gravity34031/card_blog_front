<template>
<div>
<nav class="navbar navbar-expand-lg color">
		<div class="container-fluid d-flex">

				<div class="d-flex flex-row align-items-center">
						<a class="me-2 navbar-brand" :href='instagram.link' target="_blank">
                            <img src="/img/icons/instagram.png" width="30" height="30" alt="Инстаграм" title="Моя страница в инстаграм" />
                        </a>
						<a class="me-2 navbar-brand" :href='telegram.link' target="_blank">
                            <img src="/img/icons/telegram.png" width="30" height="30" alt="Телеграм" title="Моя страница в телеграм" />
                        </a>
						<nuxt-link to='/' class="navbar-brand" aria-current="page">Главная</nuxt-link>
				</div>

				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
						<div class="dropdown">
								<a class="navbar-brand dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
										Полезное
								</a>
								<ul class="dropdown-menu color">
										<nuxt-link to='/news' class="dropdown-item color-hover">Новости</nuxt-link>
										<nuxt-link to='/categories' class="dropdown-item color-hover">Категории</nuxt-link>
										<nuxt-link to='/review' class="dropdown-item color-hover">Отзывы</nuxt-link>
										<hr class="dropdown-divider">
										<nuxt-link to='/contact' class="dropdown-item color-hover">Обратная связь</nuxt-link>
								</ul>
						</div>
						<form class="d-flex mt-2 m-auto" role="search">
								<input v-if='!isSearchPage()' name='search' v-model='search' class="form-control me-2 pe-2" type="search" placeholder="Введите запрос" aria-label="Search">
								<button v-if='!isSearchPage()' @click.stop.prevent='submit_search()' class="btn btn-outline-success" type="submit">Поиск</button>
						</form>
						<div class="">
						<ul class="navbar-nav my-2 my-lg-0 ps-2">

							<li class="nav-item pe-2">
										<a :class="loggedIn ? 'nav-link py-0': 'nav-link'"><client-only>
											<a v-if='!loggedIn' @click='setErrorsOnNull()' class="text-decoration-none text-secondary pe-2" role="button" data-bs-toggle="modal" data-bs-target="#AuthorisationBackdrop">
												Авторизация
											</a></client-only>
										</a>
                                        <!-- Modal -->
                                        <div class="modal fade" id="AuthorisationBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="#AuthorisationBackdropLabel" aria-hidden="true">
                                            <div class="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h1 class="modal-title fs-5" id="AuthorisationBackdropLabel">Авторизация</h1>
                                                        <button @click='validationLoginReset()' id='closeLoginUser' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <Error :error='error'/>
                                                    <div class="modal-body">
                                                        <!-- AUTHORIZATION FORM -->
                                                        <form @submit.prevent='loginUser()'>

                                                            <h2 class="ps-4 pe-4 text-center">Пожалуйста, укажите логин и пароль</h2>
                                                            <div class="row mt-2 mx-2">
                                                                <label for="authUsername" class="form-label"></label>
                                                                <input v-model='login.username' @change='$v.login.username.$touch()' :class="'form-control' + ($v.login.username.$invalid&&$v.login.username.$dirty?' is-invalid':' ')" type="text" id="authUsername" placeholder="Имя пользователя">
                                                                <div class='invalid-feedback'>
                                                                    <span v-if='!$v.login.username.required'>
                                                                        {{validationMessages.requiredMessage}}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div class="row mt-2 mx-2">
                                                                <label for="authPassword1" class="form-label"></label>
                                                                <input v-model='login.password' @change='$v.login.password.$touch()' :class="'form-control' + ($v.login.password.$invalid&&$v.login.password.$dirty?' is-invalid':' ')" type="password" id="authPassword1" placeholder="Пароль">
                                                                <div class='invalid-feedback'>
                                                                    <span v-if='!$v.login.password.required'>
                                                                        {{validationMessages.requiredMessage}}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div class="row mt-3 mx-2">
                                                                <button :disabled='loginIsInvalid' type="submit" class="btn btn-primary btn-lg">Войти</button>
                                                            </div>
                                                        </form>
                                                        <!--  -->
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
							</li>


							<li class="nav-item">
									<a :class="loggedIn ? 'nav-link py-0' : 'nav-link'"><client-only>
										<a v-if='!loggedIn' @click='setErrorsOnNull()' class="text-decoration-none py-2 text-secondary pe-2" role="button" data-bs-toggle="modal" data-bs-target="#RegistrationBackdrop">
											Регистрация
										</a></client-only>
									</a>
                                    <!-- Modal -->
                                    <div class="modal fade" id="RegistrationBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="#RegistrationBackdropLabel" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="RegistrationBackdropLabel">Регистрация</h1>
                                                    <button @click='validationRegisterReset()' id='closeRegisterUser' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <Error :error='error'/>
                                                <div class="modal-body">
                                                    <!-- REGISTRATION FORM -->
                                                    <form @submit.prevent='registerUser()'>

                                                        <h2 class="ps-4 pe-4 text-center">Пожалуйста, укажите данные для регистрации</h2>

                                                        <div class="row mt-3 mx-2">
                                                            <label for="regFirstname" class="form-label"></label>
                                                            <input v-model='register.first_name' @change='$v.register.first_name.$touch()' :class="'form-control' + ($v.register.first_name.$invalid&&$v.register.first_name.$dirty?' is-invalid':' ')" type="text" id="regFirstname" placeholder="Имя">
                                                            <div class='invalid-feedback'>
                                                                <span v-if='!$v.register.first_name.maxLength'>
                                                                    {{validationMessages.maxLengthMessage}} {{$v.register.first_name.$params.maxLength.max}}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="row mt-2 mx-2">
                                                            <label for="regSecondname" class="form-label"></label>
                                                            <input v-model='register.last_name' @change='$v.register.last_name.$touch()' :class="'form-control' + ($v.register.last_name.$invalid&&$v.register.last_name.$dirty?' is-invalid':' ')" type="text" id="regSecondname" placeholder="Фамилия">
                                                            <div class='invalid-feedback'>
                                                                <span v-if='!$v.register.last_name.maxLength'>
                                                                    {{validationMessages.maxLengthMessage}} {{$v.register.last_name.$params.maxLength.max}}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="row mt-2 mx-2">
                                                            <label for="regUsername" class="form-label"></label>
                                                            <input v-model='register.username' @change='$v.register.username.$touch()' :class="'form-control' + ($v.register.username.$invalid&&$v.register.username.$dirty?' is-invalid':' ')" type="text" id="regUsername" placeholder="Имя пользователя">
                                                            <div class='invalid-feedback'>
                                                                <span v-if='!$v.register.username.maxLength'>
                                                                    {{validationMessages.maxLengthMessage}} {{$v.register.username.$params.maxLength.max}}
                                                                </span>
                                                                <span v-if='!$v.register.username.required'>
                                                                    {{validationMessages.requiredMessage}}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="row mt-2 mx-2">
                                                            <label for="regPassword1" class="form-label"></label>
                                                            <input v-model='register.password' @change='$v.register.password.$touch()' :class="'form-control' + ($v.register.password.$invalid&&$v.register.password.$dirty?' is-invalid':' ')" type="password" id="regPassword1" placeholder="Пароль">
                                                            <div class='invalid-feedback'>
                                                                <span v-if='!$v.register.password.minLength'>
                                                                    {{validationMessages.minLengthMessage}} {{$v.register.password.$params.minLength.min}}
                                                                </span>
                                                                <span v-if='!$v.register.password.required'>
                                                                    {{validationMessages.requiredMessage}}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="row mt-2 mx-2 position-relative">
                                                            <label for="regPassword2" class="form-label"></label>
                                                            <input v-model='register.password2' @change='$v.register.password2.$touch()' :class="'form-control' + ($v.register.password2.$invalid&&$v.register.password2.$dirty?' is-invalid':' ')" type="password" id="regPassword2" placeholder="Подтвердите пароль">
                                                            <div class='invalid-feedback'>
                                                                <span v-if='!$v.register.password2.required'>
                                                                    {{validationMessages.requiredMessage}}
                                                                </span>
                                                                <span v-if='!$v.register.password2.sameAsNewPassword'>
                                                                    {{validationMessages.sameAsPassword}}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="row mt-3 mx-2">
                                                            <button :disabled='registerIsInvalid' type="submit" class="btn btn-primary btn-lg">Зарегистрироваться</button>
                                                        </div>
                                                    </form>
                                                    <!--  -->
                                                </div>

                                            </div>
                                        </div>
                                    </div>
							</li>


							<li v-if='loggedIn' class="nav-item">
								<nuxt-link to='/profile' class="nav-link">
									Профиль {{user.username}}
									<!-- <img :src='`${backend_path}${user.avatar}`' width='20' height='20'> -->
								</nuxt-link>
							</li>
							<li v-if='loggedIn' class="nav-item">
								<button @click='logout()' class="nav-link btn btn-link">Выход</button>
							</li>
						</ul>
						</div>
				</div>

		</div>
</nav>
</div>
</template>

<script>
import {mapState} from 'vuex';
import {required, minLength, maxLength, sameAs} from 'vuelidate/lib/validators';
import Error from '~/components/Error';
export default {
    name: 'Navbar',
    components:{
        Error
    },
    data(){
        return {
            search : '',
			login: {
				username: '',
				password: ''
			},
			register: {
				first_name: '',
				last_name: '',
				username: '',
				password: '',
				password2: ''
			},
            error: null
        }
    },
    methods: {
        submit_search(){
            this.$router.push('/search?search='+this.search)
        },
		async loginUser(){
			try {
				let response = await this.$auth.loginWith('local', { data: this.login });
				this.error = null
                document.getElementById('closeLoginUser').click();
				//this.$router.back();
			}
			catch(err){
				this.error = 'Неправильное имя пользователя или пароль'
			}
		},
		async registerUser(){
			try {
				let response = await this.$axios.post(`${process.env.baseUrl}/api/register/`, {
					first_name: this.register.first_name,
					last_name: this.register.last_name,
					username: this.register.username, 
					password: this.register.password, 
					password2: this.register.password2
				});

				await this.$auth.loginWith('local', {
					data: {
						username: this.register.username,
						password: this.register.password
					}
				});
				this.error = null
				document.getElementById('closeRegisterUser').click();
			}
			catch(err){
				this.error = err.response.data
			}
		},
		async logout(){
			await this.$auth.logout()
		},
		isSearchPage(){
			return this.$route.path == '/search' || this.$route.path == '/search_news'
		},
        setErrorsOnNull(){
            this.error = null
        },
        validationLoginReset(){
            this.$v.login.$reset()
        },
        validationRegisterReset(){
            this.$v.register.$reset()
        }
    },
	computed: {
		...mapState(['instagram', 'telegram', 'validationMessages']),
		loggedIn(){
			return this.$auth.loggedIn
		},
		user(){
			return this.$auth.user
		},
        loginIsInvalid() {
            return this.$v.login.$invalid
        },
        registerIsInvalid() {
            return this.$v.register.$invalid
        }
	},
    validations: {
        login: {
            username: {
                required
            },
            password: {
                required
            }
        },
        register: {
            first_name: {
                maxLength: maxLength(15)
            },
            last_name: {
                maxLength: maxLength(25)
            },
            username: {
                required,
                maxLength: maxLength(30)
            },
            password: {
                required,
                minLength: minLength(8)
            },
            password2: {
                required,
                sameAsPassword: sameAs('password')
            }
        },
    }
}
</script>

<style scoped>
</style