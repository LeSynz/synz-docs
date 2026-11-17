import { Hono } from 'hono';
import path from 'node:path';
import { docs } from '../src';
import pkg from '../package.json';

const app = new Hono();

app.route(
	'/docs',
	docs({
		dir: path.join(import.meta.dir, 'docs'),
		title: 'synz-docs',
		basePath: '/docs',
		version: `v${pkg.version}`,
		theme: { preset: 'synz' },
	}),
);

app.get('/', (c) => c.redirect('/docs'));

export default app;
