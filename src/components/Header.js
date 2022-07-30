import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAPI, saveExpenseAction } from '../redux/actions';

class Header extends Component {
  constructor() {
    super();

    this.state = {
      id: 0,
      value: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
      description: '',
    };
  }

  componentDidMount() {
    const { fetchAPI: getData } = this.props;
    getData();
  }

  handleInputChange = ({ target }) => {
    const { name, type } = target;
    const value = type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [name]: value,
    });
  }

  handleAddExpenses = () => {
    let numberForId = 1;
    const { id } = this.state;
    const { saveExpenseAction: sendExpenses } = this.props;
    sendExpenses(this.state);
    this.setState({
      id: numberForId += id,
      value: '',
      description: '',
    });
  }

  render() {
    const { value, description, currency, method, tag } = this.state;
    const { email, currencies, expenses } = this.props;
    const sum = expenses
      .reduce((acc, curr) => (
        acc + Number(curr.value) * Number(curr.exchangeRates[curr.currency].ask)), 0);
    return (
      <div>
        <p data-testid="email-field">
          { email }
        </p>

        <p data-testid="total-field">
          { sum.toFixed(2) }
        </p>
        <p data-testid="header-currency-field"> BRL </p>

        <label htmlFor="value-input">
          Valor da despesa
          <input
            data-testid="value-input"
            id="value-input"
            name="value"
            value={ value }
            onChange={ this.handleInputChange }
          />
        </label>
        <label htmlFor="description-input">
          Descrição
          <input
            data-testid="description-input"
            id="description-input"
            name="description"
            value={ description }
            onChange={ this.handleInputChange }
          />
        </label>
        <label htmlFor="currency-input">
          Moeda
          <select
            data-testid="currency-input"
            id="currency-input"
            name="currency"
            value={ currency }
            onChange={ this.handleInputChange }
          >
            {currencies.map((values, key) => (
              <option key={ key }>
                {values}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="method-input">
          Método de Pagamento
          <select
            data-testid="method-input"
            id="method-input"
            name="method"
            value={ method }
            onChange={ this.handleInputChange }
          >
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão de crédito">Cartão de crédito</option>
            <option value="Cartão de débito">Cartão de débito</option>
          </select>
        </label>
        <label htmlFor="tag-input">
          Categoria
          <select
            data-testid="tag-input"
            id="tag-input"
            name="tag"
            value={ tag }
            onChange={ this.handleInputChange }
          >
            <option value="Alimentação">Alimentação</option>
            <option value="Lazer">Lazer</option>
            <option value="Trabalho">Trabalho</option>
            <option value="Transporte">Transporte</option>
            <option value="Saúde">Saúde</option>
          </select>
        </label>
        <button
          type="button"
          onClick={ this.handleAddExpenses }
        >
          Adicionar despesa
        </button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchAPI: () => dispatch(fetchAPI()),
  saveExpenseAction: (state) => dispatch(saveExpenseAction(state)),
});

const mapStateToProps = (state) => ({
  email: state.user.email,
  currencies: state.wallet.currencies,
  expenses: state.wallet.expenses,
});

Header.propTypes = {
  email: PropTypes.string.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchAPI: PropTypes.func.isRequired,
  saveExpenseAction: PropTypes.func.isRequired,
  reduce: PropTypes.func.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
