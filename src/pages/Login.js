import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveUserAction } from '../redux/actions';

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
    sendUser(email);
    console.log(history);
    history.push('/carteira');
  }

  render() {
    const { email, pass } = this.state;
    return (
      <div>
        <form>
          <label htmlFor="emailInput">
            <input
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
            disabled={ this.checkUserInfo() }
            type="button"
            onClick={ this.handleSubmit }
          >
            Entrar
          </button>
        </form>
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
