# Users accounts 

Guests can register or sign-in, signed-in users can update their info and settings or log-out.

## **register user**
----
  create a new account and set their `username`, `email` and `password` to the given arguments, a sucess response contains JWT for authorization.

* **URL**

  `/api/register`

* **Method:**

  `POST`

* **Request Body Params**

| parameter                 | required           | description                                                                                                                                                                                   |
| :-----------------------: | :----------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `username`[string]        | :heavy_check_mark: | used to login and as a display name on the website, must be between 4 to 15 characters long, can only contain alphanumerics, underscores and dashes, and must not be already in use</li></ul> |
| `email`   [string]        | :heavy_check_mark: | must be a valid email address and not already in use                                                                                                                                          |
| `password` [string]       | :heavy_check_mark: | used to login, must be at least 8 characters long, include one lowercase character, one uppercase character, a number, and a special character                                                |
| `confirmpassword`[string] | :heavy_check_mark: | double checks that the entered password is the one really desired by the user, must match `password`                                                                                          |

* **Success Response:**

  * **Code:** 201 Created<br />
    **Content:** 
    ``` javascript
      {
        "msg": "successful",
        "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjkzLCJpYXQiOjE1MjE2NDA4MjQsImV4cCI6MTUyMTY1MTYyNH0.KaJSnxnECC1S-amUhyjM-sifNCwksY_kAELFU71LCyg" 
      }
    ```
 
* **Error Response:**

  * **Code:** 422 Unprocessable Entity<br />
    **Content:** 
    ``` javascript
{
    "msg": "missing or invalid info",
    "errors": [
        {
            "msg": "username must be between 4 to 15 characters long, and can only contain alphanumerics, underscores and dashes.",
            "param": "username"
        },
        {
            "msg": "e-mail must be a valid e-mail address.",
            "param": "email"
        },
        {
            "msg": "password must be at least 8 characters long, and include one lowercase character, one uppercase character, a number, and a special character.",
            "param": "password"
        },
        {
            "msg": "passwords must match",
            "param": "confirmpassword"
        }
    ]
}
```

  OR

  * **Code:** 422 Unprocessable Entity<br />
    **Content:** 
    ``` javascript
{
    "msg": "missing or invalid info",
    "errors": [
        {
            "msg": "username must be between 4 to 15 characters long, and can only contain alphanumerics, underscores and dashes.",
            "param": "username"
        },
        {
            "msg": "e-mail must be a valid e-mail address.",
            "param": "email"
        }
    ]
}
```

* **Sample Call:**

``` javascript
$.ajax({
  url: "/api/register",
  headers: {
        'Content-Type':'application/json'
    },
  dataType: "json",
  data : { 
	"username" : "john",
	"password" : "Aa@123456",
	"confirmpassword" : "Aa@123456",
	"email" : "test@email.com"
  },
  type : "POST",
  success : function(r) {
    console.log(r);
  }
});
```


* **Notes:**

  a success response will always contain a JWT that must be saved in localStorage, this JWT must be included in the `Authorization` header in every request sent afterwards to authenticate the user, failing to do so will result in an HTTP response of code "401 Unauthorized", check the <a href="#/users?id=update-user-info" class="anchor">"update user info"</a> section for an example.

## **Sign in**
----
  authenticate the guest by checking the entered `username` and `password`, a sucess response contains JWT for authorization.

* **URL**

  `/api/login`

* **Method:**

  `POST`
  
* **Request Body Params**

| parameter          | required           | description                        |
| :----------------: | :----------------: | :--------------------------------- |
| `username`[string] | :heavy_check_mark: | username used during registeration |
| `password`[string] | :heavy_check_mark: | password used during registeration |

* **Success Response:**

  * **Code:** 200 OK<br />
    **Content:**
    ``` javascript
      {
        "msg": "successful",
        "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjkzLCJpYXQiOjE1MjE2NDA4MjQsImV4cCI6MTUyMTY1MTYyNH0.KaJSnxnECC1S-amUhyjM-sifNCwksY_kAELFU71LCyg" 
      }
    ```
 
* **Error Response:**

  * **Code:** 422 Unprocessable Entity<br />
    **Content:**
    ``` javascript
      {
        "msg": "invalid username or password"
      }
    ```
 


* **Sample Call:**

``` javascript
$.ajax({
  url: "/api/login",
  headers: {
        'Content-Type':'application/json'
    },
  dataType: "json",
  data : { 
	"username" : "john",
	"password" : "Aa@123456"
  },
  type : "POST",
  success : function(r) {
    console.log(r);
  }
});
```

* **Notes:**

    a success response will always contain a JWT that must be saved in localStorage, this JWT must be included in the `Authorization` header in every request sent afterwards to authenticate the user, failing to do so will result in an HTTP response of code "401 Unauthorized", check the <a href="#/users?id=update-user-info" class="anchor">"update user info"</a> section for an example.


## **update user info**
----
  update the user's `username`, `email`, `bio`, `avatar` or `password`.

* **URL**

`/api/users`

* **Method:**
  
  `PATCH`

* **Request Body Params**

  
| parameter                      | required | description                                                                                                                                               |
| :----------------------------: | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `newusername`[string]          |          | desired new username, must be between 4 to 15 characters long, and can only contain alphanumerics, underscores and dashes, and must not be already in use |
| `newemail`[string]             |          | desired new email address, must be a valid email address and not already in use                                                                           |
| `newpassword`[string]          |          | desired new password, must be at least 8 characters long, include one lowercase character, one uppercase character, a number, and a special character     |
| `confirm_new_password`[string] |          | double checks that the entered new password is the one really desired by the user, must match `newpassword`                                               |
| `avatar`[string]               |          | desired new avatar, must be a valid direct URL of an image                                                                                                |
| `bio`[string]                  |          | desired new user bio, must not be more than 255 characters long                                                                                           |

* **Success Response:**
  
  * **Code:** 200 OK <br />
    **Content:**
    ``` javascript
    {
    "msg": "successful",
    "user": {
        "email": "newemail@test.com",
        "avatar": "http://stockimages.com/img/avatar123.png",
        "bio": "hello, my name is john.",
        "changed_password": false
    }
}
```
 
* **Error Response:**

  * **Code:** 422 Unprocessable Entity <br />
      **Content:**
      ``` javascript
      {
      "msg": "missing or invalid info",
      "errors": [
        {
              "msg": "this email is already in use.",
              "param": "newemail"
          },
          {
              "msg": "Invalid value",
              "param": "avatar"
          }
      ]
  }
  ```
OR

  * **Code:** 422 Unprocessable Entity<br />
    **Content:**
    ``` javascript
    {
    "msg": "missing or invalid info",
}
```
OR

  * **Code:** 401 Unauthorized<br />
    **Content:**
    ``` javascript
    {
    "msg": "auth failed",
}
```

* **Sample Call:**

``` javascript
$.ajax({
  url: "/api/users",
  headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mjk0LCJpYXQiOjE1MjE2NDY1NTQsImV4cCI6MTUyMTY1NzM1NH0.egYak11OPvigG0Fd67u3d2GKc6YcIH1wUd2hZIm6Vm4'
    },
  dataType: "json",
  data : { 
	"newusername" : "sarah",
	"bio" : "hello, my name is Sarah."
  },
  type : "PATCH",
  success : function(r) {
    console.log(r);
  }
});
```

* **Notes:**

  a request must only include the fields that the user wants to update and must include the JWT token in the `Authorization` header, not including the token would result in an HTTP response code of 401 Unauthorized. a non-401 fail response contains an array of errors, if it doesn't that means no fields were sent in the request body. a success response contains the updated fields except for `updated_password` which is always included and is a boolean that indicates whether the password was changed or not.