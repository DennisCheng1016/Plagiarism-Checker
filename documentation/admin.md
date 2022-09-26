# Admin

### getAllUser

- [x] completed

**url** 	```GET  /admin/getAllUser```

**Parameter**

| Parameter | body/headers/query/params | explain  | Value type |
|--------|---------|-------- | ---------- |
| Authorization| headers   | adminName   | String     |


e.g.
```json
{
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJ4aWVAZ21haWwuY29tIiwiaWF0IjoxNjY0MTkyNjI5LCJleHAiOjE2NjQyNzkwMjl9.7mK0izFzPlEfvlfssJgO2JUNLCredmLm792Ym02pmN4"
}
```

**Response**

status code: 200
```json

[
  {
  "_id": "object id",
  "username": "username",
  "email": "email",
  "password": "password hash",
  "subjects": [
    "subjects"
  ],
  "__v": 0,
  "role": "role",
  "accountStatus": "status"
  }
]
```
***
### getAllPermission

- [x] completed

**url** 	```GET /admin/getAllPermission```

**Parameter**

| Parameter | body/headers/query/params | explain  | Value type |
|--------|---------|-------- | ---------- |
| Authorization| headers   | adminName   | String     |


e.g.
```json
{
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJ4aWVAZ21haWwuY29tIiwiaWF0IjoxNjY0MTkyNjI5LCJleHAiOjE2NjQyNzkwMjl9.7mK0izFzPlEfvlfssJgO2JUNLCredmLm792Ym02pmN4"
}
```

**Response**

status code: 200
```json

[
  {
    "_id": "permission object id",
    "email": "email",
    "__v": 0
  }
]
```
***

### updateUserAccount

- [x] completed

**url** 	```POST /admin/updateUserAccount```

**Parameter**

| Parameter     | body/headers | explain         | Value type |
|---------------|--------------|-----------------|------------|
| Authorization | headers      | token           | String     |
| userEmail     | body         | email           | String     |
| update        | body         | value to update | json       |


e.g.
```json
{
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJ4aWVAZ21haWwuY29tIiwiaWF0IjoxNjY0MTkyNjI5LCJleHAiOjE2NjQyNzkwMjl9.7mK0izFzPlEfvlfssJgO2JUNLCredmLm792Ym02pmN4"
}
```
```json
{
    "userEmail":"dennis@gmail.com",
    "update":{
        "accountStatus":"disable"
    }
}
```

**Response**

status code: 200
```json

{
  "_id": "object id",
  "username": "username",
  "email": "email",
  "password": "password hash",
  "subjects": [
    "subjects"
  ],
  "__v": 0,
  "role": "role",
  "accountStatus": "status"
}
```
***

### permitTeacherRegistration

- [x] completed

**url** 	```POST /admin/permitTeacherRegistration```

**Parameter**

| Parameter     | body/headers | explain         | Value type |
|---------------|--------------|-----------------|------------|
| Authorization | headers      | token           | String     |
| email         | body         | email           | String     |


e.g.
```json
{
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJ4aWVAZ21haWwuY29tIiwiaWF0IjoxNjY0MTkyNjI5LCJleHAiOjE2NjQyNzkwMjl9.7mK0izFzPlEfvlfssJgO2JUNLCredmLm792Ym02pmN4"
}
```
```json
{
  "email":"aTeacher@gmail.com"
}
```

**Response**

status code: 200
```json
{
  "msg": "permitted registration"
}
```
