<template>
<div class='mb-5'>
    <div class="card mt-3">
        <h5 class="card-header">Прокомментируй:</h5>
        <div class="card-body">
            <form v-if='user' @submit.prevent='addComment()'>
                <div class="mb-3 form-floating">
                    <textarea v-model='new_comment' @change='$v.new_comment.$touch()' :class="'form-control' + ($v.new_comment.$invalid&&$v.new_comment.$dirty?' is-invalid':' ')" id="exampleFormControlTextarea1" style='height:100px' placeholder="Оставьте комментарий"></textarea>
                    <label for="exampleFormControlTextarea1" class="form-label">Оставьте свой комментарий</label>
                    <div class='invalid-feedback'>
                        <span v-if='!$v.new_comment.required'>
                            {{validationMessages.requiredMessage}}
                        </span>
                    </div>
                </div>
                <button :disabled='newCommentIsInvalid' class="btn btn-primary">Отправить</button>
            </form>
            <div v-else class='card-text'>
                Зарегистрируйтесь или авторизуйтесь, чтобы оставить комментарий
            </div>
        </div>
    </div>
    <div v-if='comments && comments.length' class="mt-4 border rounded-4 bg-white px-3 py-2">
        <div v-for='comment in comments' :key='comment.id' class='text-wrap text-break comment-hover'>
            <div class='mb-2 d-flex align-items-center'>
                <img :src="`${back_path}${comment.author.avatar}`" class="me-3 border rounded-circle d-sm-block" height="45px" width="45px" alt="Аватар">
                <div class='d-block d-sm-flex justify-content-between w-100'>
                    <div>
                        <h5 class='mb-0 text-wrap text-break'>{{comment.author.username}}</h5>
                        <small class='lh-1 text-wrap text-break'>{{comment.author.first_name}} {{comment.author.last_name}}</small>
                    </div>
                    <small>{{transformTime(comment.created_at)}}</small>
                </div>
            </div>
            <span :id='`commentContent${comment.id}`' class=''>
                <span style='white-space: pre-line'>{{sliceComment(comment.content)[0]}}<span :id='`comment${comment.id}`' class='d-none'>{{sliceComment(comment.content)[1]}}</span></span>
                <p v-if='sliceComment(comment.content)[1]' class='mb-0'>
                    <a :id='`link${comment.id}`' @click='showFullComment(comment.id)' class="comment-link">
                        Показать полностью
                    </a>
                </p>
            </span>
            <!-- EDITCOMMENT -->
            <div :id='`editCommentForm${comment.id}`' class='d-none'>
                <textarea :value='comment.content' :id='`editInput${comment.id}`' class="form-control"></textarea>
                <div class='text-end mb-1'>
                    <button @click.stop.prevent='editCommentBack(comment.id)' class="btn btn-sm btn-primary mt-2">Сохранить</button>
                </div>
            </div>
            <div v-if='user' class='text-end'>
                <a v-if='comment.author.username == user.username' @click='editComment(comment.id)' class='text-decoration-none editComment p-0 me-2'>
                    <i class="fa-solid fa-pen"></i>
                </a>
                <a v-if='comment.author.username == user.username || user.is_superuser' type='button' data-bs-toggle='modal' data-bs-target='#deleteCommentModal' :data-bs-commentId='comment.id' class='text-decoration-none deleteComment p-0'>
                    <i class="fa-solid fa-trash" data-bs-toggle='tooltip' data-bs-title='Удалить комментарий'></i>
                </a>
            </div>
            <hr v-if='comment != comments[comments.length-1]' class='mt-2'>
        </div>
    </div>


    <!-- Modal del comment -->
    <div class="modal fade" id="deleteCommentModal" tabindex="-1" aria-labelledby="deleteCommentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="deleteCommentModalLabel">Удаление комментария</h1>
                <button id='closeDeleteCommentModal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p class='mb-0'>Вы уверены, что хотите удалить комментарий?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отменить</button>
                <button @click.stop.prevent='deleteComment(commentId)' type="button" class="btn btn-danger">Удалить</button>
            </div>
            </div>
        </div>
    </div>

    <!-- ANOTHER VAR OF COMMENTS <div v-for='comment in comments' :key='comment.id' class="mt-3 border rounded-4 bg-white px-3 py-2">
        <div class='mb-2 d-flex align-items-center'>
            <img :src="`${back_path}${comment.author.avatar}`" class="me-3 border rounded-circle d-sm-block" height="45px" width="45px" alt="Аватар">
            <div class="d-flex flex-column text-wrap text-break w-100">
                <div class="d-flex justify-content-between align-items-center">
                    <h5>{{comment.author.username}}</h5>
                    <small>{{transformTime(comment.created_at)}}</small>
                </div>
            </div>
        </div>
        {{comment.content}}
    </div> -->
</div>
</template>

<script>
import {mapState} from 'vuex';
import {required} from 'vuelidate/lib/validators';
export default {
    props:['post_blog_slug', 'news_blog_slug', 'user', 'comments'],
    data(){
        return{
            new_comment: null,
            back_path: null,
            commentId: null,
            editCommentValue: null,
        }
    },
    //async created get all comments
    created(){
        this.back_path = process.env.baseUrl 
    },
    methods:{
        async addComment(){
            try{
                if (this.post_blog_slug){
                    let response = await this.$axios.post(`${process.env.baseUrl}/api/comments/`, {
                        post_blog: this.post_blog_slug,
                        content: this.new_comment,
                    })
                }
                if (this.news_blog_slug){
                    let response = await this.$axios.post(`${process.env.baseUrl}/api/comments/`, {
                    post_news: this.news_blog_slug,
                    content: this.new_comment,
                    })
                    //console.log(response)
                }
                this.new_comment = null
                this.$v.new_comment.$reset()
                this.$nuxt.refresh()
            } catch(err){
                console.log(err)
            }
        },
        async editComment(commentId){
            const textarea = document.getElementById(`editInput${commentId}`)
            let editCommentForm = document.getElementById(`editCommentForm${commentId}`)
            let commentContent = document.getElementById(`commentContent${commentId}`)
            if (commentContent.classList.value.includes('d-none')){
                editCommentForm.classList.add('d-none')
                commentContent.classList.remove('d-none')
            } else{
                editCommentForm.classList.remove('d-none')
                commentContent.classList.add('d-none')
            }
            textarea.dispatchEvent(new Event('input'));
        },
        async editCommentBack(commentId){
            try{
                let content = document.getElementById(`editInput${commentId}`).value
                
                let response = await this.$axios.put(`${process.env.baseUrl}/api/comments/`, {
                    id: commentId,
                    content: content
                })
            } catch(err){
                //console.log(err.response)
            }
            this.$nuxt.refresh()
            this.editComment(commentId)
        },
        async deleteComment(commentId){
            try{
                const closeDeleteComment = document.getElementById('closeDeleteCommentModal')
                closeDeleteComment.click()
                let response = await this.$axios.delete(`${process.env.baseUrl}/api/comments/`, {
                    data:{
                        id: commentId
                    }
                })
                this.$nuxt.refresh()
            } catch(err){
                //console.log(err.response)
            }
        },
        transformTime(time){
			let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
			let date = new Date(time)
			let datePlusUTC = date.toLocaleString('ru-RU', { timeZone: userTimezone })
			return datePlusUTC.substr(0, datePlusUTC.length - 3)
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
        }
    },
    mounted(){
        const deleteCommentModal = document.getElementById('deleteCommentModal')
        deleteCommentModal.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget
            const commentId = button.getAttribute('data-bs-commentId')
            this.commentId = commentId
        })

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
    computed: {
        ...mapState(['validationMessages']),
        newCommentIsInvalid(){
            return this.$v.new_comment.$invalid
        }
    },
    validations: {
        new_comment: {
            required
        }
    }
}
</script>

<style scoped>
    
</style>
