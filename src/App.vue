<template>
	<div id="app">
		<router-view />
		<router-view name="left" style="float: left;width: 200px;background-color: royalblue;"></router-view>
		<router-view name="right" style="float: right;width: 200px;background-color: yellow;"></router-view>
	</div>
</template>

<script>
	export default {
		name: 'App'
	}
</script>

<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
	}
</style>
