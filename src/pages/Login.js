import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveUserAction } from '../redux/actions';
import './Login.css';

class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      email: '',
      pass: '',
    };
  }

  checkUserInfo = () => {
    const regexCheck = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const { email, pass } = this.state;
    const minLength = 6;
    if (regexCheck.test(email) && pass.length >= minLength) {
      return false;
    }
    return true;
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    }, () => { this.checkUserInfo(); });
  }

  handleSubmit = () => {
    const { email } = this.state;
    const { history, saveUserAction: sendUser } = this.props;
    if (!localStorage.getItem('user')) {
      localStorage.setItem('user', email);
    }
    sendUser(email);
    history.push('/carteira');
  }

  render() {
    const { email, pass } = this.state;
    return (
      <div className="loginDiv">
        <div className="containerDiv">
          <h1 className="walletTittle">Wallet Expenses</h1>
          <form className="loginForm">
            <label htmlFor="emailInput">
              <input
                className="inputText"
                onChange={ this.handleChange }
                value={ email }
                name="email"
                data-testid="email-input"
                placeholder="email"
                id="emailInput"
                type="text"
              />
            </label>
            <label htmlFor="passInput">
              <input
                className="inputText"
                onChange={ this.handleChange }
                value={ pass }
                name="pass"
                data-testid="password-input"
                id="passInput"
                placeholder="senha"
                type="password"
              />
            </label>
            <button
              className="submitBtn"
              disabled={ this.checkUserInfo() }
              type="button"
              onClick={ this.handleSubmit }
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  saveUserAction: (state) => dispatch(saveUserAction(state)),
});

Login.propTypes = {
  saveUserAction: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
