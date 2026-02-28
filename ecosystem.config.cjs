/** @type {import('pm2').StartOptions} */
module.exports = {
	apps: [
		{
			name: 'school-cost-index',
			script: 'npm',
			args: 'start',
			cwd: './',
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: '500M',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
}
