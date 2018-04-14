# Articles

Guests can read articles, signed-in users can read, create, update or delete articles.

## **create article**
----
  create a new article and set it's `title`, `body`, `category`, `date` and `image` to the given arguments, a sucess response contains the slug of the created article.

* **URL**

  `/api/articles`

* **Method:**

  `POST`

* **Request Body Params**

| parameter          | required           | description                                                                                                                                                                                         |
| :----------------: | :----------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`[string]    | :heavy_check_mark: | desired title of the article, must not be empty and can not be more than 50 characters long                                                                                                         |
| `body`[string]     | :heavy_check_mark: | source of the body of the article, whether it's in markdown or in HTML, must not be empty                                                                                                           |
| `category`[string] | :heavy_check_mark: | desired category of the article, must be a single value from 'technology', 'culture', 'entrepreneurship', 'creativity', 'self', 'politics', 'media', 'productivity', 'design', 'popular' or 'other' |
| `date`[string]     | :heavy_check_mark: | date of the article creation, must be a valid date in the format of YYYY-MM-DD                                                                                                                      |
| `image`[string]    |                    | desired article cover image, must be a valid direct URL of an image                                                                                                                                 |

* **Success Response:**

  * **Code:** 201 Created<br />
    **Content:** 
    ``` javascript
      {
        "msg": "successful",
        "slug": "javascript-tutorial-HJ_avCy2M" 
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
                  "msg": "body can not be empty",
                  "param": "body"
              },
              {
                  "msg": "date must be a valid date in the format of YYYY-MM-DD",
                  "param": "date"
              }
          ]
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
  url: "/api/articles",
  headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mjk0LCJpYXQiOjE1MjE2NDY1NTQsImV4cCI6MTUyMTY1NzM1NH0.egYak11OPvigG0Fd67u3d2GKc6YcIH1wUd2hZIm6Vm4'
    },
  dataType: "json",
  data : {
	"title": "javascript tutorial",
	"body" :"today we will learn more about ES6 syntax",
	"category": "technology",
	"date": "2018-01-18"
},
  type : "POST",
  success : function(r) {
    console.log(r);
  }
});
```

* **Notes:**

  request must include the JWT token in the `Authorization` header, not including the token would result in an HTTP response code of 401 Unauthorized, a success response will always contain the slug of the article, you can request the article using this slug, check the <a href="#/articles?id=get-single-article" class="anchor">"get single article"</a> section for an example.


## **update article**
----
  update an existing personal article's `title`, `body`, `category`, `date` or `image`.

* **URL**

  `/api/articles`

* **Method:**

  `PATCH`

* **Request Body Params**

| parameter              | required           | description                                                                                                                                                                                             |
| :--------------------: | :----------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `article_id`[integer]  | :heavy_check_mark: | the ID of the personal article that you would like to update                                                                                                                                            |
| `newtitle`[string]     |                    | desired new title of the article, must not be empty and can not be more than 50 characters long                                                                                                         |
| `newbody`   [string]   |                    | the new source of the body of the article, whether it's in markdown or in HTML, must not be empty                                                                                                       |
| `newcategory` [string] |                    | desired new category of the article, must be a single value from 'technology', 'culture', 'entrepreneurship', 'creativity', 'self', 'politics', 'media', 'productivity', 'design', 'popular' or 'other' |
| `newimage`[string]     |                    | desired new article cover image, must be a valid direct URL of an image                                                                                                                                 |

* **Success Response:**

  * **Code:** 200 OK<br />
    **Content:** 
    ``` javascript
      {
          "msg": "successful",
          "article": {
              "image": "gts430.com/images/go.png"
          }
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
                  "msg": "article id is missing or invalid",
                  "param": "article_id"
              },
              {
                  "msg": "title must not be empty and can not be more than 50 characters long",
                  "param": "newtitle"
              }
          ]
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
  url: "/api/articles",
  headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mjk0LCJpYXQiOjE1MjE2NDY1NTQsImV4cCI6MTUyMTY1NzM1NH0.egYak11OPvigG0Fd67u3d2GKc6YcIH1wUd2hZIm6Vm4'
    },
  dataType: "json",
  data : {
	"newtitle": "python tutorial",
	"category": "other"
},
  type : "PATCH",
  success : function(r) {
    console.log(r);
  }
});
```


* **Notes:**

  a request must only include the fields that the user wants to update and must include the JWT token in the `Authorization` header, not including the token would result in an HTTP response code of 401 Unauthorized. a non-401 fail response contains an array of errors, if it doesn't that means no fields were sent in the request body, trying to update an article that was created by someone else would result in an HTTP response code of 401 Unauthorized, success response contains the updated fields.


## **get single article**
----
  get all the info of a single article by providing it's `slug`.

* **URL**

  `/api/articles/:slug`

* **Method:**

  `GET`

* **URL Params**

| parameter      | required           | description                                         |
| :------------: | :----------------: | :-------------------------------------------------- |
| `slug`[string] | :heavy_check_mark: | the slug of the article that you would like to read |


* **Success Response:**

  * **Code:** 200 OK<br />
    **Content:** 
    ``` javascript
      {
          "article": {
              "article_id": 167,
              "title": "javascript tutorial",
              "body": "today we will learn more about ES6 syntax",
              "category": "technology",
              "date": "2018-01-18",
              "likes": 0,
              "image": "http://www.greenhomeguide.com/sites/default/files/default_images/default-article_0.png",
              "personal": false
          }
      }
    ```

* **Error Response:**

  * **Code:** 404 Not found<br />
    **Content:** 
    ``` javascript
      {
          "msg": "article not found"
      }
    ```


* **Sample Call:**

``` javascript
$.ajax({
  url: "/api/articles/javascript-tutorial-HJ_avCy2M",
  type : "GET",
  success : function(r) {
    console.log(r);
  }
});
```


* **Notes:**

  success response contains all the article's info, the `personal` boolean value is true if the user is logged-in (the JWT token must be included in the `Authorization` header) and is the original creator of the article, else it's value is false.


## **delete article**
----
  delete an existing personal article by providing it's `article_id`.

* **URL**

  `/api/articles`

* **Method:**

  `DELETE`

* **Request Body Params**

| parameter             | required           | description                                                  |
| :-------------------: | :----------------: | :----------------------------------------------------------- |
| `article_id`[integer] | :heavy_check_mark: | the ID of the personal article that you would like to delete |

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
                  "msg": "article id is missing or invalid",
                  "param": "article_id"
              }
          ]
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
  url: "/api/articles",
  headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mjk0LCJpYXQiOjE1MjE2NDY1NTQsImV4cCI6MTUyMTY1NzM1NH0.egYak11OPvigG0Fd67u3d2GKc6YcIH1wUd2hZIm6Vm4'
    },
  dataType: "json",
  data : {
	"article_id": 167
},
  type : "DELETE",
  success : function(r) {
    console.log(r);
  }
});
```


* **Notes:**

  request must include the JWT token in the `Authorization` header, not including the token would result in an HTTP response code of 401 Unauthorized. a non-401 fail response contains an array of errors, trying to delete an article that was created by someone else would result in an HTTP response code of 401 Unauthorized.