import React from "react";
import AuthorDetails from "./AuthorDetails";

export default class ArticlePage extends React.Component {
  render() {
    return (
      <div>
        <AuthorDetails
          imgUrl="https://pixabay.com/get/ea37b1082bf0033ed1584d05fb0938c9bd22ffd41cb3114494f4c67aa1/cock-3207342_1280.png"
          authorName="Colonel Cockerel"
          authorDetails="Leader of the Chicken Uprising, sworn enemy of KFC"
          date="Mar 8"
          readingTime="20 sec"
        />
      </div>
    );
  }
}
