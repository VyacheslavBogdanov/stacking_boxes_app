<script setup lang="ts"></script>

<template>
	<div class="app-placeholder">
		<div class="app-placeholder__content">
			<svg
				class="app-placeholder__icon"
				width="80"
				height="80"
				viewBox="0 0 80 80"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect
					x="10"
					y="40"
					width="60"
					height="30"
					rx="3"
					stroke="currentColor"
					stroke-width="2.5"
					fill="none"
				/>
				<line
					x1="40"
					y1="40"
					x2="40"
					y2="70"
					stroke="currentColor"
					stroke-width="2"
					opacity="0.5"
				/>
				<line
					x1="10"
					y1="55"
					x2="70"
					y2="55"
					stroke="currentColor"
					stroke-width="2"
					opacity="0.5"
				/>
				<rect
					x="20"
					y="14"
					width="40"
					height="26"
					rx="3"
					stroke="currentColor"
					stroke-width="2.5"
					fill="none"
				/>
				<line
					x1="40"
					y1="14"
					x2="40"
					y2="40"
					stroke="currentColor"
					stroke-width="2"
					opacity="0.5"
				/>
				<line
					x1="20"
					y1="27"
					x2="60"
					y2="27"
					stroke="currentColor"
					stroke-width="2"
					opacity="0.5"
				/>
			</svg>
			<h1 class="app-placeholder__title">STACKING BOXES</h1>
			<p class="app-placeholder__subtitle">Приложение в разработке</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$color-bg-start: #1a1a2e;
$color-bg-end: #16213e;
$color-accent: #e2e2fe;
$color-subtitle: rgba(226, 226, 254, 0.5);
$icon-size: 80px;
$title-size: 2.5rem;
$subtitle-size: 1rem;
$animation-duration: 1s;

.app-placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	background: linear-gradient(135deg, $color-bg-start 0%, $color-bg-end 100%);
	color: $color-accent;

	&__content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		animation: fade-in-up $animation-duration ease-out both;
	}

	&__icon {
		width: $icon-size;
		height: $icon-size;
		animation: pulse 3s ease-in-out infinite;
	}

	&__title {
		font-size: $title-size;
		font-weight: 700;
		letter-spacing: 0.3em;
		margin: 0;
	}

	&__subtitle {
		font-size: $subtitle-size;
		color: $color-subtitle;
		margin: 0;
	}
}

@keyframes fade-in-up {
	from {
		opacity: 0;
		transform: translateY(20px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes pulse {
	0%,
	100% {
		opacity: 1;
		transform: scale(1);
	}

	50% {
		opacity: 0.7;
		transform: scale(1.05);
	}
}
</style>
