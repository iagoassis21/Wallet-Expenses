import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAPI } from '../redux/actions';

class Header extends Component {
  componentDidMount() {
    const { fetchAPI: getData } = this.props;
    getData();
  }

  render() {
    const { email, currencies } = this.props;
    return (
      <div>
        <p data-testid="email-field">
          { email }
        </p>
        <p data-testid="total-field"> 0 </p>
        <p data-testid="header-currency-field"> BRL </p>
        <p data-testid="value-input" />
        <p data-testid="description-input" />
        <label htmlFor="currency-input">
          Moeda
          <select data-testid="currency-input" id="currency-input">
            {currencies.map((value, key) => (
              <option key={ key }>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="method-input">
          Método de Pagamento
          <select data-testid="method-input" id="method-input">
            <option>Dinheiro</option>
            <option>Cartão de crédito</option>
            <option>Cartão de débito</option>
          </select>
        </label>
        <label htmlFor="tag-input">
          Método de Pagamento
          <select data-testid="tag-input" id="tag-input">
            <option>Alimentação</option>
            <option>Lazer</option>
            <option>Trabalho</option>
            <option>Transporte</option>
            <option>Saúde</option>
          </select>
        </label>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchAPI: () => dispatch(fetchAPI()),
});

const mapStateToProps = (state) => ({
  email: state.user.email,
  currencies: state.wallet.currencies,
});

Header.propTypes = {
  email: PropTypes.string.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchAPI: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
