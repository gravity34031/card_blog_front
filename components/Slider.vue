<template>
<div>
<div id="carouselSlider" class="carousel slide" data-bs-ride="carousel">
		<div class="carousel-indicators">
			<button type="button" data-bs-target="#carouselSlider" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
			<button type="button" data-bs-target="#carouselSlider" data-bs-slide-to="1" aria-label="Slide 2"></button>
			<button type="button" data-bs-target="#carouselSlider" data-bs-slide-to="2" aria-label="Slide 3"></button>
		</div>
		<div class="carousel-inner">

			<div class="carousel-item active">
				<img src="/img/slider/1.jpg" class="d-block w-100 carousel-item-img" alt="...">
				<div class="carousel-caption d-none d-md-block">
					<h5>Первый слайд</h5>
					<p>На данном фото изображено фото стола, макбука, объектив камеры.</p>
				</div>
			</div>
			<div class="carousel-item">
				<img src="/img/slider/2.jpeg" class="d-block w-100 carousel-item-img" alt="...">
				<div class="carousel-caption d-none d-md-block ">
					<h5>Второй слайд</h5>
					<p>Уютный уголок с кактусом, кофе и фильмом.</p>
				</div>
			</div>
			<div class="carousel-item">
				<img src="/img/slider/3.jpg" class="d-block w-100 carousel-item-img" alt="...">
				<div class="carousel-caption d-none d-md-block">
					<h5>Третий слайд</h5>
					<p>Просто немного яблок. Ничего более.</p>
				</div>
			</div>

		</div>
		<button class="carousel-control-prev" type="button" data-bs-target="#carouselSlider" data-bs-slide="prev">
			<span class="carousel-control-prev-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Previous</span>
		</button>
		<button class="carousel-control-next" type="button" data-bs-target="#carouselSlider" data-bs-slide="next">
			<span class="carousel-control-next-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Next</span>
		</button>
</div>
</div>
</template>

<script>
export default {
	mounted(){
		const carouselSlider = new bootstrap.Carousel('#carouselSlider', {
   			interval: 10000,
		});
	},
    /* head() {
		return {
			script: [
				{ src:'/js/main.js'}
			]
		}
	}, */
}
</script>

<style>

</style>