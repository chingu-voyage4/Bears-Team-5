# Articles feeds

Guests and users can read articles feeds of different types using different filters.

## **get feed**
----
get a list of articles by providing the desired listing filters, lists are ordered by date from newest to oldest.

* **URL**

  `/api/feeds?maxcount=:maxcount&followed=:followed&category=:category`

* **Method:**

  `GET`

* **URL Params**

| parameter           | required | description                                                                                                                                                                                                          |
| :-----------------: | :------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `maxcount`[integer] |          | desired maximum number of articles to get, default is 20, maximum is 50                                                                                                                                              |
| `followed`[boolean] |          | whether or not to only display articles from the users you follow, default is false                                                                                                                                  |
| `category`[string]  |          | desired category of the articles, must be a single value from 'technology', 'culture', 'entrepreneurship', 'creativity', 'self', 'politics', 'media', 'productivity', 'design', 'popular' or 'other', default is any |

* **Success Response:**

  * **Code:** 200 OK<br />
    **Content:** 
    ``` javascript
      {
    "articles": [
        {
            "article_id": 372,
            "title": "programming lessons and tips",
            "body": "today we will learn more about ES6",
            "category": "technology",
            "date": "2014-04-16",
            "likes": 1,
            "image": "http://www.greenhomeguide.com/sites/default/files/default_images/default-article_0.png",
            "username": "chris",
            "avatar": "http://images.com/new/2018.png"
        },
        {
            "article_id": 373,
            "title": "dance moves",
            "body": "the salsa dance is our topic today!",
            "category": "culture",
            "date": "2017-05-22",
            "likes": 0,
            "image": "http://www.greenhomeguide.com/sites/default/files/default_images/default-article_0.png",
            "username": "john",
            "avatar": "http://images.com/new/2018.png"
        }
        ]
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
                  "msg": "category must be a valid category",
                  "param": "category"
              },
              {
                  "msg": "followed must be a boolean value",
                  "param": "followed"
              }
          ]
      }
    ```


* **Sample Call:**

``` javascript
$.ajax({
  url: "/api/articles?category=technology&maxcount=15",
  headers: {
        'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mjk0LCJpYXQiOjE1MjE2NDY1NTQsImV4cCI6MTUyMTY1NzM1NH0.egYak11OPvigG0Fd67u3d2GKc6YcIH1wUd2hZIm6Vm4'
    },
  type : "GET",
  success : function(r) {
    console.log(r);
  }
});
```

* **Notes:**

  omitting all URL params would result in getting the general feed for guests and users, by providing a `category` url param alone the result would be getting the general feed for that specific category, by providing a `followed` url param of value `true` and the JWT token in the `Authorization` header you are getting the followed users feed, failing to provide the JWT would cause the API to set `followed` to its default value of `false`, using both the `category` and `followed` params together would result in getting the articles posted by followed users and are categorized under the specified category.

