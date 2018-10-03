import React, { Component } from "react";
import numeral from "numeral";
import Clock from "../clock";
import config from "../../config";

import axios from "../../axios";
import {generatePassword} from "../../helpers/autoLoginTokenGenerator";
class UserMenu extends Component {
  state = {
    toggled: false,
    buildedLink: '',
    copied: false,
    initialized: false  
  };

  autoLoginApi = axios("internal.php?object=centreon_topcounter&action=autoLoginToken");

  toggle = () => {
    const { toggled } = this.state;
    this.setState({
      toggled: !toggled
    });
  };

  componentWillReceiveProps = (nextProps) => {
    const { data } = nextProps;
    const { initialized } = this.state;
    const { userId, username, autologinkey } = data;
    if (userId && !initialized) {
      let token = autologinkey ? autologinkey : generatePassword('aKey');
     
      if (!autologinkey || autologinkey != token) {
        this.autoLoginApi.put("", {
          userId,
          token
        }).then(() => { })
      }

      this.setState({
        buildedLink: window.location.protocol + '//' + window.location.hostname + "/_CENTREON_PATH_PLACEHOLDER_/index.php" + '?autologin=1' + '&useralias=' + username + '&token=' + token,
        initialized: true
      })
    }
  }

  onCopy = () => {
    let autoLoginInput = document.getElementById("autologin-input");
    autoLoginInput.select();
    document.execCommand('copy');
    this.setState({ 
      copied: true,
      toggled: false
    });
  };

  componentWillMount() {
    window.addEventListener('mousedown', this.handleClick, false);
  };

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleClick, false);
  };

  handleClick = (e) => {
    if (this.profile.contains(e.target)) {
      return;
    }
    this.setState({
      toggled: false
    });
  };

  render() {
    const { data, clockData } = this.props;

    if (!data) {
      return null;
    }

    const { toggled, copied, buildedLink } = this.state,
      { fullname, username, autologinkey } = data;

    return (
      <div class={"wrap-right-user" + (toggled ? " submenu-active" : "")}>
        <Clock clockData={clockData} />
        <div ref={profile => this.profile = profile}>
          <span class="iconmoon icon-user" onClick={this.toggle.bind(this)} />
          <div class={"submenu profile"}>
            <div class="submenu-inner">
              <ul class="submenu-items list-unstyled">
                <li class="submenu-item">
                  <span class="submenu-item-link">
                    <span class="submenu-user-name">{fullname}</span>
                    <span class="submenu-user-type">as {username}</span>
                    <a class="submenu-user-edit" href={config.urlBase + "main.php?p=50104&o=c"}>
                      Edit profile
                    </a>
                  </span>
                </li>
                <React.Fragment>
                  <button className={`submenu-user-button ${(autologinkey ? 'shown' : 'hidden')}`}  onClick={this.onCopy.bind(this)}>Copy autologin link <span className={`btn-logout-icon ${(copied ? 'icon-copied' : 'icon-copy')}`}></span></button>
                  <textarea id="autologin-input" style={
                    {
                      width: 0,
                      height: 0,
                      position: 'fixed',
                      top: -100
                    }
                  }
                    value={buildedLink}></textarea>
                </React.Fragment>
              </ul>
              <div class="button-wrap">
                <a href={config.urlBase + "index.php?disconnect=1"}>
                  <button class="btn btn-small logout">Log out</button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserMenu;
