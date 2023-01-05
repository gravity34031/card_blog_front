export const state = () => ({
    postIsLiked: false,
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
    CHANGE_POST_IS_LIKED(state, liked){
        state.postIsLiked = liked
    },

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
    /* LIKE */
    async likePost({commit, dispatch, state}, data){
        let refreshNuxt = data.refreshNuxt
        let post_slug = data.post_slug
        let post = await this.$axios.get(`${process.env.baseUrl}/api/blog_posts/${post_slug}`)
        post = post.data

        try {
            dispatch('isPostLiked', post)
            let data = {'slug': post.slug};
            if (state.postIsLiked){
                const response = await this.$axios.delete(`${process.env.baseUrl}/api/favourite/`, {data});
                commit('CHANGE_POST_IS_LIKED', false)
                //console.log(response)
                await refreshNuxt()
            }
            else {
                const response = await this.$axios.post(`${process.env.baseUrl}/api/favourite/`, data);
                commit('CHANGE_POST_IS_LIKED', true)
                //console.log(response)
                await refreshNuxt()
            }  
        }
        catch(err){
            console.log(err)
        }
    },
    isPostLiked({commit}, post){

        const favourite = post.favourite;
        const username = this.$auth.user.username
        let liked = false;
        for (let i of favourite){
            if (username == i.username){
                liked = true;
            }
        }

        commit('CHANGE_POST_IS_LIKED', liked)
        return liked
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