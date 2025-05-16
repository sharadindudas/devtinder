/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication APIs
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user
 *               age:
 *                 type: number
 *                 description: The age of the user
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *                 description: The gender of the user
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     age:
 *                       type: number
 *                       example: 28
 *                     gender:
 *                       type: string
 *                       example: male
 *                     about:
 *                       type: string
 *                       example: This is the default about section
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     photoUrl:
 *                       type: string
 *                       example: https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-05-16T10:00:00Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-05-16T10:00:00Z
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   oneOf:
 *                     - type: string
 *                       example: Name is required
 *                     - type: array
 *                       items:
 *                         type: string
 *                       example: ["Email is required", "Password must be at least 6 characters"]
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal Server Error Occurred
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged in successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     age:
 *                       type: number
 *                       example: 28
 *                     gender:
 *                       type: string
 *                       example: male
 *                     about:
 *                       type: string
 *                       example: This is the default about section
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["JavaScript", "Node.js", "MongoDB"]
 *                     photoUrl:
 *                       type: string
 *                       example: https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-05-16T10:00:00Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-05-16T10:00:00Z
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: devtinderToken=xxx; HttpOnly; Secure; SameSite=None; Max-Age=604800
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   oneOf:
 *                     - type: string
 *                       example: Email is required
 *                     - type: array
 *                       items:
 *                         type: string
 *                       example: ["Email is required", "Password is required"]
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid Credentials
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User does not exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal Server Error Occurred
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout from the application
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal Server Error Occurred
 */
