import React from 'react';
import './App.css';
import styled from 'styled-components'
import Cleave from 'cleave.js/react'

const RowCenter = styled.div`
  display: flex;
  justify-content: center;
`
const ColumnCenter = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`
const InputContainer = styled.div`
  padding: 5px;
`
const percent = n => (n*100).toFixed(2) + "%"
const dollars = n => "$" + n.toFixed(2)
const SimpleTable = ({ matrix }) => {
  console.log('matrix', matrix)
  return (
    <table>
      <tbody>
        {
          matrix.map((row, i) => (
            <tr key={i}>
            {
              row.map((val, j) => <td key={`${i} ${j}`}>{val}</td>)
            }
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

const states = [
  {
    'abbr': 'OR',
    'income_tax': .099,
    'property_tax': .014
  },
  {
    'abbr': 'UT',
    'income_tax': .0495,
    'property_tax': .0066
  },
  {
    'abbr': 'ID',
    'income_tax': .06925,
    'property_tax': .0075
  },
  {
    'abbr': 'NV',
    'income_tax': 0,
    'property_tax': .0069
  },
  {
    'abbr': 'CO',
    'income_tax': .0463,
    'property_tax': .0055
  },
  {
    'abbr': 'WA',
    'income_tax': 0,
    'property_tax': .0103
  },
  {
    'abbr': 'CA',
    // .123 for top tax bracket, but idk this seems more reasonable ($500k for top)
    'income_tax': .1,
    'property_tax': .0077
  }
]
const statesMap = states.reduce((prev, curr) => {
  prev[curr.abbr] = curr
  return prev
}, {})
console.log(statesMap)

// options: {key: string, value: string}[], onChange: string => void
const Select = ({ options, onChange }) => {
  return (
    <select onChange={ev => onChange(ev.target.value)}>
      <option value={''} key={-1}>{''}</option>
      {
        options.map(({ key, value }, i) => (
          <option value={value} key={i}>{key}</option>
        ))
      }
    </select>
  )
}
const calculateMortgage = (principal, percentageRate, lengthOfLoan) => {
  return (principal * percentageRate) / (1 - (Math.pow((1 + percentageRate) , lengthOfLoan * -1)));
}
const fin = n => +(n.toFixed(2))
const NumberInput = (props) => {
  return (
    <Cleave 
      options={{
        numeral: true,
        numeralThousandsGroupStyle: 'thousand'
      }}
      onChange={ev => props.onChange(ev, ev.target.rawValue)}
    />
  )
}
const App = () => {
  const [listPrice, setListPrice] = React.useState(NaN)
  const [projectedMonthlyRent, setProjectedMonthlyRent] = React.useState(NaN)
  const [usStateName, setUsStateName] = React.useState('')

  const mortgageRate = .035
  const mortgageLengthYears = 30
  const mortgagePayments = fin(calculateMortgage(listPrice, mortgageRate / 12, mortgageLengthYears * 12))
  const mortgage = mortgagePayments * 12

  const projectedIncome = projectedMonthlyRent*12
  const usState = statesMap[usStateName]

  const propertyTaxPercentage = usState ? usState.property_tax : NaN
  const propertyTax = fin(listPrice * propertyTaxPercentage)

  const incomeTaxPercentage = usState ? usState.income_tax : NaN
  const incomeTax = fin(projectedIncome * incomeTaxPercentage)
  // property tax and income tax based on dropdown
  // TODO(rdg) vacancy rate, repairs, and replacement reserve based on input fields with stored values
  const vacancyRatePercentage = .07
  const vacancyRate = fin(projectedIncome * vacancyRatePercentage)

  const repairsPercentage = .05
  const repairs = fin(projectedIncome * repairsPercentage)

  const replacementReservePercentage = .05
  const replacementReserve = fin(projectedIncome * replacementReservePercentage)

  const propertyInsurancePercentage = .005
  const propertyInsurance = fin(listPrice * propertyInsurancePercentage)
  
  const operatingExpenses = fin(incomeTax + propertyTax + propertyInsurance + vacancyRate + repairs + replacementReserve)
  const netExpenses = operatingExpenses + mortgage
  const income = fin(projectedIncome - netExpenses)
  const downPayment = listPrice*.2
  const cashOnCash = fin(income / downPayment)

  const options = states.map(({ abbr }) => ({ key: abbr, value: abbr }))
  // TODO(rdg) put in a hook
    return (
      <div className="App">
        <RowCenter>
          <InputContainer>
            {"list price: "}
            <NumberInput onChange={(_, v) => setListPrice(v)} />
          </InputContainer>
          <InputContainer>
            {"projected rent ($/month): "}
            <NumberInput onChange={(_, v) => setProjectedMonthlyRent(v)} />
          </InputContainer>
          <InputContainer>
            {"state: "}
            <Select
              options={options}
              onChange={setUsStateName}
            />
          </InputContainer>
        </RowCenter>
        <br/>
        <RowCenter>
          <ColumnCenter>
            <div>Figures are annual unless otherwise noted.</div>
            <br />
            <SimpleTable matrix={[
              ['monthly mortgage payment: ', dollars(mortgagePayments), percent(mortgageRate / 12)],
              ['mortgage: ', dollars(mortgage), percent(mortgageRate)],
              ['-', '-', '-'],
              ['income tax: ', dollars(incomeTax), percent(incomeTaxPercentage)],
              ['property tax: ', dollars(propertyTax), percent(propertyTaxPercentage)],
              ['property insurance: ', dollars(propertyInsurance), percent(propertyInsurancePercentage)],
              ['vacancy rate: ', dollars(vacancyRate), percent(vacancyRatePercentage)],
              ['repairs: ', dollars(repairs), percent(repairsPercentage)],
              ['replacement reserve: ', dollars(replacementReserve), percent(replacementReservePercentage)],
              ['operating expenses: ', dollars(operatingExpenses), undefined],
              ['-', '-', '-'],
              ['net expenses: ', dollars(netExpenses), undefined],
              ['income: ', dollars(income), undefined],
              ['cash on cash: ', undefined, percent(cashOnCash)]
            ]} />
          </ColumnCenter>
        </RowCenter>
      </div>
    );
}

export default App;
