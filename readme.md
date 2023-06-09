# mysql-express-react-nodejs-typescript-shopping


#### ユーザー管理

**ユーザー向け機能**

1. ユーザーの登録: POST `/api/users/register`
2. ユーザーのログイン: POST `/api/users/login`
3. ユーザーのログアウト: POST `/api/users/logout`
4. ユーザープロフィールの取得: GET `/api/users/profile`
5. ユーザープロフィールの更新: PUT `/api/users/profile`

**管理者向け機能**

1. 特定ユーザー情報の取得: GET `/api/users/:id`
2. 全ユーザーの取得: GET `/api/users`
3. ユーザー情報の更新: PUT `/api/users/:id`
4. ユーザーの削除: DELETE `/api/users/:id`

#### 商品管理

**ユーザー向け機能**

1. トップ商品の取得: GET `/api/products/top`
2. 全商品の取得: GET `/api/products`
3. 商品情報の取得: GET `/api/products/:id`
4. 商品レビューの作成: POST `/api/products/:id/reviews`

**管理者向け機能**

1. 新規商品の作成: POST `/api/products`
2. 商品情報の取得: GET `/api/products/:id`
3. 商品情報の更新: PUT `/api/products/:id`
4. 商品の削除: DELETE `/api/products/:id`

#### 注文管理

**ユーザー向け機能**

1. 注文アイテムの追加: POST `/api/orders`
2. 自分の注文の取得: GET `/api/orders/mine`
3. 注文情報の取得: GET `/api/orders/:id`
4. 支払いステータスの更新: PUT `/api/orders/:id/pay`

**管理者向け機能**

1. 全注文の取得: GET `/api/orders`
2. 配送ステータスの更新: PUT `/api/orders/:id/deliver`

#### 画像アップロード

**ユーザー向け機能**

1. 画像のアップロード: POST `/api/upload`

![shopping_er](https://github.com/kurosawa-kuro/mysql-express-react-nodejs-javascript-shopping/assets/15902862/e1fbbe66-d42d-470b-9862-6b42d8eab6aa)

```
C:\Users\kuros\local_dev\full-stack-basic\shopping\sample\mysql-express-react-nodejs-javascript-shopping
npm run dev
```

```
C:\Users\kuros\local_dev\full-stack-basic\shopping\sample\mysql-express-react-nodejs-javascript-shopping
npx playwright test frontend/src/tests/e2e/auth/login.test.js
npx playwright test --debug frontend/src/tests/e2e/auth/login.test.js
```

```
C:\Users\kuros\local_dev\full-stack-basic\shopping\sample\mysql-express-react-nodejs-javascript-shopping
cd frontend
npm test ./src/tests/App.test.js
```

```
C:\Users\kuros\local_dev\full-stack-basic\shopping\sample\mysql-express-react-nodejs-javascript-shopping
npm test ./backend/test/app.test.js
```