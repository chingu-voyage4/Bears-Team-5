import React from "react";
import AuthorDetails from "./AuthorDetails";

export default class ArticlePage extends React.Component {
  render() {
    return (
      <div>
        <AuthorDetails
          imgUrl="https://i.imgur.com/hyqmyzn.png"
          authorName="Colonel Cockerel"
          authorDetails="Leader of the Chicken Uprising, sworn enemy of KFC"
        />
        <AuthorDetails
          imgUrl="https://i.imgur.com/hyqmyzn.png"
          authorName="Colonel Cockerel"
          authorDetails="Leader of the Chicken Uprising, sworn enemy of KFC"
        />
        <div>
          <button>Like</button>
        </div>
        <ul>
          <li>
            <a href="#">Suggested Article</a>
          </li>
          <li>
            <a href="#">Suggested Article</a>
          </li>
          <li>
            <a href="#">Suggested Article</a>
          </li>
        </ul>
      </div>
    );
  }
}
