import React from 'react';
import AuthorDetails from './AuthorDetails';
import Comments from './Comments';

export default class ArticlePage extends React.Component {
  state = {
    article: {
      title: this.props.article.title,
      body: this.props.article.body,
    },
    comments: this.props.comments,
  };

  render() {
    return (
      <div className="article">
        <AuthorDetails
          imgUrl="https://i.imgur.com/hyqmyzn.png"
          name="Colonel Cockerel"
          details="Leader of the Chicken Uprising, sworn enemy of KFC"
        />
        <h2 className="article__title">{this.state.article.title}</h2>
        <p>{this.state.article.body}</p>
        <AuthorDetails
          imgUrl="https://i.imgur.com/hyqmyzn.png"
          name="Colonel Cockerel"
          details="Leader of the Chicken Uprising, sworn enemy of KFC"
        />
        <div>
          <button className="article__like">Like</button>
        </div>
        <h3>Suggested Articles</h3>
        <ul className="article__suggestions">
          <li>
            <a href="#">
              <div>
                <img src="http://via.placeholder.com/200x150" />
                <h3>Suggested Article</h3>
              </div>
            </a>
          </li>
          <li>
            <a href="#">
              <div>
                <img src="http://via.placeholder.com/200x150" />
                <h3>Suggested Article</h3>
              </div>
            </a>
          </li><li>
            <a href="#">
              <div>
                <img src="http://via.placeholder.com/200x150" />
                <h3>Suggested Article</h3>
              </div>
            </a>
          </li>
        </ul>
        <h3>Comments go here</h3>
        <Comments comments={this.state.comments} />
      </div>
    );
  }
}

ArticlePage.defaultProps = {
  article: {
    title: 'Article Title',
    body: 'Lorem ipsum dolor sit amet consectetur adipiscing elit magnis curae, orci in vehicula luctus ut ac faucibus vestibulum, habitasse erat eros egestas ad placerat libero laoreet. Lacus velit class feugiat aliquam sociis sodales donec ac dapibus, ridiculus neque montes quam per nam vitae varius est, nullam id pellentesque fermentum egestas convallis semper pretium. Metus justo suscipit per nulla aliquet facilisi duis congue class, ultricies maecenas taciti torquent mattis ante nullam vitae ornare, massa hac pretium fringilla purus mauris rutrum viverra. Quam porta lacinia porttitor aliquam morbi aliquet etiam, lectus curabitur per ultricies auctor nisi sollicitudin, ligula augue platea fermentum magna ridiculus. Tortor scelerisque nullam accumsan ornare suscipit tristique potenti nisi bibendum, nostra ut ultricies hendrerit auctor molestie metus inceptos ac id, posuere enim fermentum cras ligula sodales sed sociis.\n\nSodales ultrices ac phasellus justo natoque habitant habitasse et, laoreet metus sapien ullamcorper tortor sollicitudin faucibus auctor, sociis cubilia nulla blandit nec eu taciti. Pulvinar morbi commodo eget eleifend fusce primis habitasse ultrices quis felis dictumst porttitor habitant mattis aliquam a, nibh viverra varius conubia egestas tellus urna fames ornare torquent mi et id ut purus. Ut conubia at nisl sodales duis pellentesque orci nec felis, platea nulla viverra quis tempus dapibus sollicitudin enim eros pretium, iaculis convallis sociis dui libero magna cursus nunc. Urna aenean tempor accumsan nec donec arcu ligula et ut augue vulputate, risus laoreet at mollis tincidunt nulla nam mauris curabitur metus sodales, placerat proin eros pellentesque elementum quisque porttitor aptent senectus cum. Vel aliquam at rutrum rhoncus vestibulum eros imperdiet sodales sem, vivamus scelerisque quam nullam sollicitudin quisque ad himenaeos, a ante eleifend tellus taciti platea netus pharetra. Ullamcorper molestie dictum class mollis curae nunc vestibulum, pretium vivamus vehicula orci augue laoreet, arcu taciti etiam convallis primis cursus. Gravida egestas duis ornare urna est habitant posuere bibendum aliquet vehicula, sapien at tristique augue primis vulputate quam venenatis enim.',
  },
  comments: [
    {
      userName: 'Jethro',
      commentBody: 'This is my comment',
    },
    {
      userName: 'Lisa',
      commentBody: 'React is amazing',
    },
  ],
};
