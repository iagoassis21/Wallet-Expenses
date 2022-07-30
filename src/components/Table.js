import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteExpenseAction, setIdExpenseAction } from '../redux/actions';

class Table extends Component {
  handleDeleteExpense(id) {
    const { deleteExpenseAction: sendId, expenses } = this.props;
    const newExpenses = expenses.filter((expense) => expense.id !== id);
    sendId(newExpenses);
  }

  handleEditExpense(id) {
    const { expenses, setIdExpenseAction: setExpenseId } = this.props;
    const getExpense = expenses.find((item) => item.id === id);
    setExpenseId(getExpense);
  }

  render() {
    const { expenses } = this.props;
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tag</th>
              <th>Método de pagamento</th>
              <th>Valor</th>
              <th>Moeda</th>
              <th>Câmbio utilizado</th>
              <th>Valor convertido</th>
              <th>Moeda de conversão</th>
              <th>Editar/Excluir</th>
            </tr>
          </thead>
          <tbody>
            { expenses.map(({
              id,
              description,
              tag,
              method,
              value,
              currency,
              exchangeRates,
            }) => (
              <tr key={ id }>
                <td>
                  { description }
                </td>
                <td>
                  { tag }
                </td>
                <td>
                  { method }
                </td>
                <td>
                  { Number(value).toFixed(2) }
                </td>
                <td>
                  { exchangeRates[currency].name }
                </td>
                <td>
                  { Number(exchangeRates[currency].ask).toFixed(2) }
                </td>
                <td>
                  { Number(value * exchangeRates[currency].ask).toFixed(2) }
                </td>
                <td>Real</td>
                <td>
                  <button
                    data-testid="edit-btn"
                    type="button"
                    onClick={ () => this.handleEditExpense(id) }
                  >
                    Editar
                  </button>
                  <button
                    data-testid="delete-btn"
                    type="button"
                    onClick={ () => this.handleDeleteExpense(id) }
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  deleteExpenseAction: (state) => dispatch(deleteExpenseAction(state)),
  setIdExpenseAction: (state) => dispatch(setIdExpenseAction(state)),
});

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
});

Table.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.string).isRequired,
  deleteExpenseAction: PropTypes.func.isRequired,
  setIdExpenseAction: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);
