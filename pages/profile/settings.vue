<template>
<div>

    <Header title='Настройки профиля' />


    <div class="container-fluid pt-4 pb-2 mb-3 bg-color">
        <div class="container">

            <!-- BREADCRUMBS -->
            <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb">
                <ol class="breadcrumb breadcrumb-color rounded">
                    <li class="breadcrumb-item"><nuxt-link to='/'>Главная</nuxt-link></li>
                    <li class="breadcrumb-item"><nuxt-link to='/profile'>Профиль</nuxt-link></li>
                    <li class="breadcrumb-item active">Настройки</li>
                    
                </ol> 
            </nav>


            <!-- AVATAR -->
            <div class="card shadow">
                <div v-if='user' class="position-relative d-flex flex-column align-items-center mx-auto my-3 text-wrap text-break px-3">
                    <a @click='setErrorsAvatarOnNull()' class='avatar-link-hover' type="button" data-bs-toggle="modal" data-bs-target="#changeAvatarModal">
                        <img :src="`${back_path}${user.avatar}`" class="rounded-circle" height="200px" width="200px" alt="Аватар">
                        <div class='avatar-link position-absolute rounded-circle top-0 d-flex align-items-center justify-content-center' style='height: 200px; width:200px'>
                            <span class='text-white fs-4'>Изменить аватар</span>
                        </div>
                    </a>
                    <h5 class="mt-3">{{user.username}}</h5>
                    <small>{{user.first_name}} {{user.last_name}}</small>
                </div>
                <div v-else class="d-flex justify-content-center">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>
            </div>



            <!-- CHANGE AVATAR MODAL -->
            <div class="modal fade" id="changeAvatarModal" tabindex="-1" aria-labelledby="changeAvatarModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered modal-fullscreen-sm-down">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="changeAvatarModalLabel">Аватар</h1>
                            <button id='closeChangeAvatarModel' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <Error :error='errorChangeAvatar' />
                        <div class="modal-body">
                            <div class="input-group mt-2 mb-2">
                                <input @change='onImageChange' class="form-control" type="file" accept='.png, .jpeg, .jpg' id="inputAvatar">
                            </div>
                            <div class='text-center'>
                                <p class='lead mb-2 fs-5'>Ваш аватар будет выглядеть так:</p>
                                <img :src="avatarPreviewUrl" class="rounded-circle" style='object-fit: cover' height="250px" width="250px" alt="Аватар">
                            </div>
                        </div>
                        <div class='modal-footer'>
                            <button @click.stop.prevent='changeAvatar()' class="btn btn-primary" type="button" id="inputAvatarConfirm">Сохранить</button>
                        </div>
                    </div>
                </div>
            </div>



            <!-- SETTINGS -->
            <div class="card shadow mt-4">
                <div class="container pt-3 pb-3">

                <Error :error='error' class='mb-3 col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3 col-xxl-2'/>

                <form>
                    <div class="mb-3 col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3 col-xxl-2 form-floating">
                        <input v-model='profile.first_name' @change='$v.profile.first_name.$touch()' :class="'form-control form-control-lg' + ($v.profile.first_name.$invalid&&$v.profile.first_name.$dirty?' is-invalid':' ')" type="text" id="inputFirstname" placeholder="Имя">
                        <label for="inputFirstname" class="form-label">Имя</label>
                        <div class='invalid-feedback'>
                            <span v-if='!$v.profile.first_name.maxLength'>
                                {{validationMessages.maxLengthMessage}} {{$v.profile.first_name.$params.maxLength.max}}
                            </span>
                        </div>
                    </div>
                    <div class="mb-3 col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3 col-xxl-2 form-floating">
                        <input v-model='profile.last_name' @change='$v.profile.last_name.$touch()' :class="'form-control form-control-lg' + ($v.profile.last_name.$invalid&&$v.profile.last_name.$dirty?' is-invalid':' ')" type="text" id="inputSecondname" placeholder="Фамилия">
                        <label for="inputSecondname" class="form-label">Фамилия</label>
                        <div class='invalid-feedback'>
                            <span v-if='!$v.profile.last_name.maxLength'>
                                {{validationMessages.maxLengthMessage}} {{$v.profile.last_name.$params.maxLength.max}}
                            </span>
                        </div>
                    </div>
                    <div class="mb-3 col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3 col-xxl-2 form-floating">
                        <input v-model='profile.email' @change='$v.profile.email.$touch()' :class="'form-control form-control-lg' + ($v.profile.email.$invalid&&$v.profile.email.$dirty?' is-invalid':' ')" type="email" id="inputEmail" placeholder="e-mail">
                        <label for="inputEmail" class="form-label">Электронная почта</label>
                        <div class='invalid-feedback'>
                            <span v-if='!$v.profile.email.email'>
                                {{validationMessages.emailMessage}}
                            </span>
                        </div>
                    </div>
                    <div class="d-grid d-sm-block">
                        <button @click.stop.prevent='editProfile(), setErrorsOnNull()' :disabled='profileIsInvalid' type="submit" class="btn btn-primary">Сохранить</button>
                    </div>
                    <div class="mb-3 col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3 col-xxl-2 form-floating">
                        <input readonly v-model='profile.username' type="text" class="form-control-plaintext form-control-lg" id="inputUsername" placeholder="Имя пользователя">
                        <label for="inputUsername" class="form-label">Имя пользователя (изменять нельзя)</label>
                    </div>
                </form>




                <!-- CHANGE PASSWORD -->
                <a class="nav-link pt-0 mt-2" >
                    <a class="text-decoration-none pe-2" role="button" data-bs-toggle="modal" data-bs-target="#ChangePasswordBackdrop">
                    Сменить пароль
                    </a>
                    <!-- Modal -->
                    <div class="modal fade" id="ChangePasswordBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="#ChangePasswordBackdropLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="ChangePasswordBackdropLabel">Изменение пароля</h1>
                                    <button id='closeChangePasswordBackdrop' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <Error :error='errorChangePassword' />
                                <div class="modal-body">
                                    <!-- CHANGE PASSWORD FORM -->
                                    <form @submit.stop.prevent='changeProfilePassword()'>

                                        <h3 class="ps-4 pe-4 mt-2 text-center">Введите текущий пароль</h3>

                                        <div class="row mt-2 mx-2">
                                            <label for="CurrentPassword" class="form-label"></label>
                                            <input v-model='changePassword.old_password' @change='$v.changePassword.old_password.$touch()' :class="'form-control' + ($v.changePassword.old_password.$invalid&&$v.changePassword.old_password.$dirty?' is-invalid':' ')" type="password" id="CurrentPassword" placeholder="Текущий пароль">
                                            <div class='invalid-feedback'>
                                                <span v-if='!$v.changePassword.old_password.required'>
                                                    {{validationMessages.requiredMessage}}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 class="ps-4 pe-4 mt-4 text-center">Введите новый пароль</h3>

                                        <div class="row mt-2 mx-2">
                                            <label for="NewPassword1" class="form-label"></label>
                                            <input v-model='changePassword.new_password' @change='$v.changePassword.new_password.$touch()' :class="'form-control' + ($v.changePassword.new_password.$invalid&&$v.changePassword.new_password.$dirty?' is-invalid':' ')" type="password" id="NewPassword1" placeholder="Новый пароль">
                                            <div class='invalid-feedback'>
                                                <span v-if='!$v.changePassword.new_password.maxLength'>
                                                    {{validationMessages.maxLengthMessage}} {{$v.changePassword.new_password.$params.maxLength.max}}
                                                </span>
                                                <span v-if='!$v.changePassword.new_password.minLength'>
                                                    {{validationMessages.minLengthMessage}} {{$v.changePassword.new_password.$params.minLength.min}}
                                                </span>
                                                <span v-if='!$v.changePassword.new_password.required'>
                                                    {{validationMessages.requiredMessage}}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="row mt-2 mx-2">
                                            <label for="NewPassword2" class="form-label"></label>
                                            <input v-model='changePassword.new_password2' @change='$v.changePassword.new_password2.$touch()' :class="'form-control' + ($v.changePassword.new_password2.$invalid&&$v.changePassword.new_password2.$dirty?' is-invalid':' ')" type="password" id="NewPassword2" placeholder="Подтвердите новый пароль">
                                            <div class='invalid-feedback'>
                                                <span v-if='!$v.changePassword.new_password2.maxLength'>
                                                    {{validationMessages.maxLengthMessage}} {{$v.changePassword.new_password2.$params.maxLength.max}}
                                                </span>
                                                <span v-if='!$v.changePassword.new_password2.required'>
                                                    {{validationMessages.requiredMessage}}
                                                </span>
                                                <span v-if='!$v.changePassword.new_password2.sameAsNewPassword'>
                                                    {{validationMessages.sameAsPassword}}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="row mt-3 mx-2">
                                            <button :disabled='changePasswordIsInvalid' type="submit" class="btn btn-primary btn-lg">Сменить пароль</button>
                                        </div>
                                    </form>

                                </div>
                    
                            </div>
                        </div>
                    </div>

                </a>


                <!-- CHANGE PASSWORD SUCCESS -->
                <div class="modal fade" id="ChangePasswordSuccess" tabindex="-1" aria-labelledby="#ChangePasswordSuccessLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="ChangePasswordSuccessLabel">Изменение пароля</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p>Пароль успешно изменён.</p>
                            </div>
                        </div>
                    </div>
                </div>



                <div class="breadcrumb-color pt-3 pb-1 mt-3 rounded">
                    <p class="text-center">Дата регистрации: <span class="fw-semibold">{{transformTime(user.date_joined)}}</span></p>
                </div> 



                <button type="button" class="btn btn-danger btn-sm mt-3" data-bs-toggle="modal" data-bs-target="#deleteProfileModal">
                    удалить профиль
                </button>
                <!-- profile delete modale -->
                <div class="modal fade" id="deleteProfileModal" tabindex="-1" aria-labelledby="deleteProfileModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-fullscreen-sm-down">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="deleteProfileModalLabel">Удалить профиль</h1>
                            <button id='closeDeleteProfileModal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>Внимание! Удаление профиля так же удалит всю информацию, включая оставленные комментарии, отзывы, избранные работы.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary btn-light btn-lg" data-bs-dismiss="modal"><span class="fs-6">Отменить</span></button>
                            <button type="button" class="btn btn-danger btn-lg" data-bs-target='#confirmDeleteProfileModal' data-bs-toggle='modal'><span class="fs-6">Продолжить удаление</span></button>
                        </div>
                    </div>
                    </div>
                </div>

                <!-- CONFIRM profile delete modal -->
                <div class="modal fade" id="confirmDeleteProfileModal" tabindex="-1" aria-labelledby="confirmDeleteProfileModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-fullscreen-sm-down">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="confirmDeleteProfileModalLabel">Удалить профиль</h1>
                            <button id='closeConfirmDeleteProfileModalLabel' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p id='paragraphDeleteProfileModal'>Вы уверены, что хотите удалить профиль? Действие нельзя будет отменить.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary btn-light btn-lg" data-bs-dismiss="modal"><span class="fs-6">Не удалять</span></button>
                            <button @click.stop.prevent='deleteProfile()' type="button" class="btn btn-danger btn-lg"><span class="fs-6">Удалить профиль</span></button>
                        </div>
                    </div>
                    </div>
                </div>



                </div>
            </div>


        </div>
    </div>

</div>
</template>

<script>
import axios from 'axios';
import {mapState} from 'vuex';
import {required, minLength, maxLength, email, sameAs} from 'vuelidate/lib/validators';
import Header from '~/components/Header';
import Error from '~/components/Error';
export default {
    components: {
        Header,
        Error
    },
    middleware: 'anonymRedirect',
    data() {
        return {
            back_path: null,
            avatar: null,
            file: null,
            avatarPreviewUrl: '/img/load_avatar.jpg',
            profile: {
                first_name: null,
                last_name: null,
                username: null,
                email: null,
            },
            changePassword: {
                old_password: null,
                new_password: null,
                new_password2: null
            },
            error: null,
            errorChangePassword: null,
            errorChangeAvatar: null,
        }
    },
    created(){
        this.back_path = process.env.baseUrl;
        if (this.user){
            this.profile = {
                first_name: this.user.first_name,
                last_name: this.user.last_name,
                username: this.user.username,
                email: this.user.email,
            }
        }
    },
    methods:{
        async editProfile(){
            try{
                const response = await this.$axios.put(`${process.env.baseUrl}/api/profile/`, this.profile)
                
                const userToUpdate = {...this.$auth.user}
                userToUpdate.first_name = response.data.user.first_name
                userToUpdate.last_name = response.data.user.last_name
                userToUpdate.email = response.data.user.email
                this.$auth.setUser(userToUpdate)
            } catch(err){
                this.error = err.response.data
            }
        },
        onImageChange(e){
            const file = e.target.files[0]
            this.file = file
            if (file){
                this.avatarPreviewUrl = URL.createObjectURL(file)
                this.setErrorsAvatarOnNull()
            } else{
                this.avatarPreviewUrl = '/img/load_avatar.jpg'
            }

            let formData = new FormData()
            formData.append('avatar', file)
            this.avatar = formData
        },
        async changeAvatar(){
            try{
                if(this.file){
                const response = await this.$axios.put(`${process.env.baseUrl}/api/profile/`, this.avatar)
                
                document.getElementById('closeChangeAvatarModel').click()
                /* const userToUpdate = {...this.$auth.user}
                userToUpdate.avatar = response.data.user.avatar
                this.back_path = ''
                this.$auth.setUser(userToUpdate) */
                
                const userToUpdate = {...this.$auth.user}
                let avatar = response.data.user.avatar
                userToUpdate.avatar = '/' + avatar.split('/').slice(3).join('/')
                this.$auth.setUser(userToUpdate)    
                } else{
                    this.errorChangeAvatar = 'Изображение не выбрано'
                }
            } catch(err){
                this.errorChangeAvatar = err.response.data
            }
        },
        async changeProfilePassword(){
            try{
                console.log(this.changePassword.old_password)
                const response = await this.$axios.put(`${process.env.baseUrl}/api/change_password/`, this.changePassword)
                console.log(response)

                document.getElementById('closeChangePasswordBackdrop').click()
        
                const modalChangePasswordSuccess = new bootstrap.Modal('#ChangePasswordSuccess')
                modalChangePasswordSuccess.show()

            } catch(err){
                this.errorChangePassword = err.response.data
            }
        },
        async deleteProfile(){
            try {
                let token = this.$auth.strategy.token.get()
                await this.$auth.logout()
                const response = await this.$axios.delete(`${process.env.baseUrl}/api/profile/`, {
                    headers: {
                        Authorization: token
                }})
                document.getElementById('closeConfirmDeleteProfileModalLabel').click()
            } catch(err){
                console.log(err)
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
        setErrorsAvatarOnNull(){
            this.errorChangeAvatar = null
        }
    },
    computed:{
        ...mapState(['validationMessages']),
        user(){
            return this.$auth.user
        },
        profileIsInvalid(){
            return this.$v.profile.$invalid
        },
        changePasswordIsInvalid(){
            return this.$v.changePassword.$invalid
        }
    },
    validations:{
        profile: {
            first_name: {
                maxLength: maxLength(15)
            },
            last_name: {
                maxLength: maxLength(25)
            },
            email: {
                email
            },
        },
        changePassword: {
            old_password: {
                required
            },
            new_password: {
                required,
                minLength: minLength(8),
                maxLength: maxLength(128)
            },
            new_password2: {
                required,
                maxLength: maxLength(128),
                sameAsNewPassword: sameAs('new_password')
            },
        },
    }
}
</script>

<style scoped>

</style>