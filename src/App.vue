<template>
	<v-app>
		<v-app-bar app color="black" dark>
			<div class="d-flex align-center">
				<v-img
					alt="Vuetify Logo"
					class="shrink mr-2"
					contain
					src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
					transition="scale-transition"
					width="40"
				/>
				<div>Stockly</div>
			</div>

			<v-spacer></v-spacer>
			<div>
				<v-btn
					@click="goToLogPage()"
					v-if="userRole === 'Admin'"
					color="#706968"
					class="pr-4"
					>Logs</v-btn
				>
			</div>
			<div>
				<v-select
					v-model="userRole"
					:items="roles"
					prepend-icon="mdi-account"
					menu-props="auto"
					hide-details
					label="Select"
					single-line
				></v-select>
			</div>
		</v-app-bar>

		<v-main>
			<v-container class="pt-6">
				<router-view></router-view>
			</v-container>
		</v-main>
	</v-app>
</template>

<script>
export default {
	name: "App",
	components: {},

	data: () => ({
		userRole: "Guest",
		roles: ["Guest", "Admin"],
	}),
	methods: {
		changeUserRole() {
			this.$store.commit("setUserRole", this.userRole);
		},
		goToLogPage() {
			this.$router.push({
				name: "Logs",
				query: {
					userRole: this.userRole,
				},
			});
		},
	},
};
</script>
