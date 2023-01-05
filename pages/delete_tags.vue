<template>
<div>
    <Header title='Удаление категорий' />
    <div class='container'>
         <div class='text-end'>
            <button class='btn btn-light my-3' type='button' data-bs-toggle='modal' data-bs-target='#deleteTagsModal'>
                Удалить выбранное
            </button>
        </div>
        <div class='bg-white'>
            <table class='table table-hover delete-tags-table text-break'>
                <thead class='text-center'>
                    <tr>
                        <th style='min-width:50px;width:50px;max-width:50px'><i class="fa-regular fa-square-check fs-5 align-middle"></i></th>
                        <th style='min-width:95px' class='delete-tags-resize'>Название</th>
                        <th style='min-width:55px'>Слаг</th>
                        <th style='min-width:50px;width:50px;max-width:50px'><i class="fa-regular fa-trash-can fs-5 align-middle"></i></th>
                    </tr>
                </thead>
                <tbody>
                    <tr @click='checkTagBase(tag.slug, false)' v-for='tag in tags' :key='tag.slug' class='text-break delete-tag-hover'>
                        <td class='text-center align-middle'>
                            <input @click.stop='checkTagBase(tag.slug, true)' v-model='checkedTags' :value='tag' class='form-check-input' type='checkbox' :id='`tagCheckbox${tag.slug}`'>
                        </td>
                        <td>
                            {{tag.name}}
                        </td>
                        <td>
                            {{tag.slug}}
                        </td>
                        <td class='text-center align-middle'>
                            <a @click='deleteTag(tag.slug)' class='text-decoration-none delete-tag p-0'>
                                <i class="fa-solid fa-trash"></i>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>



        <!-- Modal del tags -->
        <div class="modal fade" id="deleteTagsModal" tabindex="-1" aria-labelledby="deleteTagsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="deleteTagsModalLabel">Удаление тегов</h1>
                        <button id='closeDeleteTagsModal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div v-if='checkedTags.length > 0' class="modal-body">
                        <p class='mb-0'>Вы уверены, что хотите удалить следующие теги?</p>
                        <div class="mb-2 all-tags">
                            <button class="btn btn-link" v-for='tag in checkedTags'>
                                <span class="badge text-bg-success">{{ tag.name }}</span>
                            </button>
                        </div>
                        <p class='mb-0'>Действие нельзя будет отменить</p>
                    </div>
                    <div v-else class="modal-body">
                        <p class='mb-0'>Вы не выбрали ни одного тега</p>
                    </div>
                    <div v-if='checkedTags.length > 0' class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отменить</button>
                        <button @click.stop.prevent='deleteTags()' type="button" class="btn btn-danger">Удалить</button>
                    </div>
                    <div v-else class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>



    </div>
</div>
</template>

<script>
import axios from 'axios';
import Header from '~/components/Header';
export default {
    components: {
        Header,
    },
    middleware: 'isSuperUser',
    data(){
        return{
            checkedTags: []
        }
    },
    async asyncData(ctx){
        let response = await axios.get(`${process.env.baseUrl}/api/tags`)
        return {
            tags: response.data
        }
    },
    methods: {
        checkTagBase(tagSlug, isInput){
            if (!isInput){
                this.checkTag(tagSlug)
            }
        },
        checkTag(tagSlug){
            let checkbox = document.getElementById(`tagCheckbox${tagSlug}`)
            checkbox.click()
        },
        async deleteTags(){
            try{
                for (let tag of this.checkedTags){
                    let response = await this.$axios.delete(`${process.env.baseUrl}/api/tag_del/${tag.slug}`)
                }
                let closeDeleteTagsModal = document.getElementById('closeDeleteTagsModal')
                closeDeleteTagsModal.click()
                
                this.$nuxt.refresh()
            } catch(err){
                console.log(err)
            }
        },
        async deleteTag(tagSlug){
            let checkbox = document.getElementById(`tagCheckbox${tagSlug}`)
            if(!checkbox.checked){
                checkbox.click()
            }
            try{
                let response = await this.$axios.delete(`${process.env.baseUrl}/api/tag_del/${tagSlug}`)
                this.$nuxt.refresh()
            } catch(err){
                console.log(err)
            }
        }
    }
}
</script>

<style scoped>

</style>