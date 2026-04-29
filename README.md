# 🧪 Running Tests

## 1. Start MySQL

```bash
docker run --rm \
-d --name tdd-mysql \
-e MYSQL_ROOT_PASSWORD=root \
-e MYSQL_DATABASE=app \
-p 3306:3306 \
mysql:8.0 --default-authentication-plugin=mysql_native_password
```

---

## 2. Setup `.env`

```env
DB_USER=root
DB_PASSWORD=root
DB_NAME=app
DB_HOST=localhost
DB_PORT=3306
PORT=3001
```

---

## 3. Run database middleware

```bash
npm run db:migrate
```

---

## 4. Run tests

```bash
npm test
```

---

## ⚠️

* MySQL must be running
* Port 3306 must be free
* Reset container if needed
