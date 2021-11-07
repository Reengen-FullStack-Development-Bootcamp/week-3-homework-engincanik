<template>
	<div>
		<v-expansion-panels>
			<v-expansion-panel v-for="(item, i) in items" :key="i">
				<v-expansion-panel-header>
					{{ item.name }}
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<v-container class="">
						<v-row> <strong>from: </strong> {{ item.from }} </v-row>
						<v-row> <strong>to: </strong> {{ item.to }} </v-row>
					</v-container>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-expansion-panels>
	</div>
</template>

<script>
export default {
	data() {
		return {
			items: [],
		};
	},
	created() {
		let i = 0;
		while (localStorage.getItem(`Log: ${i}`) != null) {
			this.items.push(JSON.parse(localStorage.getItem(`Log: ${i}`)));
			i++;
		}
	},
};
</script>

<style>
</style>