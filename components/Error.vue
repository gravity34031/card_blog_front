<template>
<div v-if='error' class='mb-0 alert alert-danger rounded-0 text-center text-break text-wrap'>
    <p v-for='err in errorsOutput' :class='err==errorsOutput[errorsOutput.length-1]? "mb-0": "mb-2"'>
        <strong class='lh-1'>{{err}}</strong>
    </p>
</div>
</template>

<script>
export default{
    props:['error'],
    computed:{
        onErrorChange(){
            return this.error
        }
    },
    watch: {
        onErrorChange(error){
            this.beautifyError(error)
        }
    },
    data() {
        return{
            errorsOutput: '',
        }
    },
    methods:{
        beautifyError(errors){
            if(typeof errors === 'string'){
                if (errors.length > 200){
                    this.errorsOutput = ['Неизвестная ошибка']
                } else{
                    this.errorsOutput = [errors]
                }
            } else if (typeof errors ==='object') {
                let errorsOutput = []
                for (let e in errors) {
                    if (errors[e][0] == 'Это поле не может быть пустым.' || errors[e][0] == 'Обязательное поле.') {
                        errorsOutput.push(`Поле ${e} не может быть пустым`)
                    } else if (errors[e][0] == 'Значение должно состоять только из букв, цифр, символов подчёркивания или дефисов, входящих в стандарт Юникод.'){
                        errorsOutput.push(`Некорректный слаг`)
                    } else {
                        errorsOutput.push(errors[e][0])
                    }
                }
                this.errorsOutput = errorsOutput
            }
        },
    },
}
</script>

<style scoped>

</style>