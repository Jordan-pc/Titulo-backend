import { Router } from 'express';
import { check, param } from 'express-validator';
import PostController from './post.controller';
import AuthMiddleware from '../auth/auth.middleware';

const postController = new PostController();
const postRouter: Router = Router();

postRouter.get('/publications', postController.getPosts);
postRouter.get('/publications/filter', postController.filter);
postRouter.get(
	'/publications/:id',
	[param(['id', 'se necesita la url de la publicacion'])],
	postController.getPost
);
postRouter.post(
	'/publish',
	[
		check('title').exists().withMessage('Titulo necesario').isString(),
		check('url').exists().withMessage('URL necesario').isURL(),
		check('content').exists().withMessage('Contenido necesario').isString(),
		check('categorys')
			.exists()
			.withMessage('Se necesita al menos una categoria')
			.isArray(),
		check('tags')
			.exists()
			.withMessage('Se necesita al menos un tag')
			.isArray()
	],
	AuthMiddleware.tokenValidation,
	postController.savePost
);
postRouter.put(
	'/publications/:id',
	[
		param(['id', 'se necesita la url de la publicacion']),
		check('title').exists().withMessage('Titulo necesario').isString(),
		check('url').exists().withMessage('URL necesario').isURL(),
		check('content').exists().withMessage('Contenido necesario').isString(),
		check('categorys')
			.exists()
			.withMessage('Se necesita al menos una categoria')
			.isArray(),
		check('tags')
			.exists()
			.withMessage('Se necesita al menos un tag')
			.isArray()
	],
	AuthMiddleware.tokenValidation,
	postController.modifyPost
);
postRouter.patch(
	'/publications/:id',
	[param(['id', 'se necesita la url de la publicacion'])],
	AuthMiddleware.tokenValidation,
	postController.changePostEnabled
);

export default postRouter;
