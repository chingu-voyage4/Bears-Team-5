# Likes

signed-in users can like and unlike articles.

## **post like**
----
  like the article with the provided `article_id`.

* **URL**

  `/api/likes`

* **Method:**

  `POST`

* **Request Body Params**

| parameter             | required           | description                       |
| :-------------------: | :----------------: | :-------------------------------- |
| `article_id`[integer] | :heavy_check_mark: | the ID of the article to be liked |

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
            "msg": "article id is missing or invalid.",
            "param": "article_id"
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
  url: "/api/likes",
  headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mjk0LCJpYXQiOjE1MjE2NDY1NTQsImV4cCI6MTUyMTY1NzM1NH0.egYak11OPvigG0Fd67u3d2GKc6YcIH1wUd2hZIm6Vm4'
    },
  dataType: "json",
  data : { 
	"article_id" : 236
  },
  type : "POST",
  success : function(r) {
    console.log(r);
  }
});
```


* **Notes:**

  request must include the JWT token in the `Authorization` header, not including the token would result in an HTTP response code of 401 Unauthorized. a non-401 fail response contains an array of errors, if it doesn't that means this user has already liked this article.

  ## **delete like**
----
  unlike the already liked article with the provided `article_id`.

* **URL**

  `/api/likes`

* **Method:**

  `DELETE`

* **Request Body Params**

| parameter             | required           | description                         |
| :-------------------: | :----------------: | :---------------------------------- |
| `article_id`[integer] | :heavy_check_mark: | the ID of the article to be unliked |

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
            "msg": "article id is missing or invalid.",
            "param": "article_id"
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
  url: "/api/likes",
  headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mjk0LCJpYXQiOjE1MjE2NDY1NTQsImV4cCI6MTUyMTY1NzM1NH0.egYak11OPvigG0Fd67u3d2GKc6YcIH1wUd2hZIm6Vm4'
    },
  dataType: "json",
  data : { 
	"article_id" : 236
  },
  type : "DELETE",
  success : function(r) {
    console.log(r);
  }
});
```


* **Notes:**

  request must include the JWT token in the `Authorization` header, not including the token would result in an HTTP response code of 401 Unauthorized. a non-401 fail response contains an array of errors, if it doesn't that means this user hasn't liked this article before.
