export const state = () => ({
    likeImg : '/img/icons/like.png',
    likeDisabledImg : '/img/icons/like-disabled.png',

    tags: '',
    asideBlog: [],
    asideNews: [],
    
    instagram: {
        link: 'https://www.instagram.com',
        nickname: 'ник в инстаграме'
    },
    telegram: {
        link: 'https://telegram.org',
        nickname: 'ник в телеграме'
    },
    email: 'gravity2507@gmail.com',

    validationMessages: {
        requiredMessage: 'Поле обязательно для заполнения',
        minLengthMessage: 'Минимальное количество символов:',
        maxLengthMessage: 'Максимальное количество символов:',
        maxValueMessage: 'Максимальное число:',
        minValueMessage: 'Минимальное число:',
        emailMessage: 'Некорректный адрес электронной почты',
        sameAsPassword: 'Пароли не совпадают'
    }
    
})



export const getters = {
    /* ASIDE */
    tags(state){
        let tagsNew = []
        tagsNew[0] = state.tags.slice(0, 6)
        tagsNew[1] = state.tags.slice(6)
        return tagsNew
    },
    asideBlog(state){
        return state.asideBlog
    },
    asideNews(state){
        return state.asideNews
    },
}



export const mutations = {
    /* LIKE */

    /* ASIDE */
    UPDATE_TAGS(state, tags){
        state.tags = tags
    },
    UPDATE_ASIDE_BLOG(state, asideBlog){
        state.asideBlog = asideBlog
    },
    UPDATE_ASIDE_NEWS(state, asideNews){
        state.asideNews = asideNews
    },
}



export const actions = {
    async likePost({commit, dispatch, state}, data){
        if (!data.user){
            return undefined
        }
        const currentUser = data.user
        const post = data.post
        const post_slug = data.post.slug
        const likeImg = document.getElementById(`like${post_slug}`)
        if (likeImg.src.split('/').slice(-1)[0] == state.likeDisabledImg.split('/')[3]){
            likeImg.src = state.likeImg
        } else {
            likeImg.src = state.likeDisabledImg
        }
        const axios = this.$axios
        const dataBack = {'slug': post_slug}

        async function like(){
            let postIsLiked = false
            for (let u of post.favourite){
                if (currentUser.username == u.username){
                    postIsLiked = true
                }
            }

            if (postIsLiked && likeImg.src.split('/').slice(-1)[0] == state.likeDisabledImg.split('/')[3]){
                // dislike
                try {
                    const response = await axios.delete(`${process.env.baseUrl}/api/favourite/`, {'data': dataBack});
                    //console.log(response)
                } catch (err) {
                    console.log(err.response)
                }
                data.refreshNuxt()
                likeImg.removeAttribute('touched')
                return undefined
            } else if (!postIsLiked && likeImg.src.split('/').slice(-1)[0] != state.likeImg.split('/')[2]){
                // like
                try {
                    const response = await axios.post(`${process.env.baseUrl}/api/favourite/`, dataBack);
                    //console.log(response)
                } catch(err) {
                    console.log(err.response)
                }
                data.refreshNuxt()
                likeImg.removeAttribute('touched')
                return undefined
            }
            setTimeout(like, 1000)
        }
        if (!likeImg.getAttribute('touched')){
            like()
        }

        likeImg.setAttribute('touched', true)
    },


    /* ASIDE */
    async getAside({commit}){
        const tags = await this.$axios.get(`${process.env.baseUrl}/api/tags/`)
        const asideBlog = await this.$axios.get(`${process.env.baseUrl}/api/aside-blog/`)
        const asideNews = await this.$axios.get(`${process.env.baseUrl}/api/aside-news/`)

        commit('UPDATE_TAGS', tags.data)
        commit('UPDATE_ASIDE_BLOG', asideBlog.data)
        commit('UPDATE_ASIDE_NEWS', asideNews.data)
    },


    /* TAGS */
    async getAllTags({commit}){
        const tags = await this.$axios.get(`${process.env.baseUrl}/api/tags/`)
        commit('UPDATE_TAGS', tags.data)
    },
}