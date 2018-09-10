import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class ModuleRoute extends Component {
  state = { contentHeight: 100 };

  handleResize = () => {
    if (this.container) {
      const { contentWindow } = this.container;
      if (contentWindow) {
        const { documentElement } = contentWindow.document;
        const { match } = this.props;
        const { id } = match.params;
        const contentHeight = Math.max(
          documentElement.clientHeight,
          documentElement.offsetHeight,
          documentElement.scrollHeight
        );
        if (contentHeight !== this.state.contentHeight)
          this.setState({ contentHeight });
      }
    }
  };

  onLoad = () => {
    if (this.container) {
      const { contentWindow } = this.container;
      if (contentWindow) {
        this.container.contentWindow.addEventListener(
          "resize",
          this.handleResize
        );
        this.handleResize();
      }
    }
  };

  componentWillMount = () => {
    this.setState({ contentHeight: 100 }, () => {
      setInterval(this.handleResize, 2000);
    });
  };

  componentWillUnmount() {
    if (this.container) {
      const { contentWindow } = this.container;
      if (contentWindow) {
        this.container.contentWindow.removeEventListener(
          "resize",
          this.handleResize
        );
      }
    }
  }

  render() {
    const { history } = this.props;
    const { search } = history.location;
    const { contentHeight } = this.state;
    return (
      <div>
        {search ? (
          <iframe
            frameBorder="0"
            onLoad={this.onLoad}
            ref={container => {
              this.container = container;
            }}
            scrolling="no"
            style={{ width: "100%", height: `${contentHeight}px` }}
            src={`/centreon/main.get.php${search}`}
          />
        ) : (
          <Redirect to={"/centreon/main.php?p=1"} />
        )}
      </div>
    );
  }
}

export default ModuleRoute;
