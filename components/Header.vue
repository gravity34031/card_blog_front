<template>
    <div>
        <div id="carouselExampleSlidesOnly" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                <div class="carousel-item active main-header color">
                    <div class="carousel-caption text-wrap text-break">
                        <h1 class="text-dark text-center">{{title}}</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['title']
}
</script>

<style scoped>

</style>