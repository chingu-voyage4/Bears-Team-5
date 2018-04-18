# Likes

signed-in users can follow and unfollow other users.

## **follow user**
----
  follow the user with the provided `followedid`.

* **URL**

  `/api/follows`

* **Method:**

  `POST`

* **Request Body Params**

| parameter             | required           | description                       |
| :-------------------: | :----------------: | :-------------------------------- |
| `followedid`[integer] | :heavy_check_mark: | the ID of the user to be followed |

* **Success Response:**

  * **Code:** 201 Created<br />
    **Content:** 
    ``` javascript
      {
        "msg": "successful"
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
            "msg": "followed user id must be a valid existing user id",
            "param": "followedid"
    ]
}
```

  OR

  * **Code:** 422 Unprocessable Entity<br />
    **Content:**
    ``` javascript
    {
    "msg": "missing or invalid info"
}
```
  OR

  * **Code:** 401 Unauthorized<br />
    **Content:**
    ``` javascript
    {
    "msg": "auth failed"
}
```

* **Sample Call:**

``` javascript
$.ajax({
  url: "/api/follows",
  headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mjk0LCJpYXQiOjE1MjE2NDY1NTQsImV4cCI6MTUyMTY1NzM1NH0.egYak11OPvigG0Fd67u3d2GKc6YcIH1wUd2hZIm6Vm4'
    },
  dataType: "json",
  data : { 
	"followedid" : 549
  },
  type : "POST",
  success : function(r) {
    console.log(r);
  }
});
```


* **Notes:**

  request must include the JWT token in the `Authorization` header, not including the token would result in an HTTP response code of 401 Unauthorized. a non-401 fail response contains an array of errors, if it doesn't that means you are trying to follow yourself or a user you're already following.

  ## **unfollow user**
----
  unfollow the user with the provided `followedid`.

* **URL**

  `/api/follows`

* **Method:**

  `DELETE`

* **Request Body Params**

| parameter             | required           | description                         |
| :-------------------: | :----------------: | :---------------------------------- |
| `followedid`[integer] | :heavy_check_mark: | the ID of the user to be unfollowed |

* **Success Response:**

  * **Code:** 200 OK<br />
    **Content:** 
    ``` javascript
      {
        "msg": "successful"
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
            "msg": "followed user id must be a valid existing user id",
            "param": "followedid"
    ]
}
```

  OR

  * **Code:** 422 Unprocessable Entity<br />
    **Content:**
    ``` javascript
    {
    "msg": "missing or invalid info"
}
```
  OR

  * **Code:** 401 Unauthorized<br />
    **Content:**
    ``` javascript
    {
    "msg": "auth failed"
}
```

* **Sample Call:**

``` javascript
$.ajax({
  url: "/api/follows",
  headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mjk0LCJpYXQiOjE1MjE2NDY1NTQsImV4cCI6MTUyMTY1NzM1NH0.egYak11OPvigG0Fd67u3d2GKc6YcIH1wUd2hZIm6Vm4'
    },
  dataType: "json",
  data : { 
	"followedid" : 549
  },
  type : "DELETE",
  success : function(r) {
    console.log(r);
  }
});
```


* **Notes:**

  request must include the JWT token in the `Authorization` header, not including the token would result in an HTTP response code of 401 Unauthorized. a non-401 fail response contains an array of errors, if it doesn't that means you are trying to unfollow a user you're not following.
